<script lang="ts">
	import { PUBLIC_BASE_URL } from '$lib/config';
	import { screenSize, updateScreenSize } from '$lib/screen';

	import { Container, Row, Toast, ToastBody } from '@sveltestrap/sveltestrap';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Control from './Control.svelte';
	import Settings from './Settings.svelte';
	import Status from './Status.svelte';
	import { uiSettings } from '$lib/uiSettings';

	let settings = writable({
		fgColor: '0',
		bgColor: '0'
	});

	// let uiSettings = writable({
	// 	inputSize: 'sm',
	// 	selectClass: '',
	// 	btnSize: 'lg'
	// });

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
		fetch(`${PUBLIC_BASE_URL}/api/status`, { credentials: 'same-origin' })
			.then((res) => res.json())
			.then((data) => {
				status.set(data);
			});
	};

	const fetchSettingsData = () => {
		fetch(PUBLIC_BASE_URL + `/api/settings`, { credentials: 'same-origin' })
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

		function handleResize() {
			updateScreenSize();
		}

		// Add an event listener to update the screen size when the window is resized
		window.addEventListener('resize', handleResize);

		// Call the function initially to set the initial screen size
		updateScreenSize();

		// Cleanup function to remove the event listener when the component is destroyed
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	$: {
		const lgBreakpoint = parseInt(
			getComputedStyle(document.documentElement).getPropertyValue('--bs-breakpoint-lg')
		);

		if ($screenSize >= lgBreakpoint) {
			uiSettings.set({
				inputSize: 'sm',
				selectClass: 'form-select-sm',
				btnSize: 'sm'
			});
		} else {
			uiSettings.set({
				inputSize: 'lg',
				selectClass: 'form-select-lg',
				btnSize: 'xl'
			});
		}
	}

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
		<Control bind:settings on:showToast={showToast} bind:status lg="3" xxl="4"></Control>
		<Status bind:settings bind:status lg="6" xxl="4"></Status>
		<Settings bind:settings on:showToast={showToast} on:formReset={fetchSettingsData} lg="3" xxl="4"
		></Settings>
	</Row>
</Container>
<div class="position-fixed bottom-0 end-0 p-2">
	<div class="">
		<Toast
			isOpen={toastIsOpen}
			class="me-1 bg-{toastColor} text-bg-{toastColor}"
			autohide
			on:close={() => (toastIsOpen = false)}
		>
			<ToastBody>
				{toastBody}
			</ToastBody>
		</Toast>
	</div>
</div>
