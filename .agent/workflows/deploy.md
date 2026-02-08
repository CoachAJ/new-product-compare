---
description: How to deploy HealthCompare AI to Netlify via GitHub
---

Follow these steps to deploy your application:

### 1. Initialize Git & GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Open your terminal in the project directory: `c:\Users\atifj\Desktop\Compare YGY Products`.
3. Run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HealthCompare AI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Deploy to Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select **GitHub** and authorize.
4. Choose your `HealthCompare AI` repository.
5. Netlify should automatically detect the settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**.

### 3. Updates
Whenever you make changes, simply push them to GitHub:
```bash
git add .
git commit -m "describe your changes"
git push
```
Netlify will automatically redeploy your site.
