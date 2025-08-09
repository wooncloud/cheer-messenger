<script lang="ts">
	export let description: string
</script>

<div>
	<label for="description" class="block text-sm font-medium mb-2">모임 설명</label>
	<textarea
		id="description"
		bind:value={description}
		placeholder="모임에 대한 간단한 설명을 입력하세요 (선택사항)"
		maxlength="500"
		rows="4"
		class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
	></textarea>
	<p class="text-sm text-muted-foreground mt-1">{description.length}/500자</p>
</div>