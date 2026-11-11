// Single destination for the site's one action. Both the header/hero CTA
// and the final CTA form point here, so the booking link only ever needs
// changing in one place.
export const CALENDLY_URL = "https://calendly.com/hello-vybd/vybd-discovery-call";

// Where waitlist and /signup forms POST, as JSON { email, source, name?, idea? }.
// api/site/waitlist.ts stores them in the vybd_waitlist table (Neon). Set to
// null to make /signup fall back to a prefilled email.
export const WAITLIST_ENDPOINT: string | null = "/api/site/waitlist";
