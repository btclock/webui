<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';

	import { Container, Row } from 'sveltestrap';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Control from './Control.svelte';
	import Settings from './Settings.svelte';
	import Status from './Status.svelte';

	let settings = writable({
		fgColor: '0'
	});

	let status = writable({
		data: ['L', 'O', 'A', 'D', 'I', 'N', 'G'],
		espFreeHeap: 0,
		espHeapSize: 0,
		connectionStatus: {
			price: false,
			blocks: false
		},
		leds: []
	});

	onMount(() => {
		fetch(PUBLIC_BASE_URL + `/api/settings`)
			.then((res) => res.json())
			.then((data) => {
				data.fgColor = String(data.fgColor);
				data.bgColor = String(data.bgColor);
				data.timePerScreen = data.timerSeconds / 60;

				if (data.fgColor > 65535) {
					data.fgColor = '65535';
				}

				if (data.bgColor > 65535) {
					data.bgColor = '65535';
				}
				settings.set(data);
			});

		fetch(`${PUBLIC_BASE_URL}/api/status`)
			.then((res) => res.json())
			.then((data) => {
				status.set(data);
			});

		const evtSource = new EventSource(`${PUBLIC_BASE_URL}/events`);

		evtSource.addEventListener('status', (e) => {
			let dataObj = JSON.parse(e.data);
			status.set(dataObj);
		});
	});
</script>

<svelte:head>
	<title>&#8383;TClock</title>
</svelte:head>

<Container fluid>
	<Row>
		<Control bind:settings bind:status></Control>
		<Status bind:settings bind:status></Status>
		<Settings bind:settings></Settings>
	</Row>
</Container>
