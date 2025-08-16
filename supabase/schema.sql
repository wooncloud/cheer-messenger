-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (profiles)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invite_code VARCHAR(36) UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    max_members INTEGER DEFAULT 50 CHECK (max_members > 0 AND max_members <= 1000),
    praise_cooldown_value INTEGER DEFAULT 1 CHECK (praise_cooldown_value >= 0),
    praise_cooldown_unit VARCHAR(20) DEFAULT 'day' CHECK (praise_cooldown_unit IN ('none', 'second', 'minute', 'hour', 'day', 'week', 'month', 'year')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group members table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(group_id, user_id, is_active) -- Prevent active duplicate memberships
);

-- Praise messages table
CREATE TABLE praise_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) DEFAULT '👍',
    message TEXT CHECK (LENGTH(message) <= 500),
    is_public BOOLEAN DEFAULT TRUE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT no_self_praise CHECK (sender_id != receiver_id)
);

-- Praise cooldowns table
CREATE TABLE praise_cooldowns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_praised_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, sender_id, receiver_id)
);

-- Indexes for performance
CREATE INDEX idx_groups_owner_id ON groups(owner_id);
CREATE INDEX idx_groups_invite_code ON groups(invite_code);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_active ON group_members(group_id, user_id, is_active);
CREATE INDEX idx_praise_messages_group_id ON praise_messages(group_id);
CREATE INDEX idx_praise_messages_receiver_id ON praise_messages(receiver_id);
CREATE INDEX idx_praise_messages_sender_id ON praise_messages(sender_id);
CREATE INDEX idx_praise_messages_created_at ON praise_messages(created_at DESC);
CREATE INDEX idx_praise_cooldowns_lookup ON praise_cooldowns(group_id, sender_id, receiver_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_praise_messages_updated_at BEFORE UPDATE ON praise_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_praise_cooldowns_updated_at BEFORE UPDATE ON praise_cooldowns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE praise_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE praise_cooldowns ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups policies
CREATE POLICY "Users can view groups they are members of" ON groups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM group_members 
            WHERE group_members.group_id = groups.id 
            AND group_members.user_id = auth.uid() 
            AND group_members.is_active = TRUE
        )
    );

CREATE POLICY "Users can create groups" ON groups
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Group owners can update their groups" ON groups
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Group owners can delete their groups" ON groups
    FOR DELETE USING (auth.uid() = owner_id);

-- Group members policies
CREATE POLICY "Users can view members of their groups" ON group_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM group_members gm2 
            WHERE gm2.group_id = group_members.group_id 
            AND gm2.user_id = auth.uid() 
            AND gm2.is_active = TRUE
        )
    );

CREATE POLICY "Users can join groups" ON group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" ON group_members
    FOR UPDATE USING (auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM groups 
            WHERE groups.id = group_members.group_id 
            AND groups.owner_id = auth.uid()
        )
    );

-- Praise messages policies
CREATE POLICY "Users can view praise messages in their groups" ON praise_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM group_members 
            WHERE group_members.group_id = praise_messages.group_id 
            AND group_members.user_id = auth.uid() 
            AND group_members.is_active = TRUE
        )
    );

CREATE POLICY "Users can create praise messages in their groups" ON praise_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM group_members 
            WHERE group_members.group_id = praise_messages.group_id 
            AND group_members.user_id = auth.uid() 
            AND group_members.is_active = TRUE
        ) AND
        EXISTS (
            SELECT 1 FROM group_members 
            WHERE group_members.group_id = praise_messages.group_id 
            AND group_members.user_id = praise_messages.receiver_id 
            AND group_members.is_active = TRUE
        )
    );

CREATE POLICY "Users can delete their own praise messages" ON praise_messages
    FOR DELETE USING (auth.uid() = sender_id);

-- Praise cooldowns policies
CREATE POLICY "Users can view their own cooldowns" ON praise_cooldowns
    FOR SELECT USING (auth.uid() = sender_id);

