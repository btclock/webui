<script lang="ts">
	export let status = {};
	import RocketIcon from '../icons/RocketIcon.svelte';
	import PickaxeIcon from '../icons/PickaxeIcon.svelte';

	const isSplitText = (str: string) => {
		return str.includes('/');
	};
</script>

<div class="btclock-wrapper" id="btclock-wrapper">
	<div class="btclock">
		{#each status.data as char}
			{#if isSplitText(char)}
				<div class="splitText">
					{#each char.split('/') as part}
						<div class="flex-items">{part}</div>
					{/each}
				</div>
			{:else if char.startsWith('mdi')}
				<div class="digit icon">
					{#if char.endsWith('rocket')}
						<RocketIcon></RocketIcon>
					{/if}
					{#if char.endsWith('pickaxe')}
						<PickaxeIcon></PickaxeIcon>
					{/if}
				</div>
			{:else if char === 'STS'}
				<div class="digit sats"></div>
			{:else if char.length >= 3}
				<div class="mediumText">{char}</div>
			{:else if char.length === 0 || char === ' '}
				<div class="digit">&nbsp;&nbsp;</div>
			{:else}
				<div class="digit">{char}</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.icon {
		fill: currentColor;
	}
</style>
