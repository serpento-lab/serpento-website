# Serpento website

The public website for Serpento, a surgical robotics research lab and early-stage company at the University of Calgary.

It is a plain static site: HTML, CSS and JavaScript, with no build step and nothing to install. It is hosted on GitHub Pages at **serpento.io**.

---

## Quick start

- **See it on your computer:** double-click `index.html`. It opens in your browser.
- **Publish a change:** edit a file, then commit and push to the `main` branch on GitHub. The live site updates within a minute or two.

---

## Common edits

Most changes only touch the three files in `content/`. Each one has instructions at the top.

| I want to… | Edit this | How |
|---|---|---|
| Add or remove a team member | `content/team.js` | Add their photo to `assets/img/team/`, then copy a `{ ... }` block and change the text |
| Add a paper, talk or thesis | `content/publications.js` | Copy a `{ ... }` block to the top of the list |
| Change the contact email | `content/site.js` | Change `email:` |
| Change the footer text or company name | `content/site.js` | `tagline:`, `legalName:`, `disclaimer:` |
| Make the contact form send real emails | `content/site.js` | Create a free form at [formspree.io](https://formspree.io) and paste its endpoint into `formEndpoint:` |
| Change a headline or paragraph | The page's `.html` file | Find the text and change it |
| Change colours or fonts | `assets/css/main.css` | The `:root { ... }` block at the top |
| Replace the hero film | `assets/film/` | See "The hero film" below |

### Rules for editing the `content/` files

They are JavaScript, so a few characters matter:

- Keep text inside quotes: `'like this'`.
- If the text itself contains an apostrophe, put a backslash in front of it: `'Children\'s Hospital'`.
- Every `{ ... }` block and every line inside it ends with a comma.
- If a page goes blank after an edit, a quote or comma is usually missing. Undo your last change, or open the browser console (F12) to see the line number.

### Team photos

- Square, about 500 × 500 px, `.jpg`, under 150 KB.
- Name the file after the person's surname, e.g. `smith.jpg`.
- Photos are shown in black and white and turn to colour on hover. That is done by the site, so upload them in colour.

---

## Adding a new page

1. Copy `research.html` and rename it, e.g. `news.html`.
2. In the new file, change `<body data-page="research">` to `<body data-page="news">`. Then change the `<title>`, the description and the content between `<main>` and `</main>`.
3. Add it to the menu in `content/site.js`:
   ```js
   { label: 'News', href: 'news.html', page: 'news' },
   ```

The menu and footer are built from that list, so every page picks up the new link by itself.

---

## Folder layout

```
serpento-website/
├── index.html            Mission & approach (home, with the hero film)
├── research.html         Research areas & publications
├── team.html             Team
├── contact.html          Contact
├── 404.html              "Page not found"
├── content/              ← text that changes often
│   ├── site.js           email, menu, footer, form endpoint
│   ├── team.js           people
│   └── publications.js   papers, talks, theses
└── assets/
    ├── css/main.css      all styling
    ├── js/
    │   ├── site.js         menu, footer, fade-ins, counters (every page)
    │   ├── home.js         hero film, mission text, approach stages
    │   ├── field.js        moving dot background on dark page headers
    │   ├── team.js         builds the team grid from content/team.js
    │   ├── publications.js builds the publication list
    │   └── contact.js      copy-email button and form
    ├── img/
    │   ├── team/         portrait photos
    │   ├── favicon.svg   browser tab icon
    │   └── og-image.jpg  preview image when the link is shared
    └── film/
        ├── film.js       number of frames (written by the script)
        ├── desktop/      180 frames, 16:9
        └── mobile/       90 frames, 9:16 (used on phones)
```

---

## The hero film

The operating-room film on the home page is a series of images rendered in Blender. Scrolling moves through them. The Blender project is kept separately in `blender_kit/` and is not part of this repository.

To replace the film:

1. Render new frames with `blender_kit/serpento_or.py` (see that folder's README).
2. From the `blender_kit` folder, run:
   ```
   python make_web_frames.py frames_16x9 ../serpento-website/assets/film/desktop --width 1440
   python make_web_frames.py frames_9x16 ../serpento-website/assets/film/mobile --width 720 --every 2
   ```
3. Commit and push.

Keep the whole film folder under about 30 MB so the page stays fast.

---

## Hosting

- **Host:** GitHub Pages, from the `main` branch, root folder.
- **Domain:** serpento.io. DNS is managed at the domain registrar and points to GitHub Pages. The custom domain is set in the repository under Settings → Pages.
- **HTTPS:** "Enforce HTTPS" is switched on in Settings → Pages.
- `.nojekyll` tells GitHub Pages to serve the files exactly as they are.

## Not on the site, on purpose

- The Serpento device itself (patent pending). Do not add images, renders or descriptions of it.
- DIC results appear only as publication titles.

## Fonts and licences

- Fonts: Red Hat Display, Text and Mono, served by Google Fonts (SIL Open Font License).
- Site code: © 2769250 Alberta Ltd.
- Team photos are used with each person's permission. Do not reuse them elsewhere.
