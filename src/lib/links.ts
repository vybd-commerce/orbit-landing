// Single destination for the site's one action: the /book contact form
// (it replaced the Calendly scheduler). Older pages import this name, and
// /book still prefills ?email= and ?name=.
export const CALENDLY_URL = "/book";

// Where waitlist and /signup forms POST, as JSON { email, source, name?, idea? }.
// api/site/waitlist.ts stores them in the vybd_waitlist table (Neon). Set to
// null to make /signup fall back to a prefilled email.
export const WAITLIST_ENDPOINT: string | null = "/api/site/waitlist";
