import "$lib/style/app.scss";


import { browser } from '$app/environment'
import '$lib/i18n' // Import to initialize. Important :)
import { locale, waitLocale } from 'svelte-i18n'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
	 if (browser && localStorage.getItem('locale')) {
        locale.set(localStorage.getItem('locale'));
    } else if (browser) {
		locale.set(window.navigator.language)
	}
    await waitLocale();
}

export const prerender = true;
export const ssr = false;
export const csr = true;