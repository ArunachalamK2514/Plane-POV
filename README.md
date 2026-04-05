# ✈ Plane POV

A first-person sky flight experience. Upload your photos and fly through the sky to discover them floating among the clouds.

## Features

- 🌤 Beautiful clear blue sky with procedural clouds (no sun glare)
- 📷 Upload photos that float in the world
- 🕹 First-person flight controls (WASD + mouse look)
- ⚡ Adjustable flight speed with on-screen indicator (0.5× to 5.0×)
- ❤ Click photos to like them (cursor appears instantly)
- 🗺 World grows as you add more photos
- 💾 Persists across sessions via IndexedDB
- 🔐 Upload modal appears first on startup until photos are added

## Controls

| Input | Action |
|-------|--------|
| **Flight Mode** | |
| Click canvas | Enter flight mode (requires at least one photo) |
| W / S | Fly forward / backward |
| A / D | Strafe left / right |
| Space | Fly up |
| Shift | Fly down |
| ↑ / ↓ Arrow keys | Increase / decrease flight speed |
| Mouse | Look around |
| ESC | Exit flight mode |
| **Photos** | |
| Click floating photo | Enlarge and view photo |
| ♡ / ♥ Button | Like photo (shows count on floating photo) |
| ESC | Close photo view |
| **HUD Buttons** | |
| 📷 Button (bottom-right) | Open upload panel |
| 🗑 Button (above 📷) | Clear all photos (shows when not flying) |

**Speed Indicator** — Visible in the bottom-right while flying. Shows current speed multiplier (e.g., `1.0×`, `2.5×`). Use arrow keys to adjust between 0.5× and 5.0×.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- React 19 + Vite
- React Three Fiber + Drei (Three.js)
- Zustand (state management)
- Framer Motion (animations)
- IndexedDB (idb) — local storage

## Notes

- **Local Storage Only** — All photos are stored in your browser's IndexedDB. No data is sent to any server.
- **Persistence** — Photos remain saved even after closing the app/browser. They only disappear if you manually clear them or your browser's cache.
- **Clearing Photos** — Click the 🗑 (trash) button above the upload button to permanently delete all photos. You'll be asked to confirm before deletion.
- **Speed Controls** — Adjust flight speed using ↑ and ↓ arrow keys (range: 0.5× to 5.0×). Speed preference is remembered but not affected by resetting photos.
- Desktop + mouse recommended (mobile not supported in v1)
- Max 50 photos per session
- The upload modal appears when you first open the app; you must upload at least one photo before you can fly
- Pointer lock (cursor lock) is automatically released when viewing a photo
