# Bushido Karate Kickboxing & Sports Academy

Official website for **Bushido Karate Kickboxing & Sports Academy** in Mumbai — a premier martial arts academy founded by Sensei Afzal Sultan Khan, teaching Karate Shotokan and Kickboxing with discipline, respect, and the spirit of the warrior.

The site is a public-facing brochure (Home, About, Trainers, Events, Gallery, Contact) plus a protected admin panel for managing events, gallery images, and trainer bio content.

## Tech Stack

- **React 19** + **Vite** — UI framework and build tooling
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — styling
- **React Router DOM v6** — client-side routing
- **Firebase** — Authentication (admin login), Firestore (events / gallery / trainers), Hosting
- **Cloudinary** — image upload and CDN delivery for events and gallery
- **lucide-react** — icons (with inline SVG fallbacks for missing icons)

## Project Structure

```
src/
  components/        Navbar, Footer, ProtectedRoute, ScrollToTop, admin/Toast
  context/           AuthContext (Firebase auth state)
  firebase/          Firebase app + Firestore + Auth initialization
  pages/             Home, About, Trainers, Events, Gallery, Contact, NotFound
  pages/admin/       AdminLogin, AdminDashboard, AdminOverview,
                     ManageEvents, ManageGallery, ManageTrainerBio
  utils/             cloudinary upload helper, seedData
```

## Run Locally

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

The app is served at `http://localhost:5173` by default.

## Build

```bash
npm run build       # outputs static assets to dist/
npm run preview     # preview the production build locally
```

## Deploy (Firebase Hosting)

The project ships with `firebase.json` and `.firebaserc` configured for the `bushido-academy` project.

One-time setup (per machine):

```bash
npm install -g firebase-tools
firebase login
```

Build and deploy:

```bash
npm run build
firebase deploy
```

For hosting-only deploys: `firebase deploy --only hosting`.

## Environment Variables

Create a `.env` file in the project root with these keys:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=bushido-academy
```

- Firebase values come from your Firebase project settings → "General" → "Your apps" → SDK config.
- The Cloudinary upload preset must be set to **unsigned** and allow uploads to the `events` and `gallery` folders.

## Admin Panel

- Visit `/admin/login` and sign in with a Firebase Auth user (Email/Password provider must be enabled in the Firebase console).
- After login you'll see `/admin` with sidebar links: Overview, Events, Gallery, Trainer Bio.
- In development (`import.meta.env.DEV`) a hidden **Seed Data** button appears in the sidebar; clicking it once populates the `trainers` collection with the founder document defined in [`src/utils/seedData.js`](src/utils/seedData.js). It is a no-op if data already exists.

## Firestore Collections

| Collection | Document shape |
|-----------|----------------|
| `events`   | `{ title, description, date (Timestamp), imageUrl, createdAt }` |
| `gallery`  | `{ imageUrl, caption, uploadedAt }` |
| `trainers` | `{ name, dob, profession, qualifications[], experience, hometown, bio, imageUrl }` |

Set Firestore security rules to allow public read on these collections and write only for authenticated admins.
