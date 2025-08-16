<script lang="ts">
	export let id: string;
	export let name: string;
	export let type: string = 'text';
	export let label: string;
	export let placeholder: string = '';
	export let required: boolean = false;
	export let maxlength: number | undefined = undefined;
	export let value: string = '';
	export let error: boolean = false;
	export let helpText: string = '';
	export let showCounter: boolean = false;
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
	<label for={id} class="block text-sm font-medium text-gray-700 mb-2">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
	
	{#if type === 'url'}
		<input
			{id}
			{name}
			type="url"
			{placeholder}
			{required}
			{maxlength}
			bind:value
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			class:border-red-300={error}
		/>
	{:else}
		<input
			{id}
			{name}
			type="text"
			{placeholder}
			{required}
			{maxlength}
			bind:value
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			class:border-red-300={error}
		/>
	{/if}
	
	{#if showCounter && maxlength}
		<p class="text-sm text-gray-500 mt-1">{value.length}/{maxlength}자</p>
	{/if}
	
	{#if helpText}
		<p class="text-xs text-gray-500 mt-1">
			{helpText}
		</p>
	{/if}
</div>