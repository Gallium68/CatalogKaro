# CatalogKaro

For small business owners (tailors, boutiques, bakers, freelancers, salons) —
build a digital catalog, share it on WhatsApp, and let customers order or
enquire directly.

This entire app is built with **zero rupees of investment**:
- **Hosting:** Vercel (free forever)
- **Database + Login:** Supabase (free tier)
- **Map:** OpenStreetMap (free, no API key)
- **Payments (later):** Razorpay (free to set up, only takes a % per transaction)

You don't need to install anything on your own computer — everything happens
through your browser on the GitHub and Vercel websites.

---

## Step 1: Set up the database (Supabase)

1. Open the `supabase/schema.sql` file (it's in this same folder).
2. Copy the entire contents.
3. Go to your Supabase project dashboard → left sidebar → **SQL Editor** → **New query**.
4. Paste it in and click **Run**.
5. Open **Table Editor** in the left sidebar — you should see two tables,
   `businesses` and `products`. If they're there, everything worked.

## Step 2: Turn on login providers (Supabase)

1. Supabase dashboard → left sidebar → **Authentication** → **Providers**.
2. **Email** will already be ON — leave it as is.
3. Find the **Google** provider and turn it ON. It will ask for a "Client ID"
   and "Client Secret" — you'll get these from Google (see Step 3).
4. In the same Authentication section, open **URL Configuration**:
   - Set **Site URL** to your live Vercel link (e.g. `https://catalogkaro.vercel.app`)
     — you'll get this in Step 5, so it's fine to leave blank for now and
     come back to fill it in.
   - Add `https://catalogkaro.vercel.app/auth/callback` to **Redirect URLs**
     (use your actual Vercel domain — this is just an example).

## Step 3: Set up Google Sign-In (free, one-time)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and log in
   with a free Google account.
2. Create a new project (any name, e.g. "CatalogKaro").
3. In the left menu, go to **APIs & Services** → **OAuth consent screen** →
   choose "External", fill in "CatalogKaro" as the app name and your email, then save.
4. Go to **APIs & Services** → **Credentials** → **Create Credentials** →
   **OAuth client ID**.
5. Application type: **Web application**.
6. Under **Authorized redirect URIs**, add Supabase's callback URL — you'll
   find this written on Supabase's Google provider settings page (it looks
   like `https://xxxxx.supabase.co/auth/v1/callback`).
7. Click Create — you'll get a "Client ID" and "Client Secret". Copy both and
   paste them into Supabase's Google provider settings, then Save.

## Step 4: Upload the code to GitHub

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Create a **New repository**, name it "catalogkaro", either Public or Private.
3. Click "uploading an existing file" (shown right after you create the repo).
4. Drag and drop every file and folder from inside this project folder
   (there's no `node_modules` folder to worry about — it won't exist here).
5. Commit the changes (e.g. with the message "Add CatalogKaro app").

## Step 5: Publish it live on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with **"Continue with GitHub"**.
2. Click **Add New → Project**, select your `catalogkaro` repository, click **Import**.
3. Before deploying, add these 2 **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL (`https://xxxxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase "Publishable key"
4. Click **Deploy**. It'll be live in 1-2 minutes, with a link like
   `catalogkaro.vercel.app`.
5. Go back to Step 2 and add this link to "Site URL" and "Redirect URLs".

That's it — the app is live! Log in and try building a catalog to test it.

---

## For later (not needed right away)

### Payments (₹199 one-time upgrade)
Once your Razorpay account is set up (free KYC using PAN + bank details):
1. Create a **Payment Link** in the Razorpay dashboard for ₹199.
2. Add that link to Vercel's Environment Variables as
   `NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK`, then redeploy.
3. **Manual process for now:** when someone pays, open Supabase's
   **Table Editor**, find that business's row in the `businesses` table, and
   set `is_paid` to `true`. This immediately unlocks unlimited items and
   removes ads. (Automating this fully will need a bit more code later, once
   the traffic justifies it.)

### Ads (dashboard, for free-tier users)
1. Create a free account at [Google AdSense](https://www.google.com/adsense/)
   (your site needs to be live first for approval).
2. Once approved, replace the placeholder text in `components/AdBanner.js`
   with the real AdSense ad code (you'll need a bit of coding help for this —
   just ask when you get there).

### Custom domain
The free `.vercel.app` link will always work. If you want your own domain
(e.g. `catalogkaro.in`), you can buy one from GoDaddy/Namecheap and add it
under Vercel's "Domains" section — this does cost money (~₹700-900/year), and
is an optional step for later.

---

## Fair-use note (Map)

The location map uses OpenStreetMap's free Nominatim service — no cost, but
it runs on a "fair use" policy (sending too many requests at once isn't
allowed). For our use case (a business saves its address once), this is
perfectly fine.
