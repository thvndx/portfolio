# Learning desk

A free dashboard for Conold’s full-stack, Azure AI and application-security learning plan. It runs locally or as a separate static Vercel project. It is independent of the public portfolio and has no account, database or paid library.

## Deploy on Vercel

Import the GitHub repository into a **new** Vercel project. Set its Root Directory to `learning-dashboard` and Framework Preset to **Other**. The checked-in `vercel.json` uses `npm run build` and publishes `dist`. Choose the free Hobby plan for personal use; no paid domain, database or upgrade is needed.

The build copies only `index.html`, `styles.css`, `app.mjs`, `core.mjs` and `roadmap.mjs`. It rejects unexpected existing output files. Personal progress exports, screenshots, generated calendars and calendar receipts are excluded from Git and deployment. The public repository backs up the application source; it does not back up live browser progress.

On first use at the hosted address, import your exported local JSON backup through Budget & settings. Each browser and site address has separate storage, so this is a one-time migration, not automatic synchronization. Keep exporting backups weekly. Calendar links should use the stable production address, not a preview deployment address.

Build and verify locally with `npm run build` and `npm test` from this directory. Vercel applies the same restrictive security headers as the local launcher. No backend or telemetry is enabled.

## Open it

On Windows, double-click **start.cmd** in this folder. Alternatively, from the portfolio folder run:

```powershell
node learning-dashboard/serve.mjs
```

Open **http://localhost:4317** in the same browser each time. Keep the launcher running while using the app. Stop it with Ctrl+C. Node 20 or later is required; the workspace already has Node 22. If the port is occupied, the launcher reports it without selecting a different address. Use `localhost`, not `127.0.0.1`, to keep a consistent browser-storage origin. Do not open index.html directly.

## A sustainable routine

- Start with the next task in Today. Default commitment: five hours a week, split into learning, implementation and reflection.
- Log sessions honestly, then use each task’s criteria to decide whether it is complete. Saving hours or evidence never awards a credential.
- Add lab results, write-ups, project evidence and practice scores in Evidence. Link supporting material or use notes; no uploads are stored.
- Record certification preparation, bookings and actual passes independently. A pass needs a date and verification note.
- Review your week, set three priorities for the next week, and adjust blocked tasks. Pause when necessary; resume shifts unfinished dates by elapsed paused days.
- Recheck exam objectives, availability and South African checkout prices before booking. No exam prices are prefilled or promised. AZ-900 and AI-200 are budget-dependent; GH-200 and SC-900 exams are deferred by default in the roadmap guidance.

## Progress and backups

Progress is stored only in this browser at this address using a versioned localStorage record. The app does not sync between devices. Clearing site data, private-browsing cleanup or browser/profile changes can remove access to it. Export a JSON backup weekly and keep it in a safe folder. Import validates the file before asking to replace current progress; canceling or an invalid file leaves existing data intact. Reset requires confirmation.

If browser storage is blocked, invalid or full, the app shows an alert and keeps changes in memory. Export before closing. An existing unreadable record is not overwritten automatically. Import a valid backup or explicitly reset to retry storage.

There are five phases, 225 estimated hours, 20 introductory labs and three write-ups. A task’s estimated hours are total effort, not a weekly assignment. Larger tasks span multiple weeks. Completed work and logs remain when settings or schedules change. The initial budget is R3,000 (maximum R5,000), allocated to R2,000 exams, R300 experiments and R700 reserve. All prices and payments must be entered by you. Alerts do not stop cloud billing.

The capstone is a future learning deliverable: a synthetic-data support application with TypeScript, a Python API, secure delivery and evaluated AI retrieval. This dashboard tracks its implementation; it does not pretend the capstone or credentials are already complete.

## Development and checks

```powershell
node --test learning-dashboard/tests/*.test.mjs
```

The server binds only to the loopback interface, serves a fixed allowlist of five frontend files, rejects other methods and hosts, and uses a restrictive content security policy. External learning and evidence links open in a new tab; no third-party scripts, fonts or background requests are used. Dates use Africa/Johannesburg, and study weeks run Monday through Sunday. Roadmap data lives in `roadmap.mjs`; stable task IDs are part of the backup format, so changing them requires a schema migration.
