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

## Supabase implementation status
The Supabase schema and backend foundations now include:

- ✅ `categories`
- ✅ `products`
- ✅ `sales`
- ✅ `invoices`
- ✅ `stock_movements`
- ✅ Role-based access model (`admin`, `staff`) through `profiles`, trigger-managed profile creation, and row-level-security policies.
- ✅ Invoice support fields for PDF export metadata (`pdf_url`) and backup snapshot metadata (`backup_snapshot_url`).

See `supabase/seed.sql` for the full table, policy, trigger, and seed definitions.

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

## Notes for PDF export and cloud backups
- `invoices.pdf_url` is intended to store the file URL/path of exported PDF invoices in Supabase Storage (or another object store).
- `invoices.backup_snapshot_url` is intended to store backup snapshot artifact references.
- To complete the app flow end-to-end, wire the UI actions in `app/invoices.js` and `app/backup.js` to upload files and persist these URLs.
