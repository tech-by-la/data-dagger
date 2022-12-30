// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
    import type {JwtUserPayload} from "$lib/server/util/interfaces";
	interface Locals {
        user: JwtUserPayload;
    }
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
