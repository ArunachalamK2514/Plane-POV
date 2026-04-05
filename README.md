# ✈ Plane POV

A first-person sky flight experience. Upload your photos and fly through the sky to discover them floating among the clouds.

## Features

- 🌤 Real-time 3D sky with procedural clouds
- 📷 Upload photos that float in the world
- 🕹 First-person flight controls (WASD + mouse look)
- ❤ Like your favorite photos
- 🗺 World grows as you add more photos
- 💾 Persists across sessions via IndexedDB

## Controls

| Key | Action |
|-----|--------|
| Click canvas | Enter flight mode |
| W / S | Fly forward / backward |
| A / D | Strafe left / right |
| Space | Fly up |
| Shift | Fly down |
| Mouse | Look around |
| ESC | Exit flight mode |

Click any floating photo to enlarge it and like it.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- React 18 + Vite
- React Three Fiber + Drei
- Zustand
- Framer Motion
- IndexedDB (idb)

## Notes

- All data is stored locally in your browser — no server required
- Desktop + mouse recommended (mobile not supported in v1)
- Max 50 photos per session
