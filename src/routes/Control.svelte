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
					<Label md={6} for="customText">{ $_('section.control.text') }</Label>
					<Col md="6">
						<Input type="text" id="customText" bind:value={customText} bsSize="sm" maxLength="{$settings.numScreens}"/>
					</Col>
				</Row>
                <Button color="primary" on:click={setCustomText}>{ $_('section.control.showText') }</Button>

			</Form>
			<hr />
			<h3>LEDs</h3>
            <Form>
				<Row>
					<Label md={6} for="ledColorPicker" size="sm">{ $_('section.control.ledColor') }</Label>
					<Col md="6">
						<Input type="color" id="ledColorPicker" bind:value="{ledColor}" />
					</Col>
				</Row>
                <Button color="secondary" id="turnOffLedsBtn" on:click={turnOffLeds}>{ $_('section.control.turnOff') }</Button>
                <Button color="primary" on:click={setLEDcolor}>{ $_('section.control.setColor') }</Button>
			</Form>

			<hr />
			<h3>{ $_('section.control.systemInfo') }</h3>
			<ul class="small system_info">
				<li>{ $_('section.control.version') }: {$settings.gitRev}</li>
				<li>{ $_('section.control.buildTime') }: {new Date(($settings.lastBuildTime * 1000)).toLocaleString()}</li>
				<li>IP: {$settings.ip}</li>
				<li>Hostname: {$settings.hostname}</li>
			</ul>
            <Button color="danger" id="restartBtn" on:click="{restartClock}">{ $_('button.restart') }</Button>
            <Button color="warning" id="forceFullRefresh" on:click="{forceFullRefresh}">{ $_('button.forceFullRefresh') }</Button>
		</CardBody>
	</Card>
</Col>
