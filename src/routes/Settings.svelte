<script lang="ts">
	import { isValidNostrRelay, getPubKey, isValidHexPubKey } from '$lib';
	import { PUBLIC_BASE_URL } from '$lib/config';
	import { uiSettings } from '$lib/uiSettings';
	import { createEventDispatcher } from 'svelte';

	import { _ } from 'svelte-i18n';
	import {
		Button,
		Card,
		CardBody,
		CardHeader,
		CardTitle,
		Col,
		Form,
		FormText,
		Input,
		InputGroup,
		InputGroupText,
		Label,
		Row
	} from 'sveltestrap';

	export let settings;

	const wifiTxPowerMap = new Map<string, number>([
		['Default', 80],
		['19.5dBm', 78], // 19.5dBm
		['19dBm', 76], // 19dBm
		['18.5dBm', 74], // 18.5dBm
		['17dBm', 68], // 17dBm
		['15dBm', 60], // 15dBm
		['13dBm', 52], // 13dBm
		['11dBm', 44], // 11dBm
		['8.5dBm', 34], // 8.5dBm
		['7dBm', 28], // 7dBm
		['5dBm', 20] // 5dBm
	]);

	const dispatch = createEventDispatcher();

	const handleReset = (e: Event) => {
		e.preventDefault();
		dispatch('formReset');
	};

	const getTzOffsetFromSystem = () => {
		const dt = new Date();
		let diffTZ = dt.getTimezoneOffset();
		$settings.tzOffset = diffTZ * -1;
	};

	const onSave = async (e: Event) => {
		e.preventDefault();
		let formSettings = $settings;

		delete formSettings['gitRev'];
		delete formSettings['ip'];
		delete formSettings['lastBuildTime'];

		await fetch(`${PUBLIC_BASE_URL}/api/json/settings`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formSettings)
		})
			.then(() => {
				dispatch('showToast', {
					color: 'success',
					text: $_('section.settings.settingsSaved')
				});
			})
			.catch(() => {
				dispatch('showToast', {
					color: 'danger',
					text: $_('section.settings.errorSavingSettings')
				});
			});
	};

	let validNostrRelay = false;
	const testNostrRelay = async () => {
		validNostrRelay = await isValidNostrRelay($settings.nostrRelay);
	};

	const checkValidNostrPubkey = () => {
		$settings.nostrPubKey = getPubKey($settings.nostrPubKey);
	};

	const onFlBrightnessChange = async () => {
		await fetch(`${PUBLIC_BASE_URL}/api/frontlight/brightness/${$settings.flMaxBrightness}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};
</script>

<Col>
	<Card>
		<CardHeader>
			<CardTitle>{$_('section.settings.title', { default: 'Settings' })}</CardTitle>
		</CardHeader>
		<CardBody>
			<Form on:submit={onSave}>
				<Row>
					<Label md={6} for="fgColor" size={$uiSettings.inputSize}
						>{$_('section.settings.textColor', { default: 'Text color' })}</Label
					>
					<Col md="6">
						<Input
							type="select"
							bind:value={$settings.fgColor}
							name="select"
							id="fgColor"
							bsSize={$uiSettings.inputSize}
							class={$uiSettings.selectClass}
						>
							<option value="0">{$_('colors.black')}</option>
							<option value="65535">{$_('colors.white')}</option>
						</Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="bgColor" size={$uiSettings.inputSize}
						>{$_('section.settings.backgroundColor')}</Label
					>
					<Col md="6">
						<Input
							type="select"
							bind:value={$settings.bgColor}
							name="select"
							id="bgColor"
							bsSize={$uiSettings.inputSize}
							class={$uiSettings.selectClass}
						>
							<option value="0">{$_('colors.black')}</option>
							<option value="65535">{$_('colors.white')}</option>
						</Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="timePerScreen" size={$uiSettings.inputSize}
						>{$_('section.settings.timePerScreen')}</Label
					>
					<Col md="6">
						<InputGroup size={$uiSettings.inputSize}>
							<Input
								type="number"
								id="timePerScreen"
								min={1}
								step="1"
								bind:value={$settings.timePerScreen}
							/>
							<InputGroupText>{$_('time.minutes')}</InputGroupText>
						</InputGroup>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="fullRefreshMin" size={$uiSettings.inputSize}
						>{$_('section.settings.fullRefreshEvery')}</Label
					>
					<Col md="6">
						<InputGroup size={$uiSettings.inputSize}>
							<Input
								type="number"
								id="fullRefreshMin"
								min={1}
								step="1"
								bind:value={$settings.fullRefreshMin}
							/>
							<InputGroupText>{$_('time.minutes')}</InputGroupText>
						</InputGroup>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="minSecPriceUpd" size={$uiSettings.inputSize}
						>{$_('section.settings.timeBetweenPriceUpdates')}</Label
					>
					<Col md="6">
						<InputGroup size={$uiSettings.inputSize}>
							<Input
								type="number"
								id="minSecPriceUpd"
								min={1}
								step="1"
								bind:value={$settings.minSecPriceUpd}
							/>
							<InputGroupText>{$_('time.seconds')}</InputGroupText>
						</InputGroup>
						<FormText>{$_('section.settings.shortAmountsWarning')}</FormText>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="tzOffset" size={$uiSettings.inputSize}
						>{$_('section.settings.timezoneOffset')}</Label
					>
					<Col md="6">
						<InputGroup size={$uiSettings.inputSize}>
							<Input
								type="number"
								step="1"
								name="tzOffset"
								id="tzOffset"
								bind:value={$settings.tzOffset}
							/>
							<InputGroupText>{$_('time.minutes')}</InputGroupText>
							<Button type="button" color="info" on:click={getTzOffsetFromSystem}
								>{$_('auto-detect')}</Button
							>
						</InputGroup>
						<FormText>{$_('section.settings.tzOffsetHelpText')}</FormText>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="ledBrightness" size={$uiSettings.inputSize}
						>{$_('section.settings.ledBrightness')}</Label
					>
					<Col md="6">
						<Input
							type="range"
							name="ledBrightness"
							id="ledBrightness"
							bind:value={$settings.ledBrightness}
							min={0}
							max={255}
							step={1}
						/>
					</Col>
				</Row>
				{#if $settings.hasFrontlight}
					<Row>
						<Label md={6} for="flMaxBrightness" size={$uiSettings.inputSize}
							>{$_('section.settings.flMaxBrightness')}</Label
						>
						<Col md="6">
							<Input
								type="range"
								name="flMaxBrightness"
								id="flMaxBrightness"
								bind:value={$settings.flMaxBrightness}
								on:change={onFlBrightnessChange}
								min={0}
								max={4095}
								step={1}
							/>
						</Col>
					</Row>
					<Row>
						<Label md={6} for="flEffectDelay" size={$uiSettings.inputSize}
							>{$_('section.settings.flEffectDelay')}</Label
						>
						<Col md="6">
							<Input
								type="range"
								name="flEffectDelay"
								id="flEffectDelay"
								bind:value={$settings.flEffectDelay}
								min={5}
								max={300}
								step={1}
							/>
						</Col>
					</Row>
				{/if}
				{#if $settings.hasLightLevel}
					<Row>
						<Label md={6} for="luxLightToggle" size={$uiSettings.inputSize}
							>{$_('section.settings.luxLightToggle')} ({$settings.luxLightToggle})</Label
						>
						<Col md="6">
							<Input
								type="range"
								name="luxLightToggle"
								id="luxLightToggle"
								bind:value={$settings.luxLightToggle}
								min={0}
								max={1000}
								step={1}
							/>
						</Col>
					</Row>
				{/if}
				{#if $settings.useNostr}
					<Row>
						<Label md={6} for="nostrPubKey" size={$uiSettings.inputSize}
							>{$_('section.settings.nostrPubKey')}</Label
						>
						<Col md="6">
							<Input
								type="text"
								bind:value={$settings.nostrPubKey}
								name="nostrPubKey"
								id="nostrPubKey"
								on:change={checkValidNostrPubkey}
								invalid={!isValidHexPubKey($settings.nostrPubKey)}
								bsSize={$uiSettings.inputSize}
							></Input>
						</Col>
					</Row>
					<Row>
						<Label md={6} for="nostrRelay" size={$uiSettings.inputSize}
							>{$_('section.settings.nostrRelay')}</Label
						>
						<Col md="6">
							<InputGroup size={$uiSettings.inputSize}>
								<Input
									type="text"
									bind:value={$settings.nostrRelay}
									name="nostrRelay"
									id="nostrRelay"
									valid={validNostrRelay}
									bsSize={$uiSettings.inputSize}
								></Input>
								<Button type="button" color="success" on:click={testNostrRelay}
									>{$_('test', { default: 'Test' })}</Button
								>
							</InputGroup>
						</Col>
					</Row>
				{/if}
				<Row>
					<Label md={6} for="mempoolInstance" size="sm"
						>{$_('section.settings.mempoolnstance')}</Label
					>
					<Col md="6">
						<InputGroup size={$uiSettings.inputSize}>
							<Input
								type="text"
								bind:value={$settings.mempoolInstance}
								name="mempoolInstance"
								id="mempoolInstance"
								disabled={$settings.ownDataSource}
								bsSize="sm"
							></Input>
							<InputGroupText>
								<Input
									addon
									type="checkbox"
									bind:checked={$settings.mempoolSecure}
									disabled={$settings.ownDataSource}
									bsSize={$uiSettings.inputSize}
								/>
								HTTPS
							</InputGroupText>
						</InputGroup>
						<FormText>{$_('section.settings.mempoolInstanceHelpText')}</FormText>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="hostnamePrefix" size={$uiSettings.inputSize}
						>{$_('section.settings.hostnamePrefix')}</Label
					>
					<Col md="6">
						<Input
							type="text"
							bind:value={$settings.hostnamePrefix}
							name="hostnamePrefix"
							id="hostnamePrefix"
							bsSize={$uiSettings.inputSize}
						></Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="wifiTxPower" size={$uiSettings.inputSize}
						>{$_('section.settings.wifiTxPower', { default: 'WiFi Tx Power' })}</Label
					>
					<Col md="6">
						<Input
							type="select"
							bind:value={$settings.txPower}
							name="select"
							id="fgColor"
							bsSize={$uiSettings.inputSize}
							class={$uiSettings.selectClass}
						>
							{#each wifiTxPowerMap as [key, value]}
								<option {value}>{key}</option>
							{/each}
						</Input>
						<FormText>{$_('section.settings.wifiTxPowerText')}</FormText>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="wpTimeout" size={$uiSettings.inputSize}
						>{$_('section.settings.wpTimeout')}</Label
					>
					<Col md="6">
						<InputGroup size={$uiSettings.inputSize}>
							<Input
								type="number"
								id="minSecPriceUpd"
								min={1}
								step="1"
								bind:value={$settings.wpTimeout}
							/>
							<InputGroupText>{$_('time.seconds')}</InputGroupText>
						</InputGroup>
					</Col>
				</Row>
				<Row>
					<Col md="6">
						<Input
							id="ledTestOnPower"
							bind:checked={$settings.ledTestOnPower}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label={$_('section.settings.ledPowerOnTest')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="ledFlashOnUpd"
							bind:checked={$settings.ledFlashOnUpd}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label={$_('section.settings.ledFlashOnBlock')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="stealFocus"
							bind:checked={$settings.stealFocus}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label={$_('section.settings.StealFocusOnNewBlock')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="mcapBigChar"
							bind:checked={$settings.mcapBigChar}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label={$_('section.settings.useBigCharsMcap')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="otaEnabled"
							bind:checked={$settings.otaEnabled}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label="{$_('section.settings.otaUpdates')} ({$_('restartRequired')})"
						/>
					</Col>
					<Col md="6">
						<Input
							id="mdnsEnabled"
							bind:checked={$settings.mdnsEnabled}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label="{$_('section.settings.enableMdns')} ({$_('restartRequired')})"
						/>
					</Col>
					<Col md="6">
						<Input
							id="fetchEurPrice"
							bind:checked={$settings.fetchEurPrice}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label="{$_('section.settings.fetchEuroPrice')} ({$_('restartRequired')})"
						/>
					</Col>
					<Col md="6">
						<Input
							id="useBlkCountdown"
							bind:checked={$settings.useBlkCountdown}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label={$_('section.settings.useBlkCountdown')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="useSatsSymbol"
							bind:checked={$settings.useSatsSymbol}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label={$_('section.settings.useSatsSymbol')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="suffixPrice"
							bind:checked={$settings.suffixPrice}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label={$_('section.settings.suffixPrice')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="disableLeds"
							bind:checked={$settings.disableLeds}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label={$_('section.settings.disableLeds')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="ownDataSource"
							bind:checked={$settings.ownDataSource}
							type="switch"
							bsSize={$uiSettings.inputSize}
							label="{$_('section.settings.ownDataSource')} ({$_('restartRequired')})"
						/>
					</Col>
					{#if $settings.nostrRelay}
						<Col md="6">
							<Input
								id="useNostr"
								bind:checked={$settings.useNostr}
								type="switch"
								bsSize={$uiSettings.inputSize}
								label="{$_('section.settings.useNostr')} ({$_('restartRequired')})"
							/>
						</Col>
					{/if}
					{#if $settings.hasFrontlight}
						<Col md="6">
							<Input
								id="flAlwaysOn"
								bind:checked={$settings.flAlwaysOn}
								type="switch"
								bsSize={$uiSettings.inputSize}
								label={$_('section.settings.flAlwaysOn')}
							/>
						</Col>
						<Col md="6">
							<Input
								id="flFlashOnUpd"
								bind:checked={$settings.flFlashOnUpd}
								type="switch"
								bsSize={$uiSettings.inputSize}
								label={$_('section.settings.flFlashOnUpd')}
							/>
						</Col>
					{/if}
				</Row>

				<Row>
					<h3>{$_('section.settings.screens')}</h3>
					{#if $settings.screens}
						{#each $settings.screens as s}
							<Col md="6">
								<Input
									id="screens_{s.id}"
									bind:checked={s.enabled}
									type="switch"
									bsSize={$uiSettings.inputSize}
									label={s.name}
								/>
							</Col>
						{/each}
					{/if}
				</Row>
				<Row>
					<Col class="d-flex justify-content-end">
						<Button on:click={handleReset} color="secondary">{$_('button.reset')}</Button>
						<div class="mx-2"></div>
						<Button color="primary">{$_('button.save')}</Button>
					</Col>
				</Row>
			</Form>
		</CardBody>
	</Card>
</Col>
