import { expect, test } from '@playwright/test';

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
