# Content audit

## Existing implementation

| Existing area | Current content | Mahogany mapping | Backend / verification |
| --- | --- | --- | --- |
| Pinned scroll story | Seed, germination, seedling and mature-tree images controlled by ScrollTrigger | Retain intact; change only copy to the Mahogany ownership story | No backend; no animation changes |
| Header | Verdant brand, generic farm links | Managed Mahogany Farmland, Journey, Projects, Farm Life | Project/final navigation targets are local only |
| Hero / seed | Generic legacy copy | Professionally managed mahogany farmland | Species requires confirmation |
| Roots stage | Generic stewardship copy | Land, documentation, soil, water and plantation planning | Service delivery requires confirmation |
| Sprout stage | Generic young-plant copy | Managed-farmland model | Management service scope requires confirmation |
| Mature-tree stage | Generic legacy copy | Long-term mahogany legacy and farm visit CTA | No financial claims |
| Post-story page | One placeholder section | Educational, service, project, lifestyle, FAQ and enquiry content | Project facts remain marked as placeholders |
| Forms / APIs | None | Static enquiry form only | Backend integration is not present |
| SEO | Basic title only | Metadata, semantic headings and FAQ JSON-LD | Canonical URL / social image require confirmation |

## Animation inventory

- `src/App.tsx` owns the pinned `ScrollTrigger` and all story image progress ranges.
- `src/FarmStory.tsx` is an unused earlier Three.js prototype, not rendered by the current homepage.
- No animation values or image-progress boundaries will be altered for this content implementation.
