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

	import { locale, locales } from 'svelte-i18n';

    export const setLocale = (lang: string) => () => {
        locale.set(lang);
    }

</script>

<Navbar expand="md">
	<NavbarBrand>&#8383;TClock</NavbarBrand>
	<Collapse navbar expand="md">
		<Nav class="me-auto" navbar>
			<NavItem>
				<NavLink href="/">Home</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/api">API</NavLink>
			</NavItem>
		</Nav>
		<Dropdown inNavbar>
			<DropdownToggle nav caret>{$locale}</DropdownToggle>
			<DropdownMenu end>
				{#each $locales as locale}
					<DropdownItem on:click={setLocale(locale)}>{locale}</DropdownItem>
				{/each}
			</DropdownMenu>
		</Dropdown>
	</Collapse>
</Navbar>

<!-- +layout.svelte -->
<slot />
