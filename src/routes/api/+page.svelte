<script lang="ts">
	import { Button, Container } from '@sveltestrap/sveltestrap';

	import { onMount } from 'svelte';
	let swaggerLoaded: boolean = false;

	onMount(async () => {
		loadSwagger();
	});

	const loadSwagger = () => {
		// @ts-expect-error: SwaggerUIBundle is loaded from external script from CDN
		if (!SwaggerUIBundle) return; // eslint-disable-line
		swaggerLoaded = true;
		// @ts-expect-error: SwaggerUIBundle is loaded from external script from CDN
		// eslint-disable-next-line
		window.ui = SwaggerUIBundle({
			url: '/swagger.json',
			dom_id: '#swagger-ui-container',
			presets: [
				// @ts-expect-error: SwaggerUIBundle is loaded from external script from CDN
				SwaggerUIBundle.presets.apis, // eslint-disable-line
				// @ts-expect-error: SwaggerUIStandalonePreset is loaded from external script from CDN
				SwaggerUIStandalonePreset // eslint-disable-line
			]
			//	layout: "StandaloneLayout",
		});
	};
</script>

<svelte:head>
	<title>API playground</title>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.0/swagger-ui-bundle.min.js"
		integrity="sha512-Ckle4LZv9LhAfEdohBdUi+QCu0e7HkXHTeSPXfbDzbCsR87QNTUBylkBEPsBNn4Ph83yK1hJ6f2uH4QMtB0hTA=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	></script>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.0/swagger-ui-standalone-preset.min.js"
		integrity="sha512-qwGi7EG31HcylzamsmacHLZJrfUGRuuHEaCMcOojuNpMu+paR554VjaCZ9LdUVTrmF8xC03YVqTzuKx0SDdruA=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	></script>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.0/swagger-ui.min.css"
		integrity="sha512-Ck+X9SARG7WscOTG4a8Qod5Zgd1MZlz4VtyyucjMJ3PnZy2lUl7q/v/0055yIfGM/v+f+216ME0/dv0qqtm6+g=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</svelte:head>

<Container fluid class="bg-light">
	<section class:invisible={swaggerLoaded}><Button on:click={loadSwagger}>Load</Button></section>
	<div id="swagger-ui-container" />
</Container>
