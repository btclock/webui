<script lang="ts">
import { PUBLIC_BASE_URL } from '$env/static/public';
import { _ } from 'svelte-i18n';
import {
    Button,
    ButtonGroup,
    Card,
    CardTitle,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Input,
    Label,
    Row
} from 'sveltestrap';

export let settings = {};
export let customText:String;
export let ledColor:String = "#FFCC00";


const setCustomText = () => {
    fetch(`${PUBLIC_BASE_URL}/api/show/text/${customText}`).catch(err => { });
};

const setLEDcolor = () => {
    console.log(`${PUBLIC_BASE_URL}/api/lights/${ledColor}`);
    fetch(`${PUBLIC_BASE_URL}/api/lights/${encodeURIComponent(ledColor.replace(/^#/, ''))}`).catch(err => { });
};

const turnOffLeds = () => {
    fetch(`${PUBLIC_BASE_URL}/api/lights/off`).catch(err => { });
};

const restartClock = () => {
    fetch(`${PUBLIC_BASE_URL}/api/restart`).catch(err => { });
}

const forceFullRefresh = () => {
    fetch(`${PUBLIC_BASE_URL}/api/full_refresh`).catch(err => { });
}

</script>

<Col>
	<Card>
		<CardHeader>
			<CardTitle>{$_('section.control.title', { default: 'Control' })}</CardTitle>
		</CardHeader>
		<CardBody>
			<Form>
				<Row>
					<Label md={6} for="customText" size="sm">Text</Label>
					<Col md="6">
						<Input type="text" id="customText" bind:value={customText} bsSize="sm" maxLength="{$settings.numScreens}"/>
					</Col>
				</Row>
                <Button color="primary" on:click={setCustomText}>Show text</Button>

			</Form>
			<hr />
			<h3>LEDs</h3>
            <Form>
				<Row>
					<Label md={6} for="ledColorPicker" size="sm">LEDs color</Label>
					<Col md="6">
						<Input type="color" id="ledColorPicker" bind:value="{ledColor}" />
					</Col>
				</Row>
                <Button color="secondary" id="turnOffLedsBtn" on:click={turnOffLeds}>Turn off</Button>
                <Button color="primary" on:click={setLEDcolor}>Set color</Button>
			</Form>

			<hr />
			<h3>System info</h3>
			<ul class="small system_info">
				<li>Version: {$settings.gitRev}</li>
				<li>Build time: {new Date(($settings.lastBuildTime * 1000)).toLocaleString()}</li>
				<li>IP: {$settings.ip}</li>
				<li>Hostname: {$settings.hostname}</li>
			</ul>
            <Button color="danger" id="restartBtn" on:click="{restartClock}">Restart</Button>
            <Button color="warning" id="forceFullRefresh" on:click="{forceFullRefresh}">Force full refresh</Button>
		</CardBody>
	</Card>
</Col>
