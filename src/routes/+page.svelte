<script lang="ts">
	import { PUBLIC_BASE_URL } from '$lib/config';

	import { Container, Row, Toast, ToastBody } from 'sveltestrap';

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

	const fetchStatusData = () => {
		fetch(`${PUBLIC_BASE_URL}/api/status`)
			.then((res) => res.json())
			.then((data) => {
				status.set(data);
			});
	};

	const fetchSettingsData = () => {
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
	};

	onMount(() => {
		fetchSettingsData();
		fetchStatusData();

		const evtSource = new EventSource(`${PUBLIC_BASE_URL}/events`);

		evtSource.addEventListener('status', (e) => {
			let dataObj = JSON.parse(e.data);
			status.set(dataObj);
		});
	});

	let toastIsOpen = false;
	let toastColor = 'success';
	let toastBody = '';

	export const showToast = (event) => {
		toastIsOpen = true;
		toastColor = event.detail.color;
		toastBody = event.detail.text;
	};
</script>

<svelte:head>
	<title>BTClock</title>
</svelte:head>

<Container fluid>
	<Row>
		<Control bind:settings bind:status></Control>
		<Status bind:settings bind:status></Status>
		<Settings bind:settings on:showToast={showToast} on:formReset={fetchSettingsData}></Settings>
	</Row>
</Container>
<div class="position-fixed bottom-0 end-0 p-2">
	<div class="">
		<Toast
			isOpen={toastIsOpen}
			class="me-1 bg-{toastColor}"
			autohide
			on:close={() => (toastIsOpen = false)}
		>
			<ToastBody>
				{toastBody}
			</ToastBody>
		</Toast>
	</div>
</div>
