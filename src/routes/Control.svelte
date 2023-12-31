<script lang="ts">
	import { PUBLIC_BASE_URL } from '$lib/config';
	import { onDestroy } from 'svelte';
	import { _ } from 'svelte-i18n';
	import type { Writable } from 'svelte/store';
	import {
		Button,
		Card,
		CardBody,
		CardHeader,
		CardTitle,
		Col,
		Form,
		Input,
		Label,
		Row
	} from 'sveltestrap';

	export let settings = {};
	export let customText: string;
	export let ledColor: string = '#FFCC00';
	export let status: Writable<{ leds: [] }>;
	let ledStatus = [];
	let keepLedsSameColor = false;

	const setCustomText = () => {
		fetch(`${PUBLIC_BASE_URL}/api/show/text/${customText}`).catch(() => {});
	};

	const checkSyncLeds = (e: Event) => {
		console.log('checksyncleds', keepLedsSameColor);
		if (keepLedsSameColor) {
			console.log(e.target.value);

			ledStatus.forEach((element, i) => {
				if (ledStatus[i].hex != e.target_value) {
					ledStatus[i].hex = e.target.value;
				}
			});
		}
	};

	const setLEDcolor = () => {
		console.log(`${PUBLIC_BASE_URL}/api/lights/${ledColor}`);
		fetch(`${PUBLIC_BASE_URL}/api/lights`, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'PATCH',
			body: JSON.stringify(ledStatus)
		}).catch(() => {});
	};

	const turnOffLeds = () => {
		fetch(`${PUBLIC_BASE_URL}/api/lights/off`).catch(() => {});
	};

	const restartClock = () => {
		fetch(`${PUBLIC_BASE_URL}/api/restart`).catch(() => {});
	};

	const forceFullRefresh = () => {
		fetch(`${PUBLIC_BASE_URL}/api/full_refresh`).catch(() => {});
	};

	let firstLedDataSubscription = () => {};

	firstLedDataSubscription = status.subscribe(async (val) => {
		if (val && val.leds) {
			ledStatus = val.leds.map((obj) => ({ ['hex']: obj['hex'] }));

			for (let led of ledStatus) {
				if (led['hex'] == '#000000') {
					led['hex'] = `#${Math.floor(Math.random() * 16777215)
						.toString(16)
						.padStart(6, '0')}`;
				}
			}

			firstLedDataSubscription();
		}
	});

	onDestroy(firstLedDataSubscription);
</script>

<Col>
	<Card>
		<CardHeader>
			<CardTitle>{$_('section.control.title', { default: 'Control' })}</CardTitle>
		</CardHeader>
		<CardBody>
			<Form>
				<Row>
					<Label md={4} for="customText">{$_('section.control.text')}</Label>
					<Col md="8">
						<Input
							type="text"
							id="customText"
							bind:value={customText}
							bsSize="sm"
							maxLength={$settings.numScreens}
						/>
					</Col>
				</Row>
				<Button color="primary" on:click={setCustomText}>{$_('section.control.showText')}</Button>
			</Form>
			<hr />
			<h3>LEDs</h3>
			<Form>
				<Row>
					<Label md={4} for="ledColorPicker" size="sm">{$_('section.control.ledColor')}</Label>
					<Col md="8">
						<Row class="justify-content-between">
							{#if ledStatus}
								{#each ledStatus as led, i}
									<Col>
										<Input
											type="color"
											id="ledColorPicker[{i}]"
											bind:value={led.hex}
											class="mx-auto"
											on:change={checkSyncLeds}
										/>
									</Col>
								{/each}
							{/if}
						</Row>
						<Row class="justify-content-between">
							<Col>
								<Input
									bind:checked={keepLedsSameColor}
									type="switch"
									class="mx-auto"
									label={$_('sections.control.keepSameColor')}
								/>
							</Col>
						</Row>
					</Col>
				</Row>
				<Button color="secondary" id="turnOffLedsBtn" on:click={turnOffLeds}
					>{$_('section.control.turnOff')}</Button
				>
				<Button color="primary" on:click={setLEDcolor}>{$_('section.control.setColor')}</Button>
			</Form>

			<hr />
			<h3>{$_('section.control.systemInfo')}</h3>
			<ul class="small system_info">
				<li>{$_('section.control.version')}: {$settings.gitRev}</li>
				<li>
					{$_('section.control.buildTime')}: {new Date(
						$settings.lastBuildTime * 1000
					).toLocaleString()}
				</li>
				<li>IP: {$settings.ip}</li>
				<li>{$_('section.control.hostname')}: {$settings.hostname}</li>
			</ul>
			<Button color="danger" id="restartBtn" on:click={restartClock}>{$_('button.restart')}</Button>
			<Button color="warning" id="forceFullRefresh" on:click={forceFullRefresh}
				>{$_('button.forceFullRefresh')}</Button
			>
		</CardBody>
	</Card>
</Col>
