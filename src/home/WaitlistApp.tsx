import { useState, type FormEvent } from 'react'
import { GlobalNav } from './components/GlobalNav'
import { Footer } from './components/Footer'
import { Lockup } from './components/Logo'
import { track } from '@/lib/analytics'
import { WAITLIST_ENDPOINT } from '@/lib/links'

/* /waitlist: email sign-up for the Vybd app. Posts to WAITLIST_ENDPOINT
   (api/site/waitlist.ts, vybd_waitlist table). `website` is a honeypot.
   ?from= says which link brought them (the home hero sends from=home). */

type Status = 'idle' | 'sending' | 'done' | 'error'

const params = new URLSearchParams(window.location.search)

export default function WaitlistApp() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')
    try {
      if (!WAITLIST_ENDPOINT) throw new Error('WAITLIST_ENDPOINT is not set in src/lib/links.ts')
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email, website,
          source: params.get('from') || 'direct',
          utm_source: params.get('utm_source') || undefined,
        }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok || !body?.ok) throw new Error(body?.error || `Waitlist POST failed: ${res.status}`)
      track('waitlist_join', { from: params.get('from') || 'direct' })
      setStatus('done')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error && !err.message.startsWith('Waitlist POST') && !err.message.includes('WAITLIST_ENDPOINT')
        ? err.message : 'Something went wrong. Try again in a moment.')
      setStatus('error')
    }
  }

  return (
    <>
      <GlobalNav base="/" ribbon={false} />
      <main className="wl" id="top">
        <Lockup />
        <h1>The Vybd app is <em>coming.</em></h1>
        <p className="wl-p">Plan, launch and run your brand in the US from one place. Join the waitlist and we'll email you when it opens.</p>
        {status === 'done' ? (
          <p className="wl-done" role="status">You're on the list. We'll email you when your spot opens.</p>
        ) : (
          <form className="wl-form" onSubmit={submit}>
            <label htmlFor="wl-email" className="wl-sr">Email address</label>
            <input id="wl-email" type="email" required autoComplete="email" placeholder="you@yourbrand.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="wl-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
              value={website} onChange={(e) => setWebsite(e.target.value)} />
            <button type="submit" className="pill fill" disabled={status === 'sending'}>
              {status === 'sending' ? 'Joining…' : 'Join the waitlist'}
            </button>
          </form>
        )}
        {/* Reserved height so an error appearing doesn't shift the layout. */}
        <p className="wl-err" role="alert">{status === 'error' ? error : ''}</p>
        <p className="wl-alt">Launching a brand now? <a href="/book">Book a call</a> and we'll do it with you.</p>
      </main>
      <Footer base="/" notes={false} />
    </>
  )
}
