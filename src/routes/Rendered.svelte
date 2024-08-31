<script lang="ts">
	export let status = {};
	import RocketIcon from '../icons/RocketIcon.svelte';
	import PickaxeIcon from '../icons/PickaxeIcon.svelte';
	import ZapIcon from '../icons/ZapIcon.svelte';

	const isSplitText = (str: string) => {
		return str.includes('/');
	};

	export let className = 'btclock-wrapper';
</script>

<div class={className}>
	<div class="btclock">
		{#each status.data as char}
			{#if isSplitText(char)}
				<div class="splitText">
					{#if char.split('/').length}
						<span class="top-text">{char.split('/')[0]}</span>
						<hr />
						<span class="bottom-text">{char.split('/')[1]}</span>
					{/if}
					<!-- {#each char.split('/') as part}
						<div class="flex-items">{part}</div>
					{/each} -->
				</div>
			{:else if char.startsWith('mdi')}
				<div class="digit icon">
					{#if char.endsWith('rocket')}
						<RocketIcon></RocketIcon>
					{/if}
					{#if char.endsWith('pickaxe')}
						<PickaxeIcon></PickaxeIcon>
					{/if}
					{#if char.endsWith('bolt')}
						<ZapIcon></ZapIcon>
					{/if}
				</div>
			{:else if char === 'STS'}
				<div class="digit sats">S</div>
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
