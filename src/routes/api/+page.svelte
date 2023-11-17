<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Col, Container, Row, Button } from 'sveltestrap';

	import { onMount } from 'svelte';
	//import * as swaggerJson from '../../../static/swagger.json';
	//	import SwaggerUI from 'swagger-ui';
	import 'swagger-ui/dist/swagger-ui.css';

	let swaggerLoaded:boolean = false;

	onMount(async () => {
		// @ts-ignore
		loadSwagger();
	});

	const loadSwagger = () => {
		if (!SwaggerUIBundle)
			return;
		swaggerLoaded = true;
		window.ui = SwaggerUIBundle({
				url: '/swagger.json',
				dom_id: '#swagger-ui-container',
				presets: [
					// @ts-ignore
					SwaggerUIBundle.presets.apis,
					// @ts-ignore
					SwaggerUIStandalonePreset
				],
				//	layout: "StandaloneLayout",
				});
			}
		
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
	<section class:invisible={swaggerLoaded}><Button  on:click="{loadSwagger}">Load</Button></section>
	<div id="swagger-ui-container" />

</Container>
