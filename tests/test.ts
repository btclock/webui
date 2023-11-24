import { expect, test } from '@playwright/test';

const statusJson = {
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

test.beforeEach(async ({ page }) => {
	await page.route('*/**/api/status', async (route) => {
		await route.fulfill({ json: statusJson });
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

	await page.route('**/events', (route) => {
		//statusJson.data = ['S', 'S', 'E', 'V', 'E', 'N', 'T'];

		// Respond with a custom SSE message
		route.fulfill({
			status: 200,
			contentType: 'text/event-stream',
			body: `data: ${JSON.stringify(statusJson)}\n\n`
		});
	});
});

test('index page has expected columns control, status, settings', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Control' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Status' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});

test('index page has working language selector', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('//*[@id="nav-language-dropdown"]/a')).toBeVisible();
	page.locator('//*[@id="nav-language-dropdown"]/a').click();
	await expect(page.locator('//*[@id="nav-language-dropdown"]/div/button[1]')).toBeVisible();
	page.locator('//*[@id="nav-language-dropdown"]/div/button[2]').click();
	await expect(page.getByRole('heading', { name: 'Instellingen' })).toBeVisible();
	page.locator('//*[@id="nav-language-dropdown"]/a').click();
	page.locator('//*[@id="nav-language-dropdown"]/div/button[3]').click();
	await expect(page.getByRole('heading', { name: 'Configuración' })).toBeVisible();
});

test('api page has expected load button', async ({ page }) => {
	await page.goto('/api');
	await expect(page.getByRole('button', { name: 'Load' })).toBeVisible();
});

test('timezone can be negative, zero and positive', async ({ page }) => {
	await page.goto('/');
	const tzOffsetField = 'input#tzOffset';

	for (const val of ['-10', '0', '42']) {
		await page.fill(tzOffsetField, val);
		const resultValue = await page.$eval(tzOffsetField, (input: HTMLInputElement) => input.value);
		expect(resultValue).toBe(val);
		await page.getByRole('button', { name: 'Save' }).click();
	}
});

test('time values can not be zero or negative', async ({ page }) => {
	await page.goto('/');

	for (const field of ['#timePerScreen', '#fullRefreshMin', '#minSecPriceUpd']) {
		for (const val of ['42', '210']) {
			await page.fill(field, val);
			const resultValue = await page.$eval(field, (input: HTMLInputElement) => input.value);
			expect(resultValue).toBe(val);
			await page.getByRole('button', { name: 'Save' }).click();
			const validationMessage = await page.$eval(
				field,
				(input: HTMLInputElement) => input.validationMessage
			);
			expect(validationMessage).not.toContain('Value must be greater');
		}

		for (const val of ['-10', '0']) {
			await page.fill(field, val);
			const resultValue = await page.$eval(field, (input: HTMLInputElement) => input.value);
			expect(resultValue).toBe(val);
			await page.getByRole('button', { name: 'Save' }).click();
			const validationMessage = await page.$eval(
				field,
				(input: HTMLInputElement) => input.validationMessage
			);
			expect(validationMessage).toContain('Value must be greater');
		}
	}
});

test('info message when fetch eur price is enabled', async ({ page }) => {
	await page.goto('/');
	const inputField = 'input#fetchEurPrice';
	const switchElement = await page.$(inputField);

	expect(switchElement).toBeTruthy();
	const isSwitchEnabled = await switchElement.isChecked();
	expect(isSwitchEnabled).toBe(false);

	await expect(page.getByText('the WS Price connection will show')).toBeHidden();

	await switchElement.click();
	const isSwitchNowEnabled = await switchElement.isChecked();
	expect(isSwitchNowEnabled).toBe(true);

	await expect(page.getByText('the WS Price connection will show')).toBeVisible();
});

test('parse all types of EPD content correctly', async ({ page }) => {
	statusJson.data[2] = '123';

	await page.goto('/');

	await expect(page.getByRole('heading', { name: 'Status' })).toBeVisible();
	await page.waitForSelector('#timerStatusText:has-text("running")');
	await page.waitForSelector('#btclock-wrapper > div > div:nth-child(1)');

	expect(statusJson.data[0]).toContain('/');
	await expect(page.locator('#btclock-wrapper > div > div:nth-child(1)')).toBeTruthy();
	await expect(page.locator('#btclock-wrapper > div > div:nth-child(1)')).toHaveClass('splitText');
	expect(statusJson.data[1]).toHaveLength(1);
	await expect(page.locator('#btclock-wrapper > div > div:nth-child(2)')).toHaveClass('digit');
	expect(statusJson.data[2]).toHaveLength(3);
	await expect(page.locator('#btclock-wrapper > div > div:nth-child(3)')).toHaveClass('mediumText');
});
