<script lang="ts">
    import { PUBLIC_BASE_URL } from '$env/static/public';

    import { onMount } from 'svelte';

	import { _ } from 'svelte-i18n';
	import { writable } from 'svelte/store';
	import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Progress,CardTitle } from 'sveltestrap';
	import Rendered from './Rendered.svelte';
	
    export let settings; 

    const status = writable({
        data: ["L", "O", "A", "D", "I", "N", "G"],
        espFreeHeap: 0,
        espHeapSize: 0,
        connectionStatus: {
            "price": false,
            "blocks": false
        }
    }); 

    onMount(() => {
        fetch(`${PUBLIC_BASE_URL}/api/status`)
        .then((res) => res.json())
		.then((data) => {
            status.set(data);
        });

        const evtSource = new EventSource(`${PUBLIC_BASE_URL}/events`);

        evtSource.addEventListener('status', (e) => {
            let dataObj = (JSON.parse(e.data));
            status.set(dataObj);
        });
    });

    const toTime = (secs:Number) => {
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        var obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    const toUptimeString = (secs:Number):String => {
        let time = toTime(secs);

        return `${time.h}h ${time.m}m ${time.s}s`;
    }

    let memoryFreePercent:number = 50;
    let lightMode:boolean = false;

    status.subscribe((value) => {
        memoryFreePercent = Math.round(value.espFreeHeap / value.espHeapSize * 100);
    });

    settings.subscribe((value) => {
        lightMode = value.bgColor > value.fgColor;
    });

    const setScreen = (id:number) => () => {
        fetch(`${PUBLIC_BASE_URL}/api/show/screen/${id}`).catch(err => { });
    }

    const toggleTimer = (currentStatus:boolean) => () => {
        if (currentStatus) {
            fetch(`${PUBLIC_BASE_URL}/api/action/pause`);
        } else {
            fetch(`${PUBLIC_BASE_URL}/api/action/timer_restart`);
        }
    }

    const isLightMode = () => {
        return $settings.bgColor > $settings.fgColor;
    }

</script>

<Col>
	<Card>
		<CardHeader>
			<CardTitle>{$_('section.status.title', { default: 'Status' })}</CardTitle>
		</CardHeader>
		<CardBody>
            {#if $settings.screens}
            <ButtonGroup size="sm">
                {#each $settings.screens as s}
                <Button color="outline-primary" active={$status.currentScreen == s.id} on:click={setScreen(s.id)}>{s.name}</Button>
                {/each}
              </ButtonGroup>
              <hr>
              {#if $status.data}
              <section class={lightMode ? 'lightMode': ''}>
                  <Rendered status="{$status}"></Rendered>
              </section>
              { $_('section.status.screenCycle') }: <a style="cursor: pointer" on:click="{toggleTimer($status.timerRunning)}">{#if $status.timerRunning}&#9205; { $_('timer.running') }{:else}&#9208; { $_('timer.stopped') }{/if}</a>
              {/if}
            {/if}
        <hr>
        <Progress striped value={memoryFreePercent}>{ memoryFreePercent }%</Progress>
        <div class="d-flex justify-content-between">
            <div>{ $_('section.status.memoryFree') } </div>
            <div>{ Math.round($status.espFreeHeap / 1024)  } / { Math.round($status.espHeapSize / 1024) } KiB</div>
          </div>
        <hr>
        { $_('section.status.uptime') }: {toUptimeString($status.espUptime)}
        <br>
        <p>
            { $_('section.status.wsPriceConnection') }:
            <span>
            {#if $status.connectionStatus && $status.connectionStatus.price}
            &#9989;
            {:else}
            &#10060;
            {/if}
            </span>
            - 
            { $_('section.status.wsMempoolConnection') }:
            <span>
              {#if $status.connectionStatus && $status.connectionStatus.blocks}
              &#9989;
              {:else}
              &#10060;
              {/if}
            </span><br>
            {#if $settings.fetchEurPrice}
            <small>{ $_('section.status.fetchEuroNote') }</small>
            {/if}
          </p>
        </CardBody>
        
    </Card>
</Col>
