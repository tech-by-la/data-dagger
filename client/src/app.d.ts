// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
    import type {UserPayload} from "$lib/server/interfaces/interfaces";
	interface Locals {
        user: UserPayload;
    }
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
