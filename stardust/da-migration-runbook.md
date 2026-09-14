# Cutover Runbook — celinek.org: Google Drive → DA (da.live)

**Site:** `gknobloch` / `www-celinek-org` · **Live host:** `www.celinek.org`
**Goal:** move the content source from Google Drive to DA (da.live) with zero visible change to visitors, fully reversible.
**Status at time of writing:** all content is already **staged in DA and content-verified byte-identical** (see "Staging — already done"). What remains is the redirects sheet, the config source-switch, and re-publish + verify.

---

## Roles & permissions (read this first)

| Action | Endpoint / tool | Who can do it |
|---|---|---|
| Write content/sheets to DA | `admin.da.live/source/...` | ✅ current `DA_TOKEN` (client `darkalley`) — proven |
| Preview / publish | `admin.hlx.page/preview` · `/live` | ✅ current `DA_TOKEN` — proven (returned 200) |
| **Change site content-source config** | `admin.hlx.page/config/...` **or** da.live site settings | ❌ current token is **403** — needs a **config-admin** on the `gknobloch` org |

> The one gated step is the **source switch (Phase 3)**. Everything else can run with the DA token already in `.env`. Get config-admin access (or have an org admin run Phase 3) before starting.

---

## Staging — already done (no live impact)

All 12 documents PUT to DA and verified identical to live (`html.unescape`-normalized, byte-for-byte):

```
index  qui-suis-je  bienfaits  contact
realisations/index  prestations-tarifs/index
prestations-tarifs/{changement-de-vie, vivre-et-vieillir-chez-soi,
                    tri-rangement-et-optimisation, gerer-sa-maison-pas-a-pas}
nav  footer
```
Plus the redesign preview: `redesign`, `nav-redesign`.
Sheets present on live: **`redirects`** only (1 row). No `metadata`/`placeholders` sheet.

Because the site source is still Google Drive, these DA docs are **inert** — nothing renders from them until Phase 3.

---

## Pre-flight (run the morning of)

```bash
cd /Users/gknob/dev/github/gknobloch/www-celinek-org
set -a; . ./.env; set +a
ORG=gknobloch; REPO=www-celinek-org

# 1. token still valid?
curl -s -o /dev/null -w "DA list: %{http_code}\n" -H "Authorization: Bearer $DA_TOKEN" \
  "https://admin.da.live/list/$ORG/$REPO"        # expect 200; 401 => refresh DA_TOKEN

# 2. re-stage any page edited since staging (idempotent) — see scripts/migrate.sh
#    (skip if no Google-Doc edits happened after staging)

# 3. capture a live baseline for the parity check (Phase 4)
for P in "" qui-suis-je bienfaits contact realisations/ prestations-tarifs/ \
  prestations-tarifs/changement-de-vie prestations-tarifs/vivre-et-vieillir-chez-soi \
  prestations-tarifs/tri-rangement-et-optimisation prestations-tarifs/gerer-sa-maison-pas-a-pas; do
  curl -s --compressed "https://www.celinek.org/${P}" -o "/tmp/baseline/${P//\//_}.html" --create-dirs
done
```

---

## Phase 0 — Freeze (5 min)

- Tell any Google-Docs editor: **no edits until cutover confirmed**.
- Note the current time; any Doc edit after this is re-staged in Phase 1 if needed.

## Phase 1 — Migrate the redirects sheet (DA token; proven format)

```bash
cat > /tmp/redirects.json <<'JSON'
{
  "total": 1, "limit": 1, "offset": 0,
  "data": [
    { "Source": "/prestations-tarifs/les-fondamentaux",
      "Destination": "/prestations-tarifs/vivre-et-vieillir-chez-soi",
      "Notes": "Prestation renommée" }
  ],
  ":sheetname": "helix-default", ":type": "sheet"
}
JSON

curl -sS -X PUT -H "Authorization: Bearer $DA_TOKEN" \
  -F "data=@/tmp/redirects.json;type=application/json" \
  "https://admin.da.live/source/$ORG/$REPO/redirects.json" -o /dev/null -w "redirects PUT: %{http_code}\n"   # expect 201
```
> Verified working on a throwaway path (PUT 201 / GET round-trip / DELETE 204).

## Phase 2 — Force Code Sync on `main` (DA token)

The blocks already run on live, but force a sync so nothing is stale after cutover:
```bash
curl -sS -X POST -H "Authorization: Bearer $DA_TOKEN" \
  "https://admin.hlx.page/code/$ORG/$REPO/main/*" -o /dev/null -w "code sync: %{http_code}\n"   # expect 202
```

## Phase 3 — Switch content source Drive → DA  ⚠️ config-admin required

This is the only step the current DA token cannot perform (403). Do it with a config-admin, via **either** path:

**A. da.live UI (recommended):** open the site in da.live → Site settings / Config → set the **content source** to this DA space (`https://content.da.live/gknobloch/www-celinek-org`). Save.

