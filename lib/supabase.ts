import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const createClient = () => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
    return null;
  }
  return createClientComponentClient();
};

// Mock data for development when Supabase is not configured
export const mockVisitors: Visitor[] = [
  {
    id: '1',
    name: 'Max Mustermann',
    company: 'Beispiel GmbH',
    purpose: 'Geschäftstermin',
    host: 'Anna Schmidt',
    start_time: new Date().toISOString(),
    end_time: null,
    is_active: true,
    badge_number: 'B001',
    notes: 'VIP Gast',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Lisa Weber',
    company: 'Tech Solutions',
    purpose: 'Projektbesprechung',
    host: 'Thomas Müller',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: null,
    is_active: true,
    badge_number: 'B002',
    notes: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockSlideshowItems: SlideshowItem[] = [
  {
    id: '1',
    title: 'Willkommen bei Vitasco',
    content: 'Herzlich willkommen in unserem Unternehmen. Bitte melden Sie sich am Empfang an.',
    image_url: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    display_time: 8,
    is_active: true,
    order: 1,
    background_color: '#1e40af',
    text_color: '#ffffff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Moderne Technologie',
    content: 'Wir setzen auf innovative Lösungen und modernste Technologie für unsere Kunden.',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    display_time: 6,
    is_active: true,
    order: 2,
    background_color: '#3b82f6',
    text_color: '#ffffff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Unser Team',
    content: 'Erfahrene Experten arbeiten täglich daran, die besten Ergebnisse zu erzielen.',
    image_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    display_time: 7,
    is_active: true,
    order: 3,
    background_color: '#6366f1',
    text_color: '#ffffff',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockSystemSettings: SystemSettings = {
  id: '1',
  site_name: 'Vitasco Besucherverwaltung',
  logo_url: null,
  company_name: 'Vitasco GmbH',
  language: 'de',
  timezone: 'Europe/Berlin',
  slideshow_interval: 10,
  auto_checkout_time: 18,
  max_upload_size: 20,
  tablet_display_mode: 'auto',
  visitor_display_limit: 10,
  enable_notifications: true,
  enable_auto_checkout: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Database types based on existing migration
export interface Visitor {
  id: string;
  name: string;
  company?: string;
  purpose?: string;
  host?: string;
  start_time: string;
  end_time?: string;
  is_active: boolean;
  badge_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SlideshowItem {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  display_time: number;
  is_active: boolean;
  order: number;
  background_color: string;
  text_color: string;
  created_at: string;
  updated_at: string;
}

export interface LayoutConfig {
  id: string;
  name: string;
  header_enabled: boolean;
  header_text: string;
  header_color: string;
  header_text_color: string;
  footer_enabled: boolean;
  footer_text: string;
  footer_color: string;
  footer_text_color: string;
  background_color: string;
  background_image_url?: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemSettings {
  id: string;
  site_name: string;
  logo_url?: string;
  company_name: string;
  language: string;
  timezone: string;
  slideshow_interval: number;
  auto_checkout_time: number;
  max_upload_size: number;
  tablet_display_mode: string;
  visitor_display_limit: number;
  enable_notifications: boolean;
  enable_auto_checkout: boolean;
  created_at: string;
  updated_at: string;
}