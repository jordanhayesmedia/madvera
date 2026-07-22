# Madvera landing page

Single-page site: download the Podcast Ads Skill (for Claude Code) + waitlist for
Madvera Ad Generation.

**Live:** https://jordanhayesmedia.github.io/madvera/

## The download

`downloads/podcast-ads-skill.zip` contains the real skill: `make-podcast-ad/SKILL.md`
(unzips straight into `~/.claude/skills/`). To ship an update, re-zip the skill
folder over the same filename — no code changes needed:

```bash
cd /Users/jordanhayes/Madgenta/scratchpad && zip -r <repo>/downloads/podcast-ads-skill.zip make-podcast-ad -x "*.DS_Store"
```

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
