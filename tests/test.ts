import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.route('*/**/api/status', async (route) => {
		const json = {
			currentScreen: 0,
			numScreens: 7,
			timerRunning: true,
			espUptime: 4479,
			espFreeHeap: 58508,
			espHeapSize: 342108,
			connectionStatus: { price: true, blocks: true },
			rssi: -66,
			data: ['BLOCK/HEIGHT', '8', '1', '8', '0', '2', '6'],
			rendered: ['BLOCK/HEIGHT', '8', '1', '8', '0', '2', '6'],
			leds: [
				{ red: 0, green: 0, blue: 0, hex: '#000000' },
				{ red: 0, green: 0, blue: 0, hex: '#000000' },
				{ red: 0, green: 0, blue: 0, hex: '#000000' },
				{ red: 0, green: 0, blue: 0, hex: '#000000' }
			]
		};
		await route.fulfill({ json });
	});
	await page.route('*/**/api/settings', async (route) => {
		const json = {
			numScreens: 7,
			fgColor: 415029,
			bgColor: 0,
			timerSeconds: 1800,
			timerRunning: true,
			minSecPriceUpd: 30,
			fullRefreshMin: 60,
			wpTimeout: 600,
			tzOffset: 0,
			useBitcoinNode: false,
			mempoolInstance: 'mempool.space',
			ledTestOnPower: true,
			ledFlashOnUpd: true,
			ledBrightness: 128,
			stealFocus: true,
			mcapBigChar: true,
			mdnsEnabled: true,
			otaEnabled: true,
			fetchEurPrice: false,
			hostnamePrefix: 'btclock',
			hostname: 'btclock-d60b14',
			ip: '192.168.20.231',
			txPower: 78,
			gitRev: '25d8b92bcbc8938417c140355ea3ba99ff9eb4b7',
			lastBuildTime: '1700666677',
			screens: [
				{ id: 0, name: 'Block Height', enabled: true },
				{ id: 1, name: 'Sats per dollar', enabled: true },
				{ id: 2, name: 'Ticker', enabled: true },
				{ id: 3, name: 'Time', enabled: true },
				{ id: 4, name: 'Halving countdown', enabled: true },
				{ id: 5, name: 'Market Cap', enabled: true }
			]
		};
		await route.fulfill({ json });
	});
});

test('index page has expected status', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Status' })).toBeVisible();
});

test('index page has expected settings', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});

test('index page has expected control', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Control' })).toBeVisible();
});

test('api page has expected load button', async ({ page }) => {
	await page.goto('/api');
	await expect(page.getByRole('button', { name: 'Load' })).toBeVisible();
});
