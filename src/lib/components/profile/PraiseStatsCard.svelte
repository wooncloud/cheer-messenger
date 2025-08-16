<script lang="ts">
	export let sentCount: number
	export let receivedCount: number
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
	<h2 class="text-lg font-semibold text-gray-900 mb-4">나의 칭찬 현황</h2>
	<div class="grid grid-cols-2 gap-4">
		<!-- 받은 칭찬 -->
		<div class="bg-blue-50 rounded-lg p-4 text-center">
			<div class="text-2xl font-bold text-blue-600 mb-1">
				{receivedCount}
			</div>
			<div class="text-sm text-gray-600">받은 칭찬</div>
		</div>

		<!-- 보낸 칭찬 -->
		<div class="bg-green-50 rounded-lg p-4 text-center">
			<div class="text-2xl font-bold text-green-600 mb-1">
				{sentCount}
			</div>
			<div class="text-sm text-gray-600">보낸 칭찬</div>
		</div>
	</div>
</div>