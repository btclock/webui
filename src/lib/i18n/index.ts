import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('../locales/en.json'));
register('nl', () => import('../locales/nl.json'));
register('es', () => import('../locales/es.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser
		? browser && localStorage.getItem('locale')
			? localStorage.getItem('locale')
			: window.navigator.language.slice(0, 2)
		: defaultLocale
});
