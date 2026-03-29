# Neel Desai — Dual-Mode Portfolio

> A portfolio website that speaks two languages: one for recruiters and one for developers.

🔗 **Live Site**: [https://portfolio-neel-desai.vercel.app/](https://portfolio-neel-desai.vercel.app/)

---

## What Is This?

This is a **personal portfolio website** with a twist — it has **two completely different interfaces** built into one application:

### 🎨 HR Mode (Visual)

The default experience. Opens with a polished **landing page** showcasing my profile, skills highlights, and action buttons. Scroll down to discover an **interactive graph** where my projects, skills, summary, experience, initiatives, and academics are represented as clickable, draggable nodes — like a mind map you can explore.

### 💻 Dev Mode (Terminal)

A fully functional **command-line terminal** where technically-minded visitors can type commands like `projects`, `skills`, or `pro-open portfolio-system` to navigate the same content through a CLI experience. Complete with autocomplete (press Tab!), command history (Arrow keys), and familiar terminal aesthetics.

**Both modes show the exact same content** — just presented differently depending on who's viewing it.

---

## Features at a Glance

| Feature                       | What It Does                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| 🔄 **Two Modes**              | Switch between a visual graph interface and a terminal interface anytime                          |
| 🎬 **Cinematic Transitions**  | Each mode switch plays a unique full-screen animation                                             |
| 🌗 **Light & Dark Theme**     | Automatically matches your device preference, or toggle manually                                  |
| 🗺️ **Interactive Mind Map**   | Click nodes to expand categories, drag to rearrange, click leaves for full details                |
| ⌨️ **Working Terminal**       | Real command parsing with autocomplete, history, and 12+ commands                                 |
| 📱 **Fully Responsive**       | Works seamlessly on phones, tablets, and desktops                                                 |
| 📄 **100% Data-Driven**       | All content lives in simple JSON files — zero coding needed to update                             |
| 🎯 **Portfolio Bottom Sheet** | Clicking any project or category reveals a rich detail panel with descriptions, stacks, and links |
| 📨 **Contact Form**           | Built-in contact dialog accessible from both modes                                                |
| ⬇️ **Resume Download**        | One-click resume download button in the header and landing page                                   |

---

## How to Use the Site

### As a Visitor (HR Mode)

1. **Land** on the hero page — read the bio, see highlights
2. **Scroll down** (or click the arrow) to reach the interactive graph
3. **Click** any category bubble (Projects, Skills, Summary, etc.) to expand it
4. **For Skills**: click a skill category (Frontend, Backend, etc.) to open the detail panel
5. **For Projects/Summary/Experience**: click any expanded item to see its full details
6. **Drag** any node to rearrange the graph however you like
7. **Need help?** Look for the ❓ button in the bottom-left corner

### As a Developer (Dev Mode)

1. Click **"Dev Mode"** in the top-right corner (look for the arrow hint!)
2. Type `help` to see all available commands
3. Try: `about`, `projects`, `skills`, `summary`, `experience`, `initiatives`, `academics`
4. Use `pro-open <project-id>` to inspect a specific project
5. Use `ex-open <experience-id>` to inspect a specific experience entry
6. Use `theme dark` or `theme light` to switch themes
7. Press **Tab** for autocomplete, **Arrow Up/Down** for command history

---

## How to Update Content

**No coding required.** All content is stored in simple JSON files inside `src/data/`. Open any file, change the text, and the site updates automatically.

### Quick Reference

| What to Change          | Which File to Edit          |
| ----------------------- | --------------------------- |
| Name, bio, contact info | `src/data/profile.json`     |
| Projects                | `src/data/projects.json`    |
| Skills (categorized)    | `src/data/skills.json`      |
| Career summary          | `src/data/summary.json`     |
| Experience              | `src/data/experience.json`  |
| Initiatives             | `src/data/initiatives.json` |
| Academics               | `src/data/academics.json`   |
| Graph colors            | `src/data/graphConfig.json` |
| Terminal commands       | `src/data/commands.json`    |
| UI labels & text        | `src/data/uiStrings.json`   |

### Example: Adding a New Project

Open `src/data/projects.json` and add an entry:

```json
{
    "id": "my-new-project",
    "title": "My New Project",
    "shortDescription": "A brief one-liner.",
    "detailedDescription": "A full paragraph about what this project does...",
    "stack": ["React", "TypeScript", "Node.js"],
    "githubLink": "https://github.com/...",
    "liveLink": "https://...",
    "featured": true
}
```

It will automatically appear in the graph, the terminal's `projects` command, and be accessible via `pro-open my-new-project`.

---

## Running Locally

```bash
# 1. Clone the repo
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Opens at `http://localhost:5173`. Changes reload instantly.

### Other Commands

| Command           | What It Does                         |
| ----------------- | ------------------------------------ |
| `npm run build`   | Create a production-ready build      |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Check code for issues                |
| `npm run test`    | Run automated tests                  |

---

## Tech Stack

For those interested in what powers this under the hood:

| Technology         | Role                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| **React 19**       | UI framework — components, hooks, lazy loading, Suspense                        |
| **TypeScript**     | Type safety across all components, data, and state                              |
| **Vite 7**         | Lightning-fast build tool with hot module replacement                           |
| **Zustand**        | Lightweight global state (mode, theme, UI flags) with localStorage persistence  |
| **Tailwind CSS 4** | Utility-first styling with a full HSL design token system for light/dark themes |
| **shadcn/ui**      | 50+ accessible UI primitives (dialog, avatar, toast, input, etc.)               |
| **Lucide React**   | Clean, consistent icon set                                                      |
| **React Router**   | Client-side routing with URL param support (`?mode=dev`)                        |

### Architecture Highlights

- **Mode transition system**: Every mode switch triggers a full-screen cinematic animation (network-forming for HR, boot sequence for Dev) managed by a Zustand `modeTransition` flag.
- **Pointer-based drag & drop**: The graph canvas uses the Pointer Events API with `setPointerCapture` for reliable cross-device node dragging (mouse + touch).
- **Omnidirectional scrolling**: The canvas dynamically computes bounding boxes and adjusts scroll position when nodes are dragged or expanded, supporting scroll in all four directions.
- **Lazy-loaded graph**: The graph component loads only when scrolled into view via `IntersectionObserver` + `React.lazy()`.
- **Zero hardcoded strings**: Every label, message, and content block comes from JSON — the UI components contain only structure and logic.
- **Semantic CSS tokens**: 30+ HSL CSS custom properties define the design system, with separate token sets for the standard UI and terminal UI, each with light and dark variants.
- **System theme detection**: Reads `prefers-color-scheme` on load and listens for real-time OS theme changes.

---

## Project Structure

```
src/
├── components/       # Shared UI (header, theme toggle, contact form, mode intro)
│   ├── dev/          # Terminal interface
│   └── hr/           # Visual interface (landing + graph + detail panel)
├── data/             # All content as JSON (the only files you need to edit)
├── pages/            # Route pages
├── store/            # Zustand global state
└── types/            # TypeScript interfaces
```

---
