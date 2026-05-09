-- Supabase seed script: creates collections (tables) and fills each with 10–15 dummy records.

create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  sku text unique not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  order_no text unique not null,
  status text not null check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- 10 category entries
insert into categories (slug, name)
values
  ('electronics', 'Electronics'),
  ('fashion', 'Fashion'),
  ('beauty', 'Beauty'),
  ('home-kitchen', 'Home & Kitchen'),
  ('books', 'Books'),
  ('sports', 'Sports'),
  ('toys', 'Toys'),
  ('grocery', 'Grocery'),
  ('office', 'Office Supplies'),
  ('pet-care', 'Pet Care')
on conflict (slug) do nothing;

-- 12 customer entries
insert into customers (full_name, email, phone)
values
  ('Ava Thompson', 'ava.thompson@example.com', '+1-555-1001'),
  ('Liam Carter', 'liam.carter@example.com', '+1-555-1002'),
  ('Noah Bennett', 'noah.bennett@example.com', '+1-555-1003'),
  ('Emma Collins', 'emma.collins@example.com', '+1-555-1004'),
  ('Olivia Reed', 'olivia.reed@example.com', '+1-555-1005'),
  ('Ethan Brooks', 'ethan.brooks@example.com', '+1-555-1006'),
  ('Sophia Perry', 'sophia.perry@example.com', '+1-555-1007'),
  ('Mason Ward', 'mason.ward@example.com', '+1-555-1008'),
  ('Isabella Hayes', 'isabella.hayes@example.com', '+1-555-1009'),
  ('James Kelly', 'james.kelly@example.com', '+1-555-1010'),
  ('Mia Foster', 'mia.foster@example.com', '+1-555-1011'),
  ('Benjamin Price', 'benjamin.price@example.com', '+1-555-1012')
on conflict (email) do nothing;

-- 15 product entries
insert into products (category_id, sku, name, description, price, stock)
select c.id, v.sku, v.name, v.description, v.price, v.stock
from (values
  ('electronics', 'SKU-EL-001', 'Wireless Earbuds', 'Bluetooth 5.3 noise-cancelling earbuds', 79.99, 120),
  ('electronics', 'SKU-EL-002', 'Smart Watch', 'Fitness and heart-rate tracking smartwatch', 129.00, 80),
  ('fashion', 'SKU-FA-001', 'Classic Denim Jacket', 'Unisex blue denim jacket', 64.50, 45),
  ('beauty', 'SKU-BE-001', 'Vitamin C Serum', '30ml brightening face serum', 24.99, 150),
  ('home-kitchen', 'SKU-HK-001', 'Air Fryer 5L', 'Digital low-oil air fryer', 99.90, 35),
  ('books', 'SKU-BO-001', 'Atomic Habits', 'Best-selling self-improvement book', 18.99, 200),
  ('sports', 'SKU-SP-001', 'Yoga Mat Pro', 'Non-slip 6mm yoga mat', 34.95, 90),
  ('toys', 'SKU-TO-001', 'Building Blocks Set', '120-piece creative block kit', 29.99, 70),
  ('grocery', 'SKU-GR-001', 'Organic Coffee Beans', '1kg medium roast coffee', 21.49, 110),
  ('office', 'SKU-OF-001', 'Ergonomic Office Chair', 'Adjustable lumbar support chair', 189.99, 25),
  ('pet-care', 'SKU-PC-001', 'Dog Chew Toys Pack', 'Durable 5-piece toy set', 16.75, 140),
  ('electronics', 'SKU-EL-003', 'Portable Power Bank', '20,000mAh fast-charging battery', 45.00, 95),
  ('home-kitchen', 'SKU-HK-002', 'Stainless Cookware Set', '10-piece induction-ready set', 149.00, 30),
  ('fashion', 'SKU-FA-002', 'Running Sneakers', 'Lightweight everyday sneakers', 72.00, 60),
  ('books', 'SKU-BO-002', 'Deep Work', 'Productivity and focus guide', 17.50, 130)
) as v(category_slug, sku, name, description, price, stock)
join categories c on c.slug = v.category_slug
on conflict (sku) do nothing;

-- 12 order entries
insert into orders (customer_id, order_no, status, total_amount)
select cu.id,
       format('ORD-2026-%s', lpad(gs::text, 4, '0')) as order_no,
       (array['pending','paid','shipped','delivered','cancelled'])[1 + (gs % 5)] as status,
       round((25 + random() * 375)::numeric, 2) as total_amount
from generate_series(1, 12) gs
join lateral (
  select id
  from customers
  order by random()
  limit 1
) cu on true
on conflict (order_no) do nothing;
