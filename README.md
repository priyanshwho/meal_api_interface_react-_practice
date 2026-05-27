# Meals Explorer

Meals Explorer is a modern recipe discovery experience built on the FreeAPI meals catalog. It turns a large public meal dataset into a polished editorial browsing product with a soft magazine feel, smooth animations, and an immersive pastel palette.

## What it does

- Browse meals from the public API in a responsive card grid
- Search by meal name, ingredients, category, or cuisine
- Filter meals by category chips
- Open a detailed recipe modal for full instructions and ingredients
- Save favorites locally in the browser
- Share recipes and jump to the YouTube tutorial link when available
- Load more meals with infinite scrolling

## Product style

The interface is designed to feel like a culinary editorial rather than a plain directory. The visual system uses dusty rose, muted coral, terracotta, and warm cream tones, with glassmorphism layers, floating cards, soft shadows, and gentle motion.

The top hero area acts like a featured recipe spread. It highlights one meal with a story-like layout, quick stats, ingredient hints, and action buttons. The rest of the page behaves like a curated archive with category pills and a responsive bento-style meal gallery.

## Loading experience

Meals Explorer uses a shimmer-style skeleton state while data is loading. Instead of a hard spinner, the loading UI shows soft placeholder cards that match the final layout, so the page feels calm and intentional while content arrives.

## API

The app reads from the FreeAPI public meals endpoint:

`https://api.freeapi.app/api/v1/public/meals`

The response includes meal metadata such as:

- meal name and category
- cuisine / area
- thumbnail image
- recipe instructions
- ingredients and measures
- tags
- YouTube tutorial link

## Key UI details

- **Responsive navigation:** search, theme toggle, and random meal action stay accessible on all screen sizes
- **Editorial hero:** a featured meal section with digest text, tags, stats, and ingredient hints
- **Card grid:** visually stacked recipe cards with image overlays and quick actions
- **Dark / light theme:** theme state is stored locally for a consistent experience
- **Modal recipe view:** full details, ingredients, tags, tutorial link, and sharing controls

## Experience goals

The product aims to feel:

- visual and premium
- fast to browse
- easy to search and filter
- calm during loading
- friendly on mobile and desktop

Meals Explorer is built to make recipe exploration feel more like flipping through a beautiful food magazine than using a standard app list.
