// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      accessToken?: string;
      refreshedToken?: import('./lib/omerlo/reader/server/token').OmerloToken;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
