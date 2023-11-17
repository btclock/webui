<script lang="ts">
    import { PUBLIC_BASE_URL } from '$env/static/public';

	import { onMount } from 'svelte';
	import { readonly, writable } from 'svelte/store';

	import { _ } from 'svelte-i18n';
	import {
		Col,
		Container,
		Row,
		Card,
        CardTitle,
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

    const onSave = async(e:Event) => {
        e.preventDefault();
        let formSettings = $settings;

        delete formSettings["gitRev"];
        delete formSettings["ip"];
        delete formSettings["lastBuildTime"];

        const res = await fetch(`${PUBLIC_BASE_URL}/api/json/settings`, {
			method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
            },
			body: JSON.stringify(formSettings)
		})		
    }
</script>

<Col>
	<Card>
		<CardHeader>
			<CardTitle>{$_('section.settings.title', { default: 'Settings' })}</CardTitle>
		</CardHeader>
		<CardBody>
			<Form on:submit={onSave}>
				<Row>
					<Label md={6} for="fgColor" size="sm">Text color</Label>
					<Col md="6">
						<Input
							type="select"
							bind:value={$settings.fgColor}
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
							<Input type="number" min={1} step="1" bind:value={$settings.timePerScreen} />
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
                <Row>
                    <Col md="6">
                        <Input id="ledTestOnPower" bind:checked={$settings.ledTestOnPower} type="switch" bsSize="sm" label="LED power-on test" />
                    </Col>
                    <Col md="6">
                        <Input id="ledFlashOnUpd" bind:checked={$settings.ledFlashOnUpd} type="switch" bsSize="sm" label="LED flash on new block" />
                    </Col>
                    <Col md="6">
                        <Input id="stealFocus" bind:checked={$settings.stealFocus} type="switch" bsSize="sm" label="Steal focus on new block" />
                    </Col>
                    <Col md="6">
                        <Input id="mcapBigChar" bind:checked={$settings.mcapBigChar} type="switch" bsSize="sm" label="Use big characters for market cap" />
                    </Col>
                    <Col md="6">
                        <Input id="otaEnabled" bind:checked={$settings.otaEnabled} type="switch" bsSize="sm" label="OTA updates (restart required)" />
                    </Col>
                    <Col md="6">
                        <Input id="mdnsEnabled" bind:checked={$settings.mdnsEnabled} type="switch" bsSize="sm" label="mDNS (restart required)" />
                    </Col>
                       <Col md="6">
                        <Input id="fetchEurPrice" bind:checked={$settings.fetchEurPrice} type="switch" bsSize="sm" label="Fetch &euro; price (restart required)" />
                    </Col>
                </Row>

                <Row>
                    <h3>Screens</h3>
                    {#if $settings.screens}
                    {#each $settings.screens as s}
                    <Col md="6">
                        <Input id="screens_{s.id}" bind:checked={s.enabled} type="switch" bsSize="sm" label="{s.name}" />
                    </Col>
                    {/each}
                    {/if}
                </Row>
                <Button type="reset" color="secondary">Reset</Button>
                <Button color="primary">Save</Button>
			</Form>
		</CardBody>
	</Card>
</Col>
