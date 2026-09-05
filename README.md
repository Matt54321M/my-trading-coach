# MyTradingCoach

Personal elite SMC/ICT chart analysis website.  
Paste a TradingView link (or upload a screenshot) → AI analyzes it using **your exact rules** → remembers patterns → shows entry, stop, targets, and probability.

Built with Next.js 15 + Supabase + OpenAI GPT-4o + Playwright. Ready for Vercel.

---

## What you need before starting

1. A free [Supabase](https://supabase.com) account  
2. An [OpenAI](https://platform.openai.com) account with API access (GPT-4o)  
3. A free [Vercel](https://vercel.com) account (for hosting)  
4. Node.js 18+ installed on your computer ([download here](https://nodejs.org))

---

## Step-by-step setup (complete beginner)

### 1. Download / open the project

If you received this folder, open a terminal inside the `my-trading-coach` folder.

```bash
cd my-trading-coach
```

### 2. Install dependencies

```bash
npm install
```

(This also tries to install Playwright Chromium. On some systems you may need to run `npx playwright install chromium` afterwards.)

### 3. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) → New Project  
2. Choose a name, set a database password, pick a region close to you  
3. Wait until the project is ready  

### 4. Create the database tables

1. In Supabase go to **SQL Editor** → New query  
2. Open the file `supabase-schema.sql` from this project  
3. Copy **everything** and paste into the SQL Editor  
4. Click **Run**  
5. You should see “Success”

### 5. Get your Supabase keys

1. Go to **Project Settings → API**  
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`  
     (Keep the service_role key secret!)

### 6. Create OpenAI API key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)  
2. Create a new secret key  
3. Copy it → `OPENAI_API_KEY`

### 7. Create environment file

In the project root create a file named `.env.local` and paste:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
```

Replace the values with the ones you copied.

### 8. (Recommended) Disable email confirmation for easy testing

In Supabase → **Authentication → Providers → Email**  
Turn **off** “Confirm email”. This lets you sign up and log in immediately.

### 9. Run the website locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

1. Click **Create one** → sign up with any email + password  
2. Go to **Dashboard** → paste a TradingView chart link or upload a screenshot  
3. Click **Analyze Chart**

---

## Deploy to Vercel (so it works 24/7)

1. Push the project to a GitHub repository (or use the Vercel CLI)  
2. Go to [https://vercel.com](https://vercel.com) → New Project → Import your repo  
3. In **Environment Variables** add the same four variables from `.env.local`  
4. Click **Deploy**

**Important notes about Playwright on Vercel**

- Playwright needs a browser binary. The free Vercel Hobby plan has limitations with large binaries and execution time.  
- For production reliability you have two options:
  1. Prefer **uploading screenshots** (always works).  
  2. Or use a browser service (Browserless, ScrapingBee, etc.) and replace the Playwright code.  

If Playwright fails, the app automatically asks the user to upload a screenshot instead.

---

## How the system works

| Feature | What happens |
|---------|--------------|
| **Login / Signup** | Supabase Auth (email + password) |
| **TradingView link** | Backend opens the page with Playwright, takes a high-quality screenshot of the chart |
| **Upload image** | Image is sent directly |
| **Analysis** | Screenshot + your rules + past patterns are sent to GPT-4o (vision) |
| **Pattern memory** | Every analysis is automatically described, classified and saved |
| **Rules page** | Your extra personal rules are stored and injected into every future analysis |
| **History** | All past analyses with image, bias, status and probability |

---

## Project structure (simplified)

```
my-trading-coach/
├── src/
│   ├── app/
│   │   ├── dashboard/     ← main analysis page
│   │   ├── history/       ← past analyses
│   │   ├── rules/         ← edit your rules
│   │   ├── login/ & signup/
│   │   └── api/analyze/   ← the brain (Playwright + AI)
│   ├── components/
│   ├── lib/
│   │   ├── ai.ts          ← OpenAI + system prompt
│   │   ├── playwright.ts  ← TradingView screenshot
│   │   └── supabase/      ← auth & database helpers
│   └── types/
├── supabase-schema.sql    ← run this once in Supabase
├── .env.example
└── README.md
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| “Please log in first” | Make sure you signed up and are logged in |
| Playwright fails | Just upload a screenshot instead – the app supports this fallback |
| AI returns error | Check your OpenAI key and that you have credits |
| Images not showing | Confirm the `charts` storage bucket is public (the SQL script does this) |
| Build fails on Vercel | Make sure all 4 environment variables are set |

---

## Cost estimate

- Supabase free tier is enough for personal use  
- OpenAI GPT-4o: roughly $0.01–0.05 per analysis depending on image size  
- Vercel free tier works for light personal use

---

Enjoy your personal trading coach.
