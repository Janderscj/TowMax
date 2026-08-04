-- Enable Row Level Security (RLS) on all tables
-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('free', 'premium', 'dealer')) DEFAULT 'free',
  garage_limit INTEGER,
  can_replace_free_vehicle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Garage table
CREATE TABLE garage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vin TEXT NOT NULL,
  year INTEGER,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Towing configuration dataset table
CREATE TABLE towing_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source_brand TEXT NOT NULL,
  source_file TEXT,
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  series TEXT,
  trim TEXT,
  engine TEXT,
  drive_type TEXT,
  cab_type TEXT,
  bed TEXT,
  axle_ratio TEXT,
  tow_package TEXT,
  gcwr INTEGER,
  payload INTEGER,
  max_tow INTEGER,
  raw_entry JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  config_key TEXT GENERATED ALWAYS AS (
    lower(coalesce(source_brand, '')) || '|' ||
    coalesce(year::text, '') || '|' ||
    lower(coalesce(make, '')) || '|' ||
    lower(coalesce(model, '')) || '|' ||
    lower(coalesce(series, '')) || '|' ||
    lower(coalesce(trim, '')) || '|' ||
    lower(coalesce(engine, '')) || '|' ||
    lower(coalesce(drive_type, '')) || '|' ||
    lower(coalesce(cab_type, '')) || '|' ||
    lower(coalesce(bed, '')) || '|' ||
    lower(coalesce(axle_ratio, '')) || '|' ||
    lower(coalesce(tow_package, ''))
  ) STORED,
  UNIQUE(config_key)
);

CREATE INDEX idx_towing_configs_brand_year_make_model
  ON towing_configs(source_brand, year, make, model);

CREATE INDEX idx_towing_configs_refine_fields
  ON towing_configs(source_brand, bed, axle_ratio, tow_package);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE garage ENABLE ROW LEVEL SECURITY;
ALTER TABLE towing_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for garage
CREATE POLICY "Users can view their own garage" ON garage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own garage" ON garage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own garage" ON garage
  FOR DELETE USING (auth.uid() = user_id);

-- Allow authenticated users to read towing data if needed by future clients.
CREATE POLICY "Authenticated users can read towing configs" ON towing_configs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, garage_limit, can_replace_free_vehicle)
  VALUES (NEW.id, 'free', 1, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for towing_configs updated_at
CREATE TRIGGER update_towing_configs_updated_at
  BEFORE UPDATE ON towing_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();