# Ekimov Gregory — portfolio

Live: **https://flasqwe.github.io**

Websites, Telegram bots, web apps and parsers for business. A one-page portfolio in a "Swiss editorial" style with a dark theme by default (blue-violet-pink gradient accents, each project glows in its own colour). A light theme is one click away and remembered per visitor. Everything is in English and Russian.

## What's on the page

- **Works card** under the opening statement: previews of three of the five concept sites (SEREIN, OBSID, MONOLIT). Clicking one opens its tab below.
- **Tabbed showcase.** The five concept websites run live inside a browser or phone frame (iframe 1440×900 or 390×844 with a status bar). There is a Desktop / Mobile toggle, and each tab has its own deep link (`#work-serein`, `#work-obsid`, `#work-ognivo`, `#work-luma`, `#work-monolit`, `#work-crm`, `#work-bots`). Arrow, Home and End keys switch tabs. Only the active tab ever holds an iframe.
- **Real product:** a lead-gen CRM and parser, an internal B2B tool. It is private, so a demo is available on request. Screenshots use fictional demo data only.
- **Bots & parsers:** an animated Telegram booking bot and a lead-parser terminal, plus web apps, CRM and integrations.
- Services, process and a contact block (email with a copy button and a pre-filled `mailto`).

## Concept websites

| Project | Niche | Live demo |
|---|---|---|
| **SEREIN Residences** | Premium residential real estate · riverside | [flasqwe.github.io/serein](https://flasqwe.github.io/serein/) |
| **OBSID** | Paint protection film & detailing studio | [flasqwe.github.io/obsid](https://flasqwe.github.io/obsid/) |
| **OGNIVO** | Restaurant · wood-fired kitchen | [flasqwe.github.io/ognivo](https://flasqwe.github.io/ognivo/) |
| **LUMA Dental** | Dental clinic | [flasqwe.github.io/luma](https://flasqwe.github.io/luma/) |
| **MONOLIT** | Construction company | [flasqwe.github.io/monolit](https://flasqwe.github.io/monolit/) |

Demo projects are concepts: company names, people, addresses and reviews are fictional, and forms do not send data anywhere. Photos: [Unsplash](https://unsplash.com/license).

## Structure

```
index.html          portfolio page
assets/site.css     styles (dark by default + optional light theme)
assets/site.js      EN/RU dictionary, showcase tabs, live previews, bot/parser animation, email
assets/shots/       screenshots used as posters and previews
assets/thumbs/      small thumbnails (not referenced by the current page)
serein/ obsid/ ognivo/ luma/ monolit/   the five concept sites
404.html
```

Plain HTML, CSS and JavaScript, with no frameworks and no build step. All paths are relative, so the site works on GitHub Pages and on any local static server (for example `python3 -m http.server`).

The portfolio language is stored in `eg-lang` and copied into the demos' keys (`serein-lang`, `obsid-lang`, `ognivo-lang`, `luma-lang`, `monolit-lang`), so the live previews open in the same language. The theme is stored in `eg-theme`.

Contact: ekimovgregory9@gmail.com
