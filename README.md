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

The form posts to a micro service in `waitlist/` (Node, no deps) deployed on
Railway (project **madvera-waitlist**, workspace "arnelbukva's Projects"):
https://madvera-waitlist-production.up.railway.app

Per signup it sends two emails via **Resend**:

- **Notification** to `NOTIFY_TO` (jordan@hayesmedia.co) — "New Madvera waitlist signup".
- **Confirmation** to the subscriber from `MAIL_FROM`
  (currently `Madvera <madvera@notifications.osmihealth.co>` — the Resend-verified
  Osmi domain; verify a Madvera domain in Resend later and update the var).

Service env vars: `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFY_TO`, `ALLOWED_ORIGIN`.
Deploy changes with `railway up -d` from `waitlist/`. Confirmation copy lives in
`waitlist/server.mjs`.

## Deploy

GitHub Pages serves `main` at the root. Push to `main` and it redeploys.
