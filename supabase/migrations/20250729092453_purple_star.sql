/*
  # Vitasco Besucherverwaltung Schema

  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `company` (text, optional)
      - `purpose` (text, optional)
      - `host` (text, optional)
      - `start_time` (timestamptz, default now)
      - `end_time` (timestamptz, optional)
      - `is_active` (boolean, default true)
      - `badge_number` (text, optional)
      - `notes` (text, optional)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

    - `slideshow_items`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, optional)
      - `image_url` (text, optional)
      - `display_time` (integer, default 5)
      - `is_active` (boolean, default true)
      - `order` (integer, default 0)
      - `background_color` (text, default '#ffffff')
      - `text_color` (text, default '#000000')
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

    - `layout_configs`
      - `id` (uuid, primary key)
      - `name` (text, unique, required)
      - `header_enabled` (boolean, default true)
      - `header_text` (text, default 'Vitasco Besucherverwaltung')
      - `header_color` (text, default '#1e40af')
      - `header_text_color` (text, default '#ffffff')
      - `footer_enabled` (boolean, default true)
      - `footer_text` (text, default 'Willkommen bei Vitasco')
      - `footer_color` (text, default '#1e40af')
      - `footer_text_color` (text, default '#ffffff')
      - `background_color` (text, default '#f8fafc')
      - `background_image_url` (text, optional)
      - `primary_color` (text, default '#1e40af')
      - `secondary_color` (text, default '#64748b')
      - `text_color` (text, default '#0f172a')
      - `is_active` (boolean, default false)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

    - `system_settings`
      - `id` (uuid, primary key)
      - `site_name` (text, default 'Vitasco Besucherverwaltung')
      - `logo_url` (text, optional)
      - `company_name` (text, default 'Vitasco GmbH')
      - `language` (text, default 'de')
      - `timezone` (text, default 'Europe/Berlin')
      - `slideshow_interval` (integer, default 10)
      - `auto_checkout_time` (integer, default 18)
      - `max_upload_size` (integer, default 20)
      - `tablet_display_mode` (text, default 'auto')
      - `visitor_display_limit` (integer, default 10)
      - `enable_notifications` (boolean, default true)
      - `enable_auto_checkout` (boolean, default true)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage all data
    - Public read access for visitors table (for tablet display)
    - Public read access for slideshow_items and system_settings
*/

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  purpose text,
  host text,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  is_active boolean DEFAULT true,
  badge_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create slideshow_items table
CREATE TABLE IF NOT EXISTS slideshow_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  image_url text,
  display_time integer DEFAULT 5,
  is_active boolean DEFAULT true,
  "order" integer DEFAULT 0,
  background_color text DEFAULT '#ffffff',
  text_color text DEFAULT '#000000',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create layout_configs table
CREATE TABLE IF NOT EXISTS layout_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  header_enabled boolean DEFAULT true,
  header_text text DEFAULT 'Vitasco Besucherverwaltung',
  header_color text DEFAULT '#1e40af',
  header_text_color text DEFAULT '#ffffff',
  footer_enabled boolean DEFAULT true,
  footer_text text DEFAULT 'Willkommen bei Vitasco',
  footer_color text DEFAULT '#1e40af',
  footer_text_color text DEFAULT '#ffffff',
  background_color text DEFAULT '#f8fafc',
  background_image_url text,
  primary_color text DEFAULT '#1e40af',
  secondary_color text DEFAULT '#64748b',
  text_color text DEFAULT '#0f172a',
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text DEFAULT 'Vitasco Besucherverwaltung',
  logo_url text,
  company_name text DEFAULT 'Vitasco GmbH',
  language text DEFAULT 'de',
  timezone text DEFAULT 'Europe/Berlin',
  slideshow_interval integer DEFAULT 10,
  auto_checkout_time integer DEFAULT 18,
  max_upload_size integer DEFAULT 20,
  tablet_display_mode text DEFAULT 'auto',
  visitor_display_limit integer DEFAULT 10,
  enable_notifications boolean DEFAULT true,
  enable_auto_checkout boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_visitors_start_time ON visitors(start_time);
CREATE INDEX IF NOT EXISTS idx_visitors_is_active ON visitors(is_active);
CREATE INDEX IF NOT EXISTS idx_slideshow_items_order_active ON slideshow_items("order", is_active);

-- Enable Row Level Security
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE slideshow_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE layout_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for visitors table
CREATE POLICY "Anyone can read active visitors"
  ON visitors
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can insert visitors"
  ON visitors
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update visitors"
  ON visitors
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete visitors"
  ON visitors
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for slideshow_items table
CREATE POLICY "Anyone can read active slideshow items"
  ON slideshow_items
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage slideshow items"
  ON slideshow_items
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for layout_configs table
CREATE POLICY "Anyone can read active layout configs"
  ON layout_configs
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage layout configs"
  ON layout_configs
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for system_settings table
CREATE POLICY "Anyone can read system settings"
  ON system_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default data
INSERT INTO system_settings (
  site_name,
  company_name,
  language,
  timezone,
  slideshow_interval,
  auto_checkout_time,
  max_upload_size,
  tablet_display_mode,
  visitor_display_limit,
  enable_notifications,
  enable_auto_checkout
) VALUES (
  'Vitasco Besucherverwaltung',
  'Vitasco GmbH',
  'de',
  'Europe/Berlin',
  10,
  18,
  20,
  'auto',
  10,
  true,
  true
) ON CONFLICT DO NOTHING;

-- Insert default slideshow items
INSERT INTO slideshow_items (title, content, display_time, is_active, "order", background_color, text_color) VALUES
('Willkommen bei Vitasco', 'Herzlich willkommen in unserem Unternehmen. Bitte melden Sie sich am Empfang an.', 8, true, 1, '#1e40af', '#ffffff'),
('Moderne Technologie', 'Wir setzen auf innovative Lösungen und modernste Technologie für unsere Kunden.', 6, true, 2, '#3b82f6', '#ffffff'),
('Unser Team', 'Erfahrene Experten arbeiten täglich daran, die besten Ergebnisse zu erzielen.', 7, true, 3, '#6366f1', '#ffffff')
ON CONFLICT DO NOTHING;

-- Insert default layout config
INSERT INTO layout_configs (
  name,
  header_enabled,
  header_text,
  header_color,
  header_text_color,
  footer_enabled,
  footer_text,
  footer_color,
  footer_text_color,
  background_color,
  primary_color,
  secondary_color,
  text_color,
  is_active
) VALUES (
  'Standard Layout',
  true,
  'Vitasco Besucherverwaltung',
  '#1e40af',
  '#ffffff',
  true,
  'Willkommen bei Vitasco GmbH',
  '#1e40af',
  '#ffffff',
  '#f8fafc',
  '#1e40af',
  '#64748b',
  '#0f172a',
  true
) ON CONFLICT DO NOTHING;