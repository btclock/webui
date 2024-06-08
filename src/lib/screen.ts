import { writable } from 'svelte/store';

// Create a writable store to track screen size
export const screenSize = writable<number>(window.innerWidth);

// Function to update the screen size
export const updateScreenSize = () => {
	screenSize.set(window.innerWidth);
};
