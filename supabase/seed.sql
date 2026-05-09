-- Supabase bootstrap script for RetailFlow
-- Creates core tables, role-based auth helpers, and seed data.

create extension if not exists pgcrypto;

-- =========================
-- Auth / RBAC
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'staff')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'staff');
$$;

-- =========================
-- Domain tables
-- =========================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  sku text unique not null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  sale_no text unique not null,
  sold_by uuid references public.profiles(id) on delete set null,
  sold_at timestamptz not null default now(),
  total_amount numeric(10,2) not null check (total_amount >= 0),
  payment_method text not null default 'cash' check (payment_method in ('cash', 'card', 'transfer', 'wallet')),
  notes text
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_no text unique not null,
  sale_id uuid references public.sales(id) on delete set null,
  issued_at timestamptz not null default now(),
  due_at timestamptz,
  status text not null default 'issued' check (status in ('draft', 'issued', 'paid', 'void')),
  total_amount numeric(10,2) not null check (total_amount >= 0),
  pdf_url text,
  backup_snapshot_url text
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  movement_type text not null check (movement_type in ('in', 'out', 'adjustment')),
  quantity integer not null,
  reason text,
  reference_type text check (reference_type in ('sale', 'purchase', 'manual')),
  reference_id uuid,
  moved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- =========================
-- RLS
-- =========================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.invoices enable row level security;
alter table public.stock_movements enable row level security;

-- read access for authenticated users
create policy if not exists "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.current_user_role() = 'admin');

create policy if not exists "categories_read_all" on public.categories
for select to authenticated using (true);
create policy if not exists "products_read_all" on public.products
for select to authenticated using (true);
create policy if not exists "sales_read_all" on public.sales
for select to authenticated using (true);
create policy if not exists "invoices_read_all" on public.invoices
for select to authenticated using (true);
create policy if not exists "stock_read_all" on public.stock_movements
for select to authenticated using (true);

-- write access: admin full, staff limited operational writes
create policy if not exists "categories_admin_write" on public.categories
for all to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy if not exists "products_admin_write" on public.products
for all to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy if not exists "sales_staff_insert" on public.sales
for insert to authenticated with check (public.current_user_role() in ('admin', 'staff'));
create policy if not exists "sales_admin_update_delete" on public.sales
for update to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy if not exists "sales_admin_delete" on public.sales
for delete to authenticated using (public.current_user_role() = 'admin');

create policy if not exists "invoices_staff_insert_update" on public.invoices
for insert to authenticated with check (public.current_user_role() in ('admin', 'staff'));
create policy if not exists "invoices_staff_update" on public.invoices
for update to authenticated using (public.current_user_role() in ('admin', 'staff')) with check (public.current_user_role() in ('admin', 'staff'));
create policy if not exists "invoices_admin_delete" on public.invoices
for delete to authenticated using (public.current_user_role() = 'admin');

create policy if not exists "stock_staff_insert" on public.stock_movements
for insert to authenticated with check (public.current_user_role() in ('admin', 'staff'));
create policy if not exists "stock_admin_modify" on public.stock_movements
for update to authenticated using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy if not exists "stock_admin_delete" on public.stock_movements
for delete to authenticated using (public.current_user_role() = 'admin');

-- =========================
-- Seeds
-- =========================
insert into public.categories (slug, name)
values
  ('electronics', 'Electronics'),
  ('fashion', 'Fashion'),
  ('beauty', 'Beauty'),
  ('home-kitchen', 'Home & Kitchen'),
  ('books', 'Books')
on conflict (slug) do nothing;

insert into public.products (category_id, sku, name, description, price, stock)
select c.id, v.sku, v.name, v.description, v.price, v.stock
from (values
  ('electronics', 'SKU-EL-001', 'Wireless Earbuds', 'Bluetooth 5.3 noise-cancelling earbuds', 79.99, 120),
  ('electronics', 'SKU-EL-002', 'Smart Watch', 'Fitness and heart-rate tracking smartwatch', 129.00, 80),
  ('fashion', 'SKU-FA-001', 'Classic Denim Jacket', 'Unisex blue denim jacket', 64.50, 45),
  ('beauty', 'SKU-BE-001', 'Vitamin C Serum', '30ml brightening face serum', 24.99, 150),
  ('books', 'SKU-BO-001', 'Atomic Habits', 'Best-selling self-improvement book', 18.99, 200)
) as v(category_slug, sku, name, description, price, stock)
join public.categories c on c.slug = v.category_slug
on conflict (sku) do nothing;
