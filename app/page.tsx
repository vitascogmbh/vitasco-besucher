'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient, isSupabaseConfigured, mockVisitors, mockSystemSettings } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  UserPlus, 
  Building2, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  Database,
  Settings
} from 'lucide-react';
import type { Visitor, SystemSettings } from '@/lib/supabase';
import { AdminNavigation } from '@/components/admin-navigation';

export default function HomePage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    purpose: '',
    host: '',
    notes: ''
  });

  const supabase = createClient();

  useEffect(() => {
    if (isSupabaseConfigured) {
      loadActiveVisitors();
      loadSettings();
    } else {
      // Use mock data when Supabase is not configured
      setVisitors(mockVisitors);
      setSettings(mockSystemSettings);
    }
  }, []);

  const loadActiveVisitors = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('is_active', true)
        .order('start_time', { ascending: false });

      if (error) throw error;
      setVisitors(data || []);
    } catch (error) {
      console.error('Error loading visitors:', error);
      toast.error('Fehler beim Laden der Besucher');
    }
  };

  const loadSettings = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Bitte geben Sie Ihren Namen ein');
      return;
    }

    if (!isSupabaseConfigured) {
      // Demo mode - add to mock data
      const newVisitor: Visitor = {
        id: Date.now().toString(),
        name: formData.name,
        company: formData.company || undefined,
        purpose: formData.purpose || undefined,
        host: formData.host || undefined,
        start_time: new Date().toISOString(),
        end_time: undefined,
        is_active: true,
        badge_number: `B${String(visitors.length + 1).padStart(3, '0')}`,
        notes: formData.notes || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setVisitors(prev => [newVisitor, ...prev]);
      toast.success('Demo: Erfolgreich angemeldet!');
      setFormData({ name: '', company: '', purpose: '', host: '', notes: '' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase!
        .from('visitors')
        .insert([{
          name: formData.name,
          company: formData.company || null,
          purpose: formData.purpose || null,
          host: formData.host || null,
          notes: formData.notes || null,
          start_time: new Date().toISOString(),
          is_active: true
        }]);

      if (error) throw error;

      toast.success('Erfolgreich angemeldet!');
      setFormData({
        name: '',
        company: '',
        purpose: '',
        host: '',
        notes: ''
      });
      loadActiveVisitors();
    } catch (error) {
      console.error('Error registering visitor:', error);
      toast.error('Fehler bei der Anmeldung');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async (visitorId: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode - remove from mock data
      setVisitors(prev => prev.filter(v => v.id !== visitorId));
      toast.success('Demo: Erfolgreich abgemeldet!');
      return;
    }

    try {
      const { error } = await supabase!
        .from('visitors')
        .update({
          end_time: new Date().toISOString(),
          is_active: false
        })
        .eq('id', visitorId);

      if (error) throw error;

      toast.success('Erfolgreich abgemeldet!');
      loadActiveVisitors();
    } catch (error) {
      console.error('Error checking out visitor:', error);
      toast.error('Fehler bei der Abmeldung');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminNavigation />
      
      {/* Supabase Status Banner */}
      {!isSupabaseConfigured && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Demo-Modus aktiv - Supabase nicht verbunden
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                onClick={() => window.open('/setup-guide', '_blank')}
              >
                <Settings className="h-4 w-4 mr-1" />
                Supabase einrichten
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="vitasco-gradient text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">
                  {settings?.site_name || 'Vitasco Besucherverwaltung'}
                </h1>
                <p className="text-blue-100">
                  {settings?.company_name || 'Vitasco GmbH'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">
                {new Date().toLocaleDateString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-blue-100">
                {new Date().toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-6 w-6 text-vitasco-primary" />
                  <span>Besucher Anmeldung</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ihr vollständiger Name"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Unternehmen
                    </label>
                    <Input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="Ihr Unternehmen"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Besuchsgrund
                    </label>
                    <Input
                      type="text"
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      placeholder="Grund Ihres Besuchs"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ansprechpartner
                    </label>
                    <Input
                      type="text"
                      value={formData.host}
                      onChange={(e) => setFormData({...formData, host: e.target.value})}
                      placeholder="Wen möchten Sie besuchen?"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notizen
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Zusätzliche Informationen"
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full vitasco-button text-lg py-3"
                  >
                    {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-vitasco-primary" />
                    <span>Aktuelle Besucher</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {visitors.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {visitors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Keine aktiven Besucher</p>
                    </div>
                  ) : (
                    visitors.map((visitor, index) => (
                      <motion.div
                        key={visitor.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="visitor-card"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{visitor.name}</h3>
                            {visitor.company && (
                              <p className="text-gray-600 flex items-center mt-1">
                                <Building2 className="h-4 w-4 mr-1" />
                                {visitor.company}
                              </p>
                            )}
                            {visitor.purpose && (
                              <p className="text-gray-600 mt-1">{visitor.purpose}</p>
                            )}
                            {visitor.host && (
                              <p className="text-gray-600 mt-1">
                                <strong>Ansprechpartner:</strong> {visitor.host}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              Angemeldet: {new Date(visitor.start_time).toLocaleTimeString('de-DE')}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleCheckout(visitor.id)}
                            variant="outline"
                            size="sm"
                            className="ml-4 hover:bg-green-50 hover:border-green-300"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Abmelden
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="vitasco-gradient text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-100">
            © 2024 {settings?.company_name || 'Vitasco GmbH'} - Besucherverwaltungssystem
          </p>
        </div>
      </footer>
    </div>
  );
}