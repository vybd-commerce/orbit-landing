# Booking questions for the US entry call (Calendly)

Calendly's invitee questions are configured in the dashboard, not in code.
Set these on the event used by `BOOKING_URL` in `src/pages/BookPage.tsx`
(Event type → Booking form / "Invitee questions"), in this order and wording.

## Required

1. **Full name** (Calendly's built-in Name field)
2. **Work email** (Calendly's built-in Email field; relabel to "Work email")
3. **Company name and website** (one line, required)
4. **Country you're based in** (one line, or a dropdown, required)
5. **What do you sell?** (one line, required, placeholder: "Spices, skincare, batteries…")
6. **Where are you with the US today?** (radio buttons, required)
   - Not selling in the US yet
   - Some US sales, want to grow
   - A US buyer or retailer is interested
   - Already selling, need help running it

## Optional

7. **What would make this call useful for you?** (multiple lines, optional)
8. **WhatsApp number** (phone number, optional)

## Prefill mapping

/book passes these through from its own URL to the embed, so any link can
prefill them, e.g. `/book?email=jo@brand.com&a1=Brand%20Co%2C%20brand.com`.
Calendly numbers custom questions in the order they appear on the form:

| Param | Question |
| --- | --- |
| `name` | Full name |
| `email` | Work email |
| `a1` | Company name and website |
| `a2` | Country you're based in |
| `a3` | What do you sell? |
| `a4` | Where are you with the US today? |
| `a5` | What would make this call useful for you? |
| `a6` | WhatsApp number |

If you reorder the questions in Calendly, update this table to match.

## Other event settings

- **Duration:** 30 minutes, video location (Google Meet or Zoom).
- **Confirmation page:** leave on Calendly's default. /book already sends
  people to `/book/thanks` itself when the embed reports a booking, so no
  redirect needs to be set in Calendly.
- **Branding:** Account → Branding → turn off "Calendly branding" (paid plans
  only); set brand colour to `#0f1b33`. The embed also passes this colour.
- **Time zone:** nothing to set. Calendly detects the invitee's time zone and
  shows it, with a picker to change it, above the time slots.
