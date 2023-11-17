<script lang="ts">
	import { onMount } from 'svelte';
	import { readonly, writable } from 'svelte/store';

	import { _ } from 'svelte-i18n';
	import {
		Col,
		Container,
		Row,
		Card,
		CardHeader,
		CardBody,
		Form,
		FormGroup,
		FormText,
		Label,
		Input,
		InputGroup,
		InputGroupText,
        Button
	} from 'sveltestrap';

	export let settings;
</script>

<Col>
	<Card>
		<CardHeader>
			<h2>{$_('section.settings.title', { default: 'Settings' })}</h2>
		</CardHeader>
		<CardBody>
			<Form>
				<Row>
					<Label md={6} for="fgColor" size="sm">Text color</Label>
					<Col md="6">
						<Input
							type="select"
							value={$settings.fgColor}
							name="select"
							id="fgColor"
							bsSize="sm"
							class="form-select-sm"
						>
							<option value="0">Black</option>
							<option value="65535">White</option>
						</Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="bgColor" size="sm">Background color</Label>
					<Col md="6">
						<Input
							type="select"
							bind:value={$settings.bgColor}
							name="select"
							id="bgColor"
							bsSize="sm"
							class="form-select-sm"
						>
							<option value="0">Black</option>
							<option value="65535">White</option>
						</Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="timePerScreen" size="sm">Time per screen</Label>
					<Col md="6">
						<InputGroup size="sm">
							<Input type="number" min={1} step="1" bind:value={$settings.timerSeconds} />
							<InputGroupText>minutes</InputGroupText>
						</InputGroup>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="fullRefreshMin" size="sm">Full refresh every</Label>
					<Col md="6">
						<InputGroup size="sm">
							<Input type="number" min={1} step="1" bind:value={$settings.fullRefreshMin} />
							<InputGroupText>minutes</InputGroupText>
						</InputGroup>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="minSecPriceUpd" size="sm">Time between price updates</Label>
					<Col md="6">
						<InputGroup size="sm">
							<Input type="number" min={1} step="1" bind:value={$settings.minSecPriceUpd} />
							<InputGroupText>seconds</InputGroupText>
						</InputGroup>
						<FormText>Short amounts might shorten lifespan.</FormText>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="tzOffset" size="sm">Timezone offset</Label>
					<Col md="6">
						<InputGroup size="sm">
							<Input
								type="number"
								min={1}
								step="1"
								name="tzOffset"
								id="tzOffset"
								bind:value={$settings.tzOffset}
							/>
							<InputGroupText>minutes</InputGroupText>
						</InputGroup>
						<FormText>A restart is required to apply TZ offset.</FormText>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="ledBrightness" size="sm">LED brightness</Label>
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
					<Label md={6} for="mempoolInstance" size="sm">Mempool Instance</Label>
                    <Col md="6">
						<Input
							type="text"
							bind:value={$settings.mempoolInstance}
							name="mempoolInstance"
							id="mempoolInstance"
							bsSize="sm"
						>
						</Input>
					</Col>
				</Row>
				<Row>
					<Label md={6} for="hostnamePrefix" size="sm">Hostname prefix</Label>
                    <Col md="6">
						<Input
							type="text"
							bind:value={$settings.hostnamePrefix}
							name="hostnamePrefix"
							id="hostnamePrefix"
							bsSize="sm"
						>
						</Input>
					</Col>
				</Row>
                <Button color="secondary">Reset</Button>
                <Button color="primary">Save</Button>
			</Form>
		</CardBody>
	</Card>
</Col>
