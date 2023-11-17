<script lang="ts">
    import { PUBLIC_BASE_URL } from '$env/static/public';

	import { _ } from 'svelte-i18n';
	import { Col, Container, Row } from 'sveltestrap';

	import Control from './Control.svelte';
	import Status from './Status.svelte';
	import Settings from './Settings.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	let settings = writable({});

	onMount(() => {
		fetch( PUBLIC_BASE_URL + `/api/settings`)
			.then((res) => res.json())
			.then((data) => {
				data.fgColor = String(data.fgColor);
				data.bgColor = String(data.bgColor);
				settings.set(data);
			});
	});
</script>

<Container fluid>
	<Row>
		<Control bind:settings></Control>
		<Status  bind:settings></Status>
		<Settings bind:settings></Settings>
	</Row>
</Container>
