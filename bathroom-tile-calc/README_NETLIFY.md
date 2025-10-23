# Deploying bathroom-tile-calc to Netlify

This short guide shows two ways to deploy the static `bathroom-tile-calc` site to Netlify:

- Netlify web UI (recommended for first-time deploys)
- Netlify CLI (for CI or local quick deploys)

Publish directory: `bathroom-tile-calc/` (the folder that contains `index.html`)

---

## 1) Deploy with Netlify web UI

1. Create a (free) Netlify account at https://app.netlify.com/signup
2. In the Netlify dashboard, click "Add new site" → "Import from Git"
3. Connect your Git provider (GitHub/GitLab/Bitbucket) and authorize Netlify
4. Select the repository `AI-Assited-Coding` and the branch to deploy (e.g. `main`)
5. In the "Build settings":
   - Build command: (leave empty)
   - Publish directory: `bathroom-tile-calc` (or `bathroom-tile-calc/`)
6. Click "Deploy site". Netlify will deploy the static files from the specified folder.

Notes:
- A `netlify.toml` file is present in the `bathroom-tile-calc/` folder. It configures the publish directory to the current folder.
- If your repo contains multiple projects, make sure you point "Publish directory" to `bathroom-tile-calc`.

---

## 2) Deploy with Netlify CLI (PowerShell)

Prerequisites:
- Node.js installed (https://nodejs.org/)
- Netlify CLI installed globally: `npm install -g netlify-cli`

Steps (run in PowerShell):

```powershell
# From the repo root or directly inside the folder
cd c:\Projects\Intro-Programming-AI\AI-Assited-Coding\bathroom-tile-calc
# Login to Netlify (opens browser for authentication)
netlify login
# Create & deploy a new site interactively
netlify init
# OR deploy directly (deploys current folder contents)
netlify deploy --prod --dir=.
```

- `netlify init` will let you link to an existing Netlify site or create a new one.
- `netlify deploy --prod --dir=.` will perform a production deploy of the current folder to the linked site (or create one if none linked and you pass `--site` with a site id).

---

## Verify the deployment

- After deploy, open the provided Netlify URL (shown in the dashboard or CLI output).
- Check `index.html` loads and interactive pieces (e.g. calculator) function.
- If you see a 404, verify the publish directory in site settings is `bathroom-tile-calc` and that `index.html` exists there.

---

## Optional next steps

- Add a custom domain in Netlify dashboard (and enable automatic HTTPS).
- Hook up Git-based continuous deploys so changes to `main` auto-deploy.
- If you want to pre-build or bundle assets in the future, add a build command and update `netlify.toml` accordingly.

If you'd like, I can run the Netlify CLI deploy from your machine (requires you to run `netlify login` to authenticate) or I can guide you through the web UI deploy step-by-step.