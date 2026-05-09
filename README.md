# RetailFlow White Label (Expo + Supabase)

A cross-platform **web + mobile** shop management app starter built with React Native Expo and Supabase.


## White-label customization
Update one file to rebrand for each client:
- `constants/branding.js`: app name, tagline, slug, scheme, and package-facing name.

Recommended per-client flow:
1. Copy the project for the client.
2. Update values in `constants/branding.js`.
3. Mirror `expo.name`, `expo.slug`, `expo.scheme` in `app.json`.
4. Mirror `name` in `package.json`.

## Included modules
- Dashboard widgets + chart analytics
- Inventory management
- Sales tracking
- Product & category management
- Invoice generation section
- Stock management
- Auth/Profile/Settings
- Backup, Privacy Policy, Terms, About sections via Policies screen

## Tech stack
- Expo + React Native + Expo Router
- Supabase JS client (`lib/supabase.js`)
- React Native Chart Kit for visual analytics

## Run
1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Add your Supabase URL and anon key.
3. Install and run:
   ```bash
   npm install
   npm run web
   ```

## Next step suggestions
- Add Supabase schema: `products`, `categories`, `sales`, `invoices`, `stock_movements`.
- Implement role-based auth (admin/staff).
- Add PDF invoice export and cloud backup snapshots.