**B. Config API (with an admin token `$ADMIN_TOKEN`):**
```bash
# read current config first — confirm the exact source keys before editing
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://admin.hlx.page/config/$ORG/sites/$REPO.json" -o /tmp/site-config.json

# edit /tmp/site-config.json: set content.source to DA, e.g.
#   "content": { "source": {
#       "url":  "https://content.da.live/gknobloch/www-celinek-org",
#       "type": "markup" } }
# (remove the gdrive mountpoint). Keep everything else identical.

curl -sS -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" --data @/tmp/site-config.json \
  "https://admin.hlx.page/config/$ORG/sites/$REPO.json" -o /dev/null -w "config PUT: %{http_code}\n"
```
> Confirm the exact schema against the value you GET — do not hand-invent keys. The gdrive source (`gdrive:…`) stays in Drive untouched; you are only repointing the config.

## Phase 4 — Preview + publish everything from DA (DA token)

```bash
PATHS=(index qui-suis-je bienfaits contact realisations/index prestations-tarifs/index \
  prestations-tarifs/changement-de-vie prestations-tarifs/vivre-et-vieillir-chez-soi \
  prestations-tarifs/tri-rangement-et-optimisation prestations-tarifs/gerer-sa-maison-pas-a-pas \
  nav footer redirects)
for P in "${PATHS[@]}"; do
  pc=$(curl -sS -X POST -H "Authorization: Bearer $DA_TOKEN" \
        "https://admin.hlx.page/preview/$ORG/$REPO/main/$P" -o /dev/null -w "%{http_code}")
  lc=$(curl -sS -X POST -H "Authorization: Bearer $DA_TOKEN" \
        "https://admin.hlx.page/live/$ORG/$REPO/main/$P"    -o /dev/null -w "%{http_code}")
  echo "$P  preview=$pc  live=$lc"      # expect 200/200
done
```

## Phase 5 — Parity verification (must pass before you walk away)

```bash
# text/DOM parity vs the Phase-0 baseline
for P in "" qui-suis-je bienfaits contact realisations/ prestations-tarifs/ \
  prestations-tarifs/changement-de-vie prestations-tarifs/vivre-et-vieillir-chez-soi \
  prestations-tarifs/tri-rangement-et-optimisation prestations-tarifs/gerer-sa-maison-pas-a-pas; do
  now=$(curl -s --compressed "https://www.celinek.org/${P}")
  # compare <main> text + block set to /tmp/baseline; flag any delta
done
```
Then a **headless render check** per template (home, a prestations detail, realisations):
- every grid/flex block computes `grid`/`flex` (not `block`),
- `main .section` count > 0, blocks carry `data-block-name`,
- 0 `pageerror`, 0 broken images, every visible image `clientWidth > 0`,
- redirect works: `curl -sI https://www.celinek.org/prestations-tarifs/les-fondamentaux` → 301 → `/prestations-tarifs/vivre-et-vieillir-chez-soi`.

(Reuse `stardust/` playwright checks — same asserts used during the block build.)

## Phase 6 — Authoring handoff

- Grant **DA edit access** in da.live to the author identities (IMS/Adobe org) — replaces Google-Docs sharing.
- Confirm the AEM Sidekick works against DA for an editor (open a page, make a trivial edit, preview).
- Retire/park the Google Docs (keep as read-only backup for one cycle).

---

## Rollback (any time, seconds)

If parity fails or anything looks off:
1. **Re-point the config source back to Google Drive** (Phase 3, reverse) — via da.live UI or config API.
2. `POST /preview` + `/live` for the affected paths (or the whole set) to re-pull from Drive.
3. Live is exactly as before; DA docs go inert again. No content lost — Drive was never modified.

---

## After a successful cutover

- `/redesign` (already staged in DA) becomes renderable immediately at
  `https://www.celinek.org/redesign` after `POST /preview` (+ `/live` when you want it public).
  It stays private until you publish it — branch/preview only if you prefer.
- Future redesign edits deploy straight through DA (no Google-Docs step).

---

## Quick reference — hosts & endpoints

- DA source: `https://admin.da.live/source/{org}/{repo}/{path}.html` (PUT multipart field **`data`**, `type=text/html`)
- DA list: `https://admin.da.live/list/{org}/{repo}[/{folder}]`
- DA editor UI: `https://da.live/#/{org}/{repo}/{path}`
- Preview: `POST https://admin.hlx.page/preview/{org}/{repo}/{ref}/{path}`
- Publish: `POST https://admin.hlx.page/live/{org}/{repo}/{ref}/{path}`
- Code sync: `POST https://admin.hlx.page/code/{org}/{repo}/{ref}/*`
- Config (admin only): `GET/POST https://admin.hlx.page/config/{org}/sites/{repo}.json`
- Status (diagnostics): `GET https://admin.hlx.page/status/{org}/{repo}/{ref}/{path}`
