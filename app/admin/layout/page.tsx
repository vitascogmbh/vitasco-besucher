'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Layout, 
  Palette, 
  Type, 
  Image, 
  Save,
  Eye,
  Monitor,
  Smartphone
} from 'lucide-react';
import type { LayoutConfig } from '@/lib/supabase';
import { AdminNavigation } from '@/components/admin-navigation';

export default function LayoutManagerPage() {
  const [layout, setLayout] = useState<LayoutConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const supabase = createClient();

  useEffect(() => {
    loadLayout();
  }, []);

  const loadLayout = async () => {
    try {
      const { data, error } = await supabase!
        .from('layout_configs')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setLayout(data);
      } else {
        // Create default layout if none exists
        const defaultLayout = {
          name: 'Standard Layout',
          header_enabled: true,
          header_text: 'Vitasco Besucherverwaltung',
          header_color: '#1e40af',
          header_text_color: '#ffffff',
          footer_enabled: true,
          footer_text: 'Willkommen bei Vitasco GmbH',
          footer_color: '#1e40af',
          footer_text_color: '#ffffff',
          background_color: '#f8fafc',
          background_image_url: '',
          primary_color: '#1e40af',
          secondary_color: '#64748b',
          text_color: '#0f172a',
          is_active: true
        };
        
        const { data: newLayout, error: createError } = await supabase!
          .from('layout_configs')
          .insert([defaultLayout])
          .select()
          .single();

        if (createError) throw createError;
        setLayout(newLayout);
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      toast.error('Fehler beim Laden des Layouts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!layout) return;

    setIsSaving(true);
    try {
      const { error } = await supabase!
        .from('layout_configs')
        .update({
          header_enabled: layout.header_enabled,
          header_text: layout.header_text,
          header_color: layout.header_color,
          header_text_color: layout.header_text_color,
          footer_enabled: layout.footer_enabled,
          footer_text: layout.footer_text,
          footer_color: layout.footer_color,
          footer_text_color: layout.footer_text_color,
          background_color: layout.background_color,
          background_image_url: layout.background_image_url,
          primary_color: layout.primary_color,
          secondary_color: layout.secondary_color,
          text_color: layout.text_color,
          updated_at: new Date().toISOString()
        })
        .eq('id', layout.id);

      if (error) throw error;
      toast.success('Layout erfolgreich gespeichert');
    } catch (error) {
      console.error('Error saving layout:', error);
      toast.error('Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  const updateLayout = (field: keyof LayoutConfig, value: any) => {
    if (!layout) return;
    setLayout({ ...layout, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vitasco-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Layout wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!layout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Layout className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Layout nicht gefunden</h3>
          <p className="text-gray-600">Es konnte kein Layout geladen werden.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Layout-Manager</h1>
            <p className="text-gray-600 mt-2">Passen Sie das Erscheinungsbild der Anwendung an</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Layout className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="vitasco-button">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Speichert...' : 'Speichern'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Header Settings */}
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="h-5 w-5" />
                  <span>Header-Einstellungen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Header aktivieren</label>
                  <Switch
                    checked={layout.header_enabled}
                    onCheckedChange={(checked) => updateLayout('header_enabled', checked)}
                  />
                </div>
                
                {layout.header_enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Header-Text</label>
                      <Input
                        value={layout.header_text}
                        onChange={(e) => updateLayout('header_text', e.target.value)}
                        placeholder="Header-Text"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Hintergrundfarbe</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={layout.header_color}
                            onChange={(e) => updateLayout('header_color', e.target.value)}
                            className="w-12 h-10 rounded border"
                          />
                          <Input
                            value={layout.header_color}
                            onChange={(e) => updateLayout('header_color', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Textfarbe</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={layout.header_text_color}
                            onChange={(e) => updateLayout('header_text_color', e.target.value)}
                            className="w-12 h-10 rounded border"
                          />
                          <Input
                            value={layout.header_text_color}
                            onChange={(e) => updateLayout('header_text_color', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Footer Settings */}
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="h-5 w-5" />
                  <span>Footer-Einstellungen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Footer aktivieren</label>
                  <Switch
                    checked={layout.footer_enabled}
                    onCheckedChange={(checked) => updateLayout('footer_enabled', checked)}
                  />
                </div>
                
                {layout.footer_enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Footer-Text</label>
                      <Input
                        value={layout.footer_text}
                        onChange={(e) => updateLayout('footer_text', e.target.value)}
                        placeholder="Footer-Text"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Hintergrundfarbe</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={layout.footer_color}
                            onChange={(e) => updateLayout('footer_color', e.target.value)}
                            className="w-12 h-10 rounded border"
                          />
                          <Input
                            value={layout.footer_color}
                            onChange={(e) => updateLayout('footer_color', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Textfarbe</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={layout.footer_text_color}
                            onChange={(e) => updateLayout('footer_text_color', e.target.value)}
                            className="w-12 h-10 rounded border"
                          />
                          <Input
                            value={layout.footer_text_color}
                            onChange={(e) => updateLayout('footer_text_color', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Color Scheme */}
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Farbschema</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hintergrundfarbe</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={layout.background_color}
                      onChange={(e) => updateLayout('background_color', e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={layout.background_color}
                      onChange={(e) => updateLayout('background_color', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hintergrundbild-URL</label>
                  <Input
                    value={layout.background_image_url || ''}
                    onChange={(e) => updateLayout('background_image_url', e.target.value)}
                    placeholder="https://example.com/background.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primärfarbe</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={layout.primary_color}
                        onChange={(e) => updateLayout('primary_color', e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={layout.primary_color}
                        onChange={(e) => updateLayout('primary_color', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sekundärfarbe</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={layout.secondary_color}
                        onChange={(e) => updateLayout('secondary_color', e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={layout.secondary_color}
                        onChange={(e) => updateLayout('secondary_color', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Textfarbe</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={layout.text_color}
                      onChange={(e) => updateLayout('text_color', e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={layout.text_color}
                      onChange={(e) => updateLayout('text_color', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Vorschau</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border rounded-lg overflow-hidden ${
                    previewMode === 'mobile' ? 'max-w-sm mx-auto' : 
                    previewMode === 'tablet' ? 'max-w-md mx-auto' : 'w-full'
                  }`}
                  style={{ backgroundColor: layout.background_color }}
                >
                  {/* Header Preview */}
                  {layout.header_enabled && (
                    <div 
                      className="px-4 py-3 text-center"
                      style={{ 
                        backgroundColor: layout.header_color,
                        color: layout.header_text_color 
                      }}
                    >
                      <h3 className="font-semibold">{layout.header_text}</h3>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="p-6 min-h-[200px]" style={{ color: layout.text_color }}>
                    <div className="space-y-4">
                      <div 
                        className="w-full h-12 rounded flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: layout.primary_color }}
                      >
                        Primärfarbe
                      </div>
                      <div 
                        className="w-full h-8 rounded flex items-center justify-center text-white"
                        style={{ backgroundColor: layout.secondary_color }}
                      >
                        Sekundärfarbe
                      </div>
                      <p className="text-sm">
                        Dies ist ein Beispieltext in der gewählten Textfarbe.
                      </p>
                    </div>
                  </div>

                  {/* Footer Preview */}
                  {layout.footer_enabled && (
                    <div 
                      className="px-4 py-2 text-center text-sm"
                      style={{ 
                        backgroundColor: layout.footer_color,
                        color: layout.footer_text_color 
                      }}
                    >
                      {layout.footer_text}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}