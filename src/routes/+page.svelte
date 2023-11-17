<script lang="ts">
    import { PUBLIC_BASE_URL } from '$env/static/public';

	import { _ } from 'svelte-i18n';
	import { Col, Container, Row } from 'sveltestrap';

	import Control from './Control.svelte';
	import Status from './Status.svelte';
	import Settings from './Settings.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	let settings = writable({
        fgColor: "0"
    });

	onMount(() => {
		fetch( PUBLIC_BASE_URL + `/api/settings`)
			.then((res) => res.json())
			.then((data) => {
				data.fgColor = String(data.fgColor);
				data.bgColor = String(data.bgColor);
                data.timePerScreen = data.timerSeconds / 60;

                if (data.fgColor> 65535) {
                    data.fgColor = "65535";
                }

                if (data.bgColor> 65535) {
                    data.bgColor = "65535";
                }
				settings.set(data);
			});
	});
</script>

<svelte:head>
	<title>&#8383;TClock</title>
</svelte:head>

<Container fluid>
	<Row>
		<Control bind:settings></Control>
		<Status  bind:settings></Status>
		<Settings bind:settings></Settings>
	</Row>
</Container>