CREATE POLICY "System can manage cooldowns" ON praise_cooldowns
    FOR ALL USING (TRUE);

-- Functions for business logic
CREATE OR REPLACE FUNCTION can_praise_user(
    p_group_id UUID,
    p_sender_id UUID,
    p_receiver_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_cooldown_value INTEGER;
    v_cooldown_unit TEXT;
    v_last_praised_at TIMESTAMPTZ;
    v_cooldown_interval INTERVAL;
BEGIN
    -- Check if sender and receiver are both active members
    IF NOT EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = p_group_id AND user_id = p_sender_id AND is_active = TRUE
    ) OR NOT EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = p_group_id AND user_id = p_receiver_id AND is_active = TRUE
    ) THEN
        RETURN FALSE;
    END IF;

    -- Get group cooldown settings
    SELECT praise_cooldown_value, praise_cooldown_unit 
    INTO v_cooldown_value, v_cooldown_unit
    FROM groups 
    WHERE id = p_group_id;

    -- If no cooldown, always allow
    IF v_cooldown_unit = 'none' THEN
        RETURN TRUE;
    END IF;

    -- Get last praise time
    SELECT last_praised_at INTO v_last_praised_at
    FROM praise_cooldowns
    WHERE group_id = p_group_id AND sender_id = p_sender_id AND receiver_id = p_receiver_id;

    -- If no previous praise, allow
    IF v_last_praised_at IS NULL THEN
        RETURN TRUE;
    END IF;

    -- Calculate cooldown interval
    CASE v_cooldown_unit
        WHEN 'second' THEN v_cooldown_interval := v_cooldown_value * INTERVAL '1 second';
        WHEN 'minute' THEN v_cooldown_interval := v_cooldown_value * INTERVAL '1 minute';
        WHEN 'hour' THEN v_cooldown_interval := v_cooldown_value * INTERVAL '1 hour';
        WHEN 'day' THEN v_cooldown_interval := v_cooldown_value * INTERVAL '1 day';
        WHEN 'week' THEN v_cooldown_interval := v_cooldown_value * INTERVAL '1 week';
        WHEN 'month' THEN v_cooldown_interval := v_cooldown_value * INTERVAL '1 month';
        WHEN 'year' THEN v_cooldown_interval := v_cooldown_value * INTERVAL '1 year';
        ELSE v_cooldown_interval := INTERVAL '1 day';
    END CASE;

    -- Check if cooldown has passed
    RETURN (NOW() - v_last_praised_at) >= v_cooldown_interval;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update cooldown after praise
CREATE OR REPLACE FUNCTION update_praise_cooldown()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO praise_cooldowns (group_id, sender_id, receiver_id, last_praised_at)
    VALUES (NEW.group_id, NEW.sender_id, NEW.receiver_id, NOW())
    ON CONFLICT (group_id, sender_id, receiver_id)
    DO UPDATE SET 
        last_praised_at = NOW(),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update cooldown after creating praise
CREATE TRIGGER update_cooldown_after_praise
    AFTER INSERT ON praise_messages
    FOR EACH ROW EXECUTE FUNCTION update_praise_cooldown();

-- Function to get user groups with member counts (해결: N+1 쿼리 문제)
CREATE OR REPLACE FUNCTION get_user_groups_with_counts(p_user_id UUID)
RETURNS TABLE (
    group_id UUID,
    role TEXT,
    joined_at TIMESTAMPTZ,
    group_name TEXT,
    group_description TEXT,
    member_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gm.group_id,
        gm.role,
        gm.joined_at,
        g.name as group_name,
        g.description as group_description,
        get_group_member_count(gm.group_id) as member_count
    FROM group_members gm
    JOIN groups g ON g.id = gm.group_id
    WHERE gm.user_id = p_user_id 
    AND gm.is_active = TRUE
    ORDER BY gm.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;