-- CatalogKaro database schema
-- Paste this entire SQL into your Supabase Dashboard -> SQL Editor and click "Run".
-- It creates 2 tables: businesses and products, along with security rules (RLS).

-- 1. BUSINESSES table (one row per business owner)
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null,
  slug text unique not null,
  logo_url text,
  whatsapp_number text,
  address text,
  lat double precision,
  lng double precision,
  is_paid boolean default false,
  created_at timestamptz default now()
);

-- 2. PRODUCTS table (each item in a business's catalog)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  price numeric,
  description text,
  photo_url text,
  category text default 'General',
  created_at timestamptz default now()
);

-- Indexes so the public catalog page loads fast
create index if not exists idx_products_business_id on products(business_id);
create index if not exists idx_businesses_slug on businesses(slug);

-- 3. Turn on Row Level Security (important - otherwise everyone's data
--    would be visible to everyone)
alter table businesses enable row level security;
alter table products enable row level security;

-- ---- BUSINESSES policies ----

-- Anyone (even logged out) can view a business's public data, for the catalog page
create policy "Public can view businesses"
  on businesses for select
  using (true);

-- Only the owner can create their own business
create policy "Owner can insert own business"
  on businesses for insert
  with check (auth.uid() = user_id);

-- Only the owner can edit their own business
create policy "Owner can update own business"
  on businesses for update
  using (auth.uid() = user_id);

-- Only the owner can delete their own business
create policy "Owner can delete own business"
  on businesses for delete
  using (auth.uid() = user_id);

-- ---- PRODUCTS policies ----

-- Anyone can view products (the catalog page is public)
create policy "Public can view products"
  on products for select
  using (true);

-- Only a business's owner can add their own products
create policy "Owner can insert own products"
  on products for insert
  with check (
    exists (
      select 1 from businesses
      where businesses.id = products.business_id
      and businesses.user_id = auth.uid()
    )
  );

-- Only a business's owner can edit their own products
create policy "Owner can update own products"
  on products for update
  using (
    exists (
      select 1 from businesses
      where businesses.id = products.business_id
      and businesses.user_id = auth.uid()
    )
  );

-- Only a business's owner can delete their own products
create policy "Owner can delete own products"
  on products for delete
  using (
    exists (
      select 1 from businesses
      where businesses.id = products.business_id
      and businesses.user_id = auth.uid()
    )
  );
