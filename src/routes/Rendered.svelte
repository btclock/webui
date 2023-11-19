<script lang="ts">
	export let status = {};

	const isSplitText = (str: string) => {
		return str.includes('/');
	};
</script>

<div class="btcclock-wrapper" id="btcclock-wrapper">
	<div class="btclock">
		{#each status.data as char}
			{#if isSplitText(char)}
				<div class="splitText">
					{#each char.split('/') as part}
						<div class="flex-items">{part}</div>
					{/each}
				</div>
			{:else if char.length === 0 || char === ' '}
				<div class="digit">&nbsp;&nbsp;</div>
			{:else}
				<div class="digit">{char}</div>
			{/if}
		{/each}
	</div>
</div>
