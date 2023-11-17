<script lang="ts">
	import {
		Navbar,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		Collapse,
		Dropdown,
		DropdownMenu,
		DropdownItem,
		DropdownToggle
	} from 'sveltestrap';

	import { locale, locales, waitLocale } from 'svelte-i18n';
	import type { LayoutLoad } from './$types';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	export const setLocale = (lang: string) => () => {
		locale.set(lang);
		localStorage.setItem('locale', lang);
	};

	export const getFlagEmoji = (languageCode: string): string | null => {
		const flagMap: { [key: string]: string } = {
			en: '🇬🇧', // English flag emoji
			nl: '🇳🇱', // Dutch flag emoji
			es: '🇪🇸' // Spanish flag emoji
		};

		// Convert the language code to lowercase for case-insensitive matching
		const lowercaseCode = languageCode.toLowerCase();

		// Check if the language code is in the flagMap
		if (flagMap.hasOwnProperty(lowercaseCode)) {
			return flagMap[lowercaseCode];
		} else {
			// Return null for unsupported language codes
			return null;
		}
	};

	export const getLanguageName = (languageCode: string): string | null => {
		const languageNames: { [key: string]: { [key: string]: string } } = {
			en: { en: 'English', nl: 'English', es: 'English' },
			nl: { en: 'Nederlands', nl: 'Nederlands', es: 'Neerlandés' },
			es: { en: 'Español', nl: 'Spaans', es: 'Español' }
		};

		const lowercaseCode = languageCode.toLowerCase();

		return languageNames.hasOwnProperty(lowercaseCode)
			? languageNames[lowercaseCode][lowercaseCode]
			: null;
	};
</script>

<Navbar expand="md">
	<NavbarBrand>&#8383;TClock</NavbarBrand>
	<Collapse navbar expand="md">
		<Nav class="me-auto" navbar>
			<NavItem>
				<NavLink href="/" active={$page.url.pathname === '/'}>Home</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/api" active={$page.url.pathname === '/api'}>API</NavLink>
			</NavItem>
		</Nav>
		<Dropdown inNavbar>
			<DropdownToggle nav caret>{getFlagEmoji($locale)} {getLanguageName($locale)}</DropdownToggle>
			<DropdownMenu end>
				{#each $locales as locale}
					<DropdownItem on:click={setLocale(locale)}>{getFlagEmoji(locale)} {getLanguageName(locale)}</DropdownItem>
				{/each}
			</DropdownMenu>
		</Dropdown>
	</Collapse>
</Navbar>

<!-- +layout.svelte -->
<slot />
