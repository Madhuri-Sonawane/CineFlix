# 🎬 Cineflex — Movie Streaming UI

**Live Demo → [https://cine-flix-pi.vercel.app/](https://cine-flix-pi.vercel.app/)**

Cineflex is a Netflix-inspired movie streaming frontend built to simulate how a real OTT platform behaves across multiple users and profiles. The focus is on **UI behavior, user experience, and realistic product logic** — not just fetching and displaying movies.

Built from scratch to practice real-world frontend architecture, profile-scoped state management, and animation-driven interactions.

---

## ✨ What makes this different?

This is not a basic movie listing app. Cineflex is built with **product-level thinking**:

- Every profile behaves like a separate user — its own watchlist, activity, and continue watching row
- Kids profiles get a completely different experience — restricted content, no search, no filters
- The UI reacts to state at every level — who's watching, what they've seen, what mood they're in
- Animations are purposeful, not decorative — entrances, exits, hover states, and loading all have intentional motion

---

## 🚀 Features

### 👤 Profile System
- Create and manage multiple profiles (Adult & Kids)
- Owner role with elevated permissions — can add, edit, and delete other profiles
- Kids profile with fully restricted content and hidden filters/search
- Profile-specific Watch Later list, Watch Activity, and Continue Watching row
- Animated profile selection screen with gradient avatar rings and entrance animations
- Edit profile — change name, avatar, role, and optional owner PIN

### 🎥 Movie Experience
- Cinematic hero banner with shimmer letterbox bars, genre tags, and animated star rating
- Real-time movie discovery via **TMDB API** with debounced search input
- **Mood-based filtering** — "I'm feeling…" bar with 8 one-click genre presets, each with its own accent color
- Genre, rating (slider), and year filters — all combinable, with a live active-count badge
- Continue Watching row with per-profile progress bars
- Watch Later list with bookmark toggle on every card
- Movie detail page with blurred backdrop, trailer modal, stats pills, and production info

### 🎨 UI & UX
- **Cinematic loading screen** on app launch — animated logo, gold wordmark, progress bar, and scan-line effect
- Frosted glass sidebar panels throughout — filter sidebar, profile sidebar, trailer modal
- **Skeleton loading cards** during API fetch — no layout shift, no plain spinners
- 3D card tilt on hover using GSAP mouse tracking
- Scroll-aware navbar — opacity and border glow intensify as you scroll
- Staggered GSAP entrance animations on every page
- Custom iOS-style toggle switches, pill inputs, and SVG icon system
- Responsive — sticky sidebar on desktop, animated GSAP drawer on mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + CSS Variables (design tokens) |
| Animations | GSAP (GreenSock) |
| Routing | React Router DOM v6 |
| API | TMDB (The Movie Database) |
| State | React Hooks + localStorage |
| Deployment | Vercel |

**Design system:** Deep Purple + Gold theme built on CSS custom properties — all colors, gradients, and surfaces defined as tokens in `index.css`.

---

## 📂 Project Focus

This project demonstrates:

- Component-based architecture with reusable, self-contained UI pieces (`MoodBar`, `Hero`, `MovieGrid`, `SideBar`, `LoadingScreen`, `ProfileSidebar`)
- Conditional rendering and access control based on profile role (Owner / Adult / Kids)
- Complex UI state management without Redux — React Hooks + localStorage only
- Animation orchestration with GSAP timelines across page entrances, exits, and interactions
- Realistic product-level UX flows (profile switching, Kids lock, mood filtering, watch progress)

---

## 📸 Pages

`/` Home · `/movie/:id` Movie Detail · `/profiles` Profile Select · `/profile` Manage Profiles · `/profile/edit/:id` Edit Profile · `/watch-later` Watch Later · `/activity` Watch Activity

---

## 📌 Note

This project is currently **frontend-only**. Backend authentication and database integration are planned as a future enhancement.

---

**Live → [https://cine-flix-pi.vercel.app/](https://cine-flix-pi.vercel.app/)**
