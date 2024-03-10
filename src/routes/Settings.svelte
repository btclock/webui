<script lang="ts">
	import { PUBLIC_BASE_URL } from '$lib/config';
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
</script>

<Col>
	<Card>
		<CardHeader>
			<CardTitle>{$_('section.settings.title', { default: 'Settings' })}</CardTitle>
		</CardHeader>
		<CardBody>
			<Form on:submit={onSave}>
				<Row>
					<Label md={6} for="fgColor" size="sm"
						>{$_('section.settings.textColor', { default: 'Text color' })}</Label
					>
					<Col md="6">
						<Input
							type="select"
							bind:value={$settings.fgColor}
							name="select"
							id="fgColor"
							bsSize="sm"
							class="form-select-sm"
						>
							<option value="0">{$_('colors.black')}</option>
							<option value="65535">{$_('colors.white')}</option>
						</Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="bgColor" size="sm">{$_('section.settings.backgroundColor')}</Label>
					<Col md="6">
						<Input
							type="select"
							bind:value={$settings.bgColor}
							name="select"
							id="bgColor"
							bsSize="sm"
							class="form-select-sm"
						>
							<option value="0">{$_('colors.black')}</option>
							<option value="65535">{$_('colors.white')}</option>
						</Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="timePerScreen" size="sm">{$_('section.settings.timePerScreen')}</Label>
					<Col md="6">
						<InputGroup size="sm">
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
					<Label md={6} for="fullRefreshMin" size="sm"
						>{$_('section.settings.fullRefreshEvery')}</Label
					>
					<Col md="6">
						<InputGroup size="sm">
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
					<Label md={6} for="minSecPriceUpd" size="sm"
						>{$_('section.settings.timeBetweenPriceUpdates')}</Label
					>
					<Col md="6">
						<InputGroup size="sm">
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
					<Label md={6} for="tzOffset" size="sm">{$_('section.settings.timezoneOffset')}</Label>
					<Col md="6">
						<InputGroup size="sm">
							<Input
								type="number"
								step="1"
								name="tzOffset"
								id="tzOffset"
								bind:value={$settings.tzOffset}
							/>
							<InputGroupText>{$_('time.minutes')}</InputGroupText>
						</InputGroup>
						<FormText>{$_('section.settings.tzOffsetHelpText')}</FormText>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="ledBrightness" size="sm">{$_('section.settings.ledBrightness')}</Label>
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
				<Row>
					<Label md={6} for="mempoolInstance" size="sm"
						>{$_('section.settings.mempoolnstance')}</Label
					>
					<Col md="6">
						<Input
							type="text"
							bind:value={$settings.mempoolInstance}
							name="mempoolInstance"
							id="mempoolInstance"
							bsSize="sm"
						></Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="hostnamePrefix" size="sm"
						>{$_('section.settings.hostnamePrefix')}</Label
					>
					<Col md="6">
						<Input
							type="text"
							bind:value={$settings.hostnamePrefix}
							name="hostnamePrefix"
							id="hostnamePrefix"
							bsSize="sm"
						></Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="wifiTxPower" size="sm"
						>{$_('section.settings.wifiTxPower', { default: 'WiFi Tx Power' })}</Label
					>
					<Col md="6">
						<Input
							type="select"
							bind:value={$settings.txPower}
							name="select"
							id="fgColor"
							bsSize="sm"
							class="form-select-sm"
						>
							{#each wifiTxPowerMap as [key, value]}
								<option {value}>{key}</option>
							{/each}
						</Input>
						<FormText>{$_('section.settings.wifiTxPowerText')}</FormText>
					</Col>
				</Row>
				<Row>
					<Col md="6">
						<Input
							id="ledTestOnPower"
							bind:checked={$settings.ledTestOnPower}
							type="switch"
							bsSize="sm"
							label={$_('section.settings.ledPowerOnTest')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="ledFlashOnUpd"
							bind:checked={$settings.ledFlashOnUpd}
							type="switch"
							bsSize="sm"
							label={$_('section.settings.ledFlashOnBlock')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="stealFocus"
							bind:checked={$settings.stealFocus}
							type="switch"
							bsSize="sm"
							label={$_('section.settings.StealFocusOnNewBlock')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="mcapBigChar"
							bind:checked={$settings.mcapBigChar}
							type="switch"
							bsSize="sm"
							label={$_('section.settings.useBigCharsMcap')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="otaEnabled"
							bind:checked={$settings.otaEnabled}
							type="switch"
							bsSize="sm"
							label="{$_('section.settings.otaUpdates')} ({$_('restartRequired')})"
						/>
					</Col>
					<Col md="6">
						<Input
							id="mdnsEnabled"
							bind:checked={$settings.mdnsEnabled}
							type="switch"
							bsSize="sm"
							label="{$_('section.settings.enableMdns')} ({$_('restartRequired')})"
						/>
					</Col>
					<Col md="6">
						<Input
							id="fetchEurPrice"
							bind:checked={$settings.fetchEurPrice}
							type="switch"
							bsSize="sm"
							label="{$_('section.settings.fetchEuroPrice')} ({$_('restartRequired')})"
						/>
					</Col>
					<Col md="6">
						<Input
							id="useBlkCountdown"
							bind:checked={$settings.useBlkCountdown}
							type="switch"
							bsSize="sm"
							label={$_('section.settings.useBlkCountdown')}
						/>
					</Col>
					<Col md="6">
						<Input
							id="useSatsSymbol"
							bind:checked={$settings.useSatsSymbol}
							type="switch"
							bsSize="sm"
							label={$_('section.settings.useSatsSymbol')}
						/>
					</Col>
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
									bsSize="sm"
									label={s.name}
								/>
							</Col>
						{/each}
					{/if}
				</Row>
				<Button on:click={handleReset} color="secondary">{$_('button.reset')}</Button>
				<Button color="primary">{$_('button.save')}</Button>
			</Form>
		</CardBody>
	</Card>
</Col>
