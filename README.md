# Madvera landing page

Single-page site: download Madvera + waitlist for Madvera Ad Generation.

**Live:** https://jordanyander.github.io/madvera/

## Swap in the real download

The Download button serves `downloads/madvera.zip`. The file currently in the repo
is a **placeholder** — replace it with the real file, keep the name `madvera.zip`,
and nothing else needs to change. If you want a different filename/format, update
the `href` on the Download button and the file-chip labels (`madvera.zip`,
`ZIP · v1.0`) in `index.html`.

## Waitlist

The form posts to [FormSubmit](https://formsubmit.co) (no account needed):

- Signups arrive as email at **jordan@hayesmedia.co** (subject: "New Madvera waitlist signup").
- Each subscriber gets an automatic **confirmation email** (`_autoresponse` in `index.html` — edit the text there).
- **One-time activation:** the first submission triggers an activation email from
  FormSubmit to jordan@hayesmedia.co. Click **Activate Form** in it — until then,
  submissions are not forwarded.
- Optional hardening: after activation, FormSubmit gives you a random endpoint
  alias (e.g. `formsubmit.co/ajax/abc123…`) — swap it into the `fetch` URL in
  `index.html` so the raw email address isn't visible in the page source.
- Outgrowing email-inbox storage: point the form at Loops/Kit/MailerLite later —
  it's one `fetch` URL change.

## Deploy

GitHub Pages serves `main` at the root. Push to `main` and it redeploys.
