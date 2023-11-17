<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Col, Container, Row } from 'sveltestrap';

	import { onMount } from 'svelte';
	import * as swaggerJson from './swagger.json';
	//import SwaggerUI from 'swagger-ui';
	//import 'swagger-ui/dist/swagger-ui.css';

	onMount(async () => {
		// SwaggerUI({
		// 	spec: swaggerJson,
		// 	dom_id: '#swagger-ui-container'
		// });
	});
</script>

<svelte:head>
 <title>API playground</title>
</svelte:head>

<Container fluid>
    <div id="swagger-ui-container" />
</Container>
