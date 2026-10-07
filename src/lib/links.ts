// Single destination for the site's one action. Both the header/hero CTA
// and the final CTA form point here, so the booking link only ever needs
// changing in one place.
export const CALENDLY_URL = "https://calendly.com/hello-vybd/vybd-discovery-call";

// Where waitlist signups POST to, as JSON { email, source }. Any form backend
// that accepts that shape works (Formspree, Loops, a Vercel function). Left
// null until one is picked; the waitlist page refuses to fake a success
// while this is unset, so no signup is silently dropped.
export const WAITLIST_ENDPOINT: string | null = null;
