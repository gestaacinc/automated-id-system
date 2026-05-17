# Automated Student ID System

A browser-based student ID card generator. Capture a photo via webcam (or upload one), fill in student info, preview the front and back of the ID, and download a print-ready 2-sided PDF.

## Project structure

- `id-system-client/` — React + Vite frontend (deployed to GitHub Pages)
- `id-system-server/` — Optional Express backend (only used for local file saving; **not needed** for the GitHub Pages deployment)

## Run locally

```bash
cd id-system-client
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/`).

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and deploys automatically.

### One-time setup

1. Push the repo to GitHub (via GitHub Desktop or `git push`).
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the Actions tab). It will build and publish the site automatically.

### Repo name

The frontend is configured to be served from `/<repo-name>/`. If your repo is named anything other than `automated-id-system`, update the `base` value in `id-system-client/vite.config.ts` to match.

For user/organization sites (repos named `<your-username>.github.io`), set `base: '/'`.
