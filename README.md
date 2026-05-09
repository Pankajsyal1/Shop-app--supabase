# Shop Pro (Expo + Supabase)

A cross-platform **web + mobile** shop management app starter built with React Native Expo and Supabase.

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
