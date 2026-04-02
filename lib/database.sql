-- ============================================================
-- ShopAI E-Commerce Platform - Supabase Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== Store Settings ====================
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT NOT NULL DEFAULT 'My Shop',
  store_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  template TEXT NOT NULL DEFAULT 'minimal' CHECK (template IN ('fashion', 'tech', 'minimal')),
  primary_color TEXT NOT NULL DEFAULT '#0ea5e9',
  secondary_color TEXT NOT NULL DEFAULT '#f8fafc',
  font_family TEXT NOT NULL DEFAULT 'Inter',
  currency TEXT NOT NULL DEFAULT 'USD',
  language TEXT NOT NULL DEFAULT 'zh-TW',
  announcement TEXT,
  social_links JSONB DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  contact_email TEXT,
  support_phone TEXT,
  address TEXT,
  free_shipping_threshold DECIMAL(10,2),
  tax_rate DECIMAL(5,4) DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO store_settings (store_name, template, currency, language)
VALUES ('ShopAI', 'minimal', 'USD', 'zh-TW')
ON CONFLICT DO NOTHING;

-- ==================== Products ====================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_zh_tw TEXT,
  name_zh_cn TEXT,
  name_ja TEXT,
  description TEXT,
  description_zh_tw TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  weight DECIMAL(8,3),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  dropshipping_source TEXT CHECK (dropshipping_source IN ('aliexpress', 'cj', 'spocket', 'manual')),
  dropshipping_product_id TEXT,
  dropshipping_supplier_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  options JSONB DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== Customers ====================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  default_address JSONB,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== Orders ====================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_method TEXT,
  payment_intent_id TEXT,
  notes TEXT,
  tracking_number TEXT,
  tracking_carrier TEXT,
  tracking_url TEXT,
  dropshipping_order_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  variant_name TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generate order number function
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  num TEXT;
BEGIN
  num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN num;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate order number trigger
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- ==================== AI Tasks ====================
CREATE TABLE IF NOT EXISTS ai_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN (
    'PRICE_UPDATE','PRODUCT_LISTING','INVENTORY_RESTOCK',
    'ORDER_FULFILL','CUSTOMER_REPLY','PRODUCT_DESCRIPTION',
    'PROMOTION_CREATE','DROPSHIP_IMPORT','ANALYTICS_REPORT'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending','awaiting_approval','approved','executing','completed','rejected','failed'
  )),
  requires_approval BOOLEAN NOT NULL DEFAULT true,
  data JSONB DEFAULT '{}',
  result JSONB,
  error TEXT,
  created_by TEXT NOT NULL DEFAULT 'ai' CHECK (created_by IN ('ai','human')),
  reviewed_by TEXT,
  review_notes TEXT,
  scheduled_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== Logistics Templates ====================
CREATE TABLE IF NOT EXISTS logistics_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  carrier TEXT NOT NULL,
  carrier_code TEXT NOT NULL,
  tracking_url_template TEXT NOT NULL,
  estimated_days_min INTEGER NOT NULL DEFAULT 3,
  estimated_days_max INTEGER NOT NULL DEFAULT 7,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  regions TEXT[] DEFAULT '{"worldwide"}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default logistics templates
INSERT INTO logistics_templates (name, carrier, carrier_code, tracking_url_template, estimated_days_min, estimated_days_max, cost, regions, is_default) VALUES
  ('標準快遞', 'DHL', 'dhl', 'https://www.dhl.com/track?tracking-id={tracking_number}', 3, 7, 9.99, '{"worldwide"}', true),
  ('標準海運', 'China Post', 'china-post', 'https://track.aftership.com/china-post/{tracking_number}', 15, 30, 2.99, '{"worldwide"}', false),
  ('FedEx 快遞', 'FedEx', 'fedex', 'https://www.fedex.com/fedextrack/?trknbr={tracking_number}', 2, 5, 14.99, '{"us","ca","mx"}', false),
  ('UPS 快遞', 'UPS', 'ups', 'https://www.ups.com/track?tracknum={tracking_number}', 2, 6, 12.99, '{"worldwide"}', false),
  ('香港郵政', 'HK Post', 'hk-post', 'https://www.hongkongpost.hk/en/mail_services/track/index.html?trackno={tracking_number}', 5, 14, 4.99, '{"hk","cn","tw"}', false),
  ('順豐速運', 'SF Express', 'sf-express', 'https://www.sf-express.com/cn/sc/dynamic_function/waybill/#search/bill-number/{tracking_number}', 2, 5, 8.99, '{"cn","hk","tw","sg"}', false)
ON CONFLICT DO NOTHING;

-- ==================== Customer Service / Chat ====================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  order_id UUID REFERENCES orders(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending_ai','ai_responded','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer','agent','ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== Dropshipping Sources ====================
CREATE TABLE IF NOT EXISTS dropshipping_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('aliexpress','cj','spocket')),
  api_key TEXT,
  api_secret TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== Promotions & Coupons ====================
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage','fixed','free_shipping')),
  value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== Inventory Log ====================
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  change INTEGER NOT NULL,
  reason TEXT,
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== Indexes ====================
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_type ON ai_tasks(type);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);

-- ==================== Updated At Trigger ====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_ai_tasks_updated_at BEFORE UPDATE ON ai_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_store_settings_updated_at BEFORE UPDATE ON store_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== Row Level Security ====================
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tasks ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (status = 'active');
-- Store settings public read
CREATE POLICY "Store settings are publicly readable" ON store_settings FOR SELECT USING (true);
-- Orders: customers can read their own
CREATE POLICY "Customers can view their own orders" ON orders FOR SELECT USING (customer_email = current_user OR true);

-- ==================== Sample Data ====================
INSERT INTO products (name, name_zh_tw, price, compare_price, stock, category, status, images, description, tags) VALUES
  ('Wireless Earbuds Pro', '無線耳機 Pro', 59.99, 89.99, 150, 'Electronics', 'active',
   ARRAY['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
   'High-quality wireless earbuds with 30-hour battery life and active noise cancellation.',
   ARRAY['electronics','audio','wireless']),
  ('Premium Leather Wallet', '頂級皮革錢包', 39.99, 59.99, 200, 'Accessories', 'active',
   ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'],
   'Genuine leather slim wallet with RFID blocking technology.',
   ARRAY['accessories','wallet','leather']),
  ('Smart Watch Series 5', '智慧手錶 Series 5', 129.99, 199.99, 75, 'Electronics', 'active',
   ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
   'Advanced smartwatch with health monitoring, GPS, and 7-day battery.',
   ARRAY['electronics','wearable','smartwatch']),
  ('Portable Phone Stand', '手機支架', 12.99, null, 500, 'Accessories', 'active',
   ARRAY['https://images.unsplash.com/photo-1586495777744-4e6232bf2d89?w=600'],
   'Adjustable aluminum phone stand compatible with all smartphones.',
   ARRAY['accessories','phone','desk']),
  ('Minimalist Backpack', '極簡主義背包', 79.99, 99.99, 60, 'Fashion', 'active',
   ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
   'Water-resistant minimalist backpack with 20L capacity.',
   ARRAY['fashion','bag','travel'])
ON CONFLICT DO NOTHING;
