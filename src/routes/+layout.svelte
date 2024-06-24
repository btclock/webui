<script lang="ts">
	import {
		Collapse,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Nav,
		NavItem,
		NavLink,
		Navbar,
		NavbarBrand
	} from 'sveltestrap';

	import { page } from '$app/stores';
	import { locale, locales, isLoading } from 'svelte-i18n';

	export const setLocale = (lang: string) => () => {
		locale.set(lang);
		localStorage.setItem('locale', lang);
	};

	export const getFlagEmoji = (languageCode: string): string | null => {
		const flagMap: { [key: string]: string } = {
			en: '🇬🇧', // English flag emoji
			nl: '🇳🇱', // Dutch flag emoji
			es: '🇪🇸', // Spanish flag emoji
			de: '🇩🇪' // German flag emoji
		};

		// Convert the language code to lowercase for case-insensitive matching
		const lowercaseCode = languageCode.toLowerCase();

		// Check if the language code is in the flagMap
		if (Object.prototype.hasOwnProperty.call(flagMap, lowercaseCode)) {
			return flagMap[lowercaseCode];
		} else {
			// Return null for unsupported language codes
			return null;
		}
	};

	let languageNames = {};

	locale.subscribe(() => {
		if ($locale) {
			let newLanguageNames = new Intl.DisplayNames([$locale], { type: 'language' });

			for (let l: string of $locales) {
				languageNames[l] = newLanguageNames.of(l);
			}
		}
	});
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
		{#if !$isLoading}
			<Dropdown id="nav-language-dropdown" inNavbar>
				<DropdownToggle nav caret>{getFlagEmoji($locale)} {languageNames[$locale]}</DropdownToggle>
				<DropdownMenu end>
					{#each $locales as locale}
						<DropdownItem on:click={setLocale(locale)}
							>{getFlagEmoji(locale)} {languageNames[locale]}</DropdownItem
						>
					{/each}
				</DropdownMenu>
			</Dropdown>
		{/if}
	</Collapse>
</Navbar>

<!-- +layout.svelte -->
<slot />
