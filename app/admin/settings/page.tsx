'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Settings, 
  Building2, 
  Globe, 
  Clock, 
  Bell, 
  Shield,
  Save,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import type { SystemSettings } from '@/lib/supabase';
import { AdminNavigation } from '@/components/admin-navigation';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase!
        .from('system_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const defaultSettings = {
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
          enable_auto_checkout: true
        };
        
        const { data: newSettings, error: createError } = await supabase!
          .from('system_settings')
          .insert([defaultSettings])
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Fehler beim Laden der Einstellungen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const { error } = await supabase!
        .from('system_settings')
        .update({
          site_name: settings.site_name,
          logo_url: settings.logo_url,
          company_name: settings.company_name,
          language: settings.language,
          timezone: settings.timezone,
          slideshow_interval: settings.slideshow_interval,
          auto_checkout_time: settings.auto_checkout_time,
          max_upload_size: settings.max_upload_size,
          tablet_display_mode: settings.tablet_display_mode,
          visitor_display_limit: settings.visitor_display_limit,
          enable_notifications: settings.enable_notifications,
          enable_auto_checkout: settings.enable_auto_checkout,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;
      toast.success('Einstellungen erfolgreich gespeichert');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (field: keyof SystemSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vitasco-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Einstellungen werden geladen...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Einstellungen nicht gefunden</h3>
          <p className="text-gray-600">Es konnten keine Systemeinstellungen geladen werden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Systemeinstellungen</h1>
            <p className="text-gray-600 mt-2">Konfigurieren Sie die globalen Einstellungen der Anwendung</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="vitasco-button">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Speichert...' : 'Speichern'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div className="space-y-6">
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Allgemeine Einstellungen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Website-Name</label>
                  <Input
                    value={settings.site_name}
                    onChange={(e) => updateSetting('site_name', e.target.value)}
                    placeholder="Vitasco Besucherverwaltung"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Firmenname</label>
                  <Input
                    value={settings.company_name}
                    onChange={(e) => updateSetting('company_name', e.target.value)}
                    placeholder="Vitasco GmbH"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Logo-URL</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={settings.logo_url || ''}
                      onChange={(e) => updateSetting('logo_url', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {settings.logo_url && (
                    <div className="mt-2">
                      <img 
                        src={settings.logo_url} 
                        alt="Logo Preview" 
                        className="h-12 w-auto border rounded"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Lokalisierung</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sprache</label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zeitzone</label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>Slideshow-Einstellungen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Slide-Intervall (Sekunden)
                  </label>
                  <Input
                    type="number"
                    value={settings.slideshow_interval}
                    onChange={(e) => updateSetting('slideshow_interval', parseInt(e.target.value))}
                    min="3"
                    max="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Zeit zwischen automatischen Slide-Wechseln
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Display-Modus</label>
                  <Select 
                    value={settings.tablet_display_mode} 
                    onValueChange={(value) => updateSetting('tablet_display_mode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatisch</SelectItem>
                      <SelectItem value="slideshow">Nur Slideshow</SelectItem>
                      <SelectItem value="visitors">Nur Besucher</SelectItem>
                      <SelectItem value="split">Geteilte Ansicht</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-6">
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Zeitgesteuerte Funktionen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Automatische Abmeldung</label>
                    <p className="text-xs text-gray-500">
                      Besucher automatisch um eine bestimmte Uhrzeit abmelden
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_auto_checkout}
                    onCheckedChange={(checked) => updateSetting('enable_auto_checkout', checked)}
                  />
                </div>

                {settings.enable_auto_checkout && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Abmelde-Zeit (Stunde)
                    </label>
                    <Input
                      type="number"
                      value={settings.auto_checkout_time}
                      onChange={(e) => updateSetting('auto_checkout_time', parseInt(e.target.value))}
                      min="0"
                      max="23"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Alle aktiven Besucher werden um {settings.auto_checkout_time}:00 Uhr abgemeldet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Benachrichtigungen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Benachrichtigungen aktivieren</label>
                    <p className="text-xs text-gray-500">
                      E-Mail-Benachrichtigungen für neue Besucher
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_notifications}
                    onCheckedChange={(checked) => updateSetting('enable_notifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Sicherheit & Limits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Maximale Upload-Größe (MB)
                  </label>
                  <Input
                    type="number"
                    value={settings.max_upload_size}
                    onChange={(e) => updateSetting('max_upload_size', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Besucher-Anzeige-Limit
                  </label>
                  <Input
                    type="number"
                    value={settings.visitor_display_limit}
                    onChange={(e) => updateSetting('visitor_display_limit', parseInt(e.target.value))}
                    min="5"
                    max="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximale Anzahl Besucher in der Tablet-Anzeige
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System-Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-mono">1.0.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Erstellt:</span>
                  <span>{new Date(settings.created_at).toLocaleDateString('de-DE')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Letzte Änderung:</span>
                  <span>{new Date(settings.updated_at).toLocaleDateString('de-DE')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}