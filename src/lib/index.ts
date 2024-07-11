import * as nip19 from 'nostr-tools/nip19';
import { Relay } from 'nostr-tools';

/**
 * Validates if the given npub is a valid Nostr Public Key.
 * @param npub - The npub (Nostr Public Key) to validate.
 * @returns A boolean indicating if the npub is valid.
 */
const isValidNpub = (npub: string): boolean => {
	try {
		// Decode the npub using NIP-19
		const { type, data } = nip19.decode(npub);
		// Check if the type is 'npub' and the data length is 32 bytes
		return type === 'npub' && data.length === 64;
	} catch (e) {
		// If any error is thrown, the npub is not valid
		return false;
	}
};

/**
 * Validates if the given URL is a valid Nostr relay.
 * @param url - The URL of the Nostr relay to validate.
 * @returns A Promise<boolean> indicating if the URL is a valid Nostr relay.
 */
const isValidNostrRelay = async (url: string): Promise<boolean> => {
	try {
		const relay: Relay = await Relay.connect(url);

		// If the relay is successfully connected, it's a valid Nostr relay
		if (relay.connected) {
			// Close the connection to clean up
			relay.close();
			return true;
		}

		return false;
	} catch (e) {
		// If any error is thrown, the URL is not a valid Nostr relay
		return false;
	}
};

export { isValidNpub, isValidNostrRelay };
