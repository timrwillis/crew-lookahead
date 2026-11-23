# Crew Lookahead — notes for Claude

Crew/manpower planning app for Tim's low-voltage crew (Tim is the lead; there is also a super and crew).
Live at https://timrwillis.github.io/crew-lookahead (GitHub Pages from `main` of timrwillis/crew-lookahead, public repo).

## Files
- `index.html` — the whole app (vanilla JS in one IIFE, ~4k lines). No build step.
- `firestore.rules` — Firebase security rules. Tim pastes these into Firebase Console → Firestore → Rules by hand after every change. Always tell him when rules changed.
- `firebase-config.js` — public Firebase web config (project `workflow-98636`).
- `sw.js` — service worker (notifications, install).
- `import-data.json` — only `hoursPlan` now. Never put names or site info here: it's public.

## App basics
- `h(tag, attrs, ...kids)` builds DOM (no html attr). State in `S` (Firestore onSnapshot per collection). `render()` / `schedule()`; sheets via `openSheet(title, fields, onSave)` / `openView(title, nodes)` / `closeSheet()`; `liveSheet` redraws an open sheet.
- Roles: owner/lead/super = `MGR()`; crew; helpers with `until` expiry; pending until approved. `myId` = auth uid, `myTech()` = linked crew record.
- Crew can only write `jobs.marks` (+updatedAt), so all crew state lives in marks: cable step marks `marks[cid][sid]`, task state `marks._task_<id>`, cable checklist `marks[cid]._ck`, whole-job complete `marks._job`.
- Cables: `job.cables`, `job.steps`; scan steps `scan_cable/scan_src/scan_dst` (or the job's own matching steps via `scanLike`). Scanning: `scanCode` (phones: camera photo first, live scanner backup; laptops: handheld/upload only), `decodePhoto`, `applyCodesToCk(jid,cid,codes,photo,hint,{by,batch,keepRepeat})`, `uploadScans` for photos sent by others.
- Time off: crew only load their own (`where uid==me`), entries carry `uid` (synced by managers' apps).
- Live Google Sheet: `feeds/<random key>` doc with csv/history/summary + `data` JSON; Apps Script from `feedScript(j)` builds a Cables list + a tab per cable.
- Check list items 2-5 are derived in `ckOf` from sign-offs (2+3 Ported, 4 VFL/Tested, 5 = lead/super who recorded them once 1-4 done), marked `fromSteps`, never saved (`saveCk` strips them); `ckRaw` = stored only.
- Roll call: `attendance/<date>` {marks:{techId:{s:"here"|"out",at,by}}}, managers only (own listener `startAtt`, not in `S`, so missing rules don't break the board). `outOn`/`awayOn` feed `dayInfo` (marked-out people count as off). UI: `rollBar`/`attBtns` on Home → Manpower, `attHistory` view.
- Job notes: `marks._note_<id>` {text,sev(urgent/fyi/suggest/other),cab,sys,pull,cable,photos,fix:{status open/fixing/fixed,to,…},doneAt}; `notesSheet(jid,pre)`; photos + .txt records go to Documents folder "Notes" (files carry `noteId`).
- Crew home (`renderMyWork`): main card = current task; `myWorkList` (via `workFooter`) lists every open task they're on in any job (`myOpenWork`), each opens `myTaskSheet` to check off cables / mark done / scan.
- Quick tasks: `kind:"quick"`, `quick.pri` (critical/high/normal/low), `quick.client`.

## Working on it
- Syntax check: `node -e "const s=require('fs').readFileSync('index.html','utf8');const m=[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n');new Function(m);console.log('ok')"`
- Test headless with Playwright + a fake Firestore page (Chrome at /usr/bin/google-chrome); phone checks with `p.devices["iPhone 13"]`.
- Commit as `Claude <noreply@anthropic.com>`, push to `main` (that deploys).
- Tim is not a developer: answer in plain words, say what changed and what he has to do (e.g. paste new rules).
- Security: company/client site data (rack IDs, serials, photos) — keep it out of public files; Google Chat webhooks are blocked by his IT.
