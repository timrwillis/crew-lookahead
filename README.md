# Crew Lookahead

A shared board for the crew: month/week/day planner, manpower by week, techs and time off, material, messages, and asks. It runs in any browser (phone, tablet, laptop) and updates live for everyone.

- **Hosting:** GitHub Pages (free)
- **Logins and live data:** Firebase (free at crew size)

---

## One-time setup (about 15 minutes)

### 1. Create the Firebase project
1. Go to **console.firebase.google.com** and sign in with your Google account.
2. **Create a project** → name it `crew-lookahead` → you can turn off Google Analytics → **Create**.
3. On the project home, click the **web icon `</>`** ("Add app") → nickname `Crew Lookahead` → leave "Firebase Hosting" unchecked → **Register app**.
4. You'll see a block of code with `const firebaseConfig = { apiKey: ..., authDomain: ..., projectId: ... }`. **Copy those values.** They go into `firebase-config.js`, or paste them to Claude and it will put them there for you.

### 2. Turn on sign-in
1. Left menu → **Build → Authentication** → **Get started**.
2. **Sign-in method** tab → enable **Google** (pick your email as the support email) → Save.
3. Enable **Email/Password** too (first switch only) → Save.

### 3. Create the database and lock it down
1. Left menu → **Build → Firestore Database** → **Create database**.
2. Location: **nam5 (United States)** → **Start in production mode** → Create.
3. Open the **Rules** tab, delete everything there, paste in the full contents of `firestore.rules` from this folder, and click **Publish**.

### 4. Put the app online with GitHub Pages
1. On github.com, create a **new public repository** named `crew-lookahead`. Public is fine: there are no passwords in the code, and the rules protect your data.
2. Upload every file in this folder to it (or tell Claude the repo name and it will push the files for you).
3. In the repo: **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → Save.
4. After about a minute, your site is live at `https://YOUR-GITHUB-NAME.github.io/crew-lookahead/`.

### 5. Allow that web address to sign in
Firebase → **Authentication → Settings → Authorized domains → Add domain** → enter `YOUR-GITHUB-NAME.github.io`.

### 6. Sign in first, then bring over your old board
1. **You (Tim) open the site and sign in before anyone else.** The first person to sign in becomes the owner.
2. Go to the **Crew** tab → **Bring over my old board**. This copies your techs and jobs from the claude.ai version.
3. Tap **Set up my profile** → "Yes, I'm Tim Willis" to link your login to your crew-list entry.

### 7. Invite your superintendent and the crew
1. Send them the site link. They sign in with Google or with an email and password.
2. They fill in their profile, then show up on **Crew → Team → Waiting**. Pick whether they're a new tech or "Same person as …" someone already on the list, then tap **Approve**.
3. For your superintendent, change his role to **Superintendent** in the dropdown next to his name. Only the owner can do this.

---

## Who can do what (enforced by the database, not just the buttons)

| | Owner (Tim) | Superintendent / Lead | Crew | Waiting for approval |
|---|---|---|---|---|
| See the schedule, crew, material, messages | ✓ | ✓ | ✓ | – |
| Post messages and asks, reply | ✓ | ✓ | ✓ | – |
| Update material counts (−/+) | ✓ | ✓ | ✓ | – |
| Edit own profile, request time off | ✓ | ✓ | ✓ | own profile only |
| Add or edit jobs, techs, time off, material items | ✓ | ✓ | – | – |
| Approve or decline new people | ✓ | ✓ | – | – |
| Make someone Superintendent or Lead | ✓ | – | – | – |

## Install it like an app
- **iPhone/iPad:** open the site in Safari → Share → **Add to Home Screen**.
- **Android/Chrome:** ⋮ menu → **Install app** or **Add to home screen**.
- **Laptop (Chrome/Edge):** the install icon in the address bar, or just bookmark it.

## Changing the app later
Ask Claude for the change in a chat and give it access to this repo. It edits the files and pushes to GitHub, and GitHub Pages republishes in a minute or two. Everyone gets the new version the next time they refresh.

## Files
- `index.html`: the whole app
- `firebase-config.js`: your Firebase project settings
- `firestore.rules`: who can read and write what (paste into Firebase → Firestore → Rules)
- `import-data.json`: your techs and jobs from the claude.ai board, used once by "Bring over my old board"
- `manifest.webmanifest`, `icon-*.png`: home-screen app icon
