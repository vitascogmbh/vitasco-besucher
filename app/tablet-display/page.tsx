'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase';
import { 
  Users, 
  Clock, 
  Building2, 
  Calendar,
  ChevronRight,
  Wifi,
  Battery
} from 'lucide-react';
import type { Visitor, SlideshowItem, SystemSettings } from '@/lib/supabase';
import { AdminNavigation } from '@/components/admin-navigation';

export default function TabletDisplayPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [slideshowItems, setSlideshowItems] = useState<SlideshowItem[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const supabase = createClient();

  useEffect(() => {
    loadData();
    
    // Auto-refresh data every 30 seconds
    const dataInterval = setInterval(loadData, 30000);
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    if (slideshowItems.length > 0 && settings) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideshowItems.length);
      }, settings.slideshow_interval * 1000);

      return () => clearInterval(interval);
    }
  }, [slideshowItems, settings]);

  const loadData = async () => {
    try {
      // Load active visitors
      const { data: visitorsData, error: visitorsError } = await supabase
        .from('visitors')
        .select('*')
        .eq('is_active', true)
        .order('start_time', { ascending: false })
        .limit(10);

      if (visitorsError) throw visitorsError;

      // Load slideshow items
      const { data: slideshowData, error: slideshowError } = await supabase
        .from('slideshow_items')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });

      if (slideshowError) throw slideshowError;

      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (settingsError) throw settingsError;

      setVisitors(visitorsData || []);
      setSlideshowItems(slideshowData || []);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading tablet display data:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const currentSlideItem = slideshowItems[currentSlide];

  return (
    <div className="min-h-screen tablet-display">
      <AdminNavigation />
      
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <Building2 className="h-6 w-6 text-vitasco-primary" />
          <span className="font-semibold text-vitasco-primary">
            {settings?.company_name || 'Vitasco GmbH'}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Wifi className="h-4 w-4" />
            <span>Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <Battery className="h-4 w-4" />
            <span>100%</span>
          </div>
          <div className="font-mono">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-vitasco-primary mb-2">
            {settings?.site_name || 'Willkommen bei Vitasco'}
          </h1>
          <p className="text-xl text-gray-600">
            {formatDate(currentTime)}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Slideshow */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <Card className="h-full vitasco-card overflow-hidden">
              <CardContent className="p-0 h-full">
                <AnimatePresence mode="wait">
                  {currentSlideItem && (
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="h-full flex flex-col"
                      style={{
                        backgroundColor: currentSlideItem.background_color,
                        color: currentSlideItem.text_color
                      }}
                    >
                      {currentSlideItem.image_url && (
                        <div className="flex-1 relative">
                          <img
                            src={currentSlideItem.image_url}
                            alt={currentSlideItem.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                        </div>
                      )}
                      <div className="p-8 flex-1 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-4">
                          {currentSlideItem.title}
                        </h2>
                        {currentSlideItem.content && (
                          <p className="text-lg leading-relaxed">
                            {currentSlideItem.content}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Slideshow Indicators */}
                {slideshowItems.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {slideshowItems.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentSlide ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Visitors List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <Card className="flex-1 vitasco-card">
              <CardContent className="p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-vitasco-primary flex items-center">
                    <Users className="h-7 w-7 mr-3" />
                    Aktuelle Besucher
                  </h2>
                  <Badge variant="secondary" className="text-xl px-4 py-2">
                    {visitors.length}
                  </Badge>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[calc(100%-100px)]">
                  {visitors.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl text-gray-500">
                        Keine aktiven Besucher
                      </p>
                      <p className="text-gray-400 mt-2">
                        Willkommen bei {settings?.company_name || 'Vitasco'}!
                      </p>
                    </motion.div>
                  ) : (
                    visitors.map((visitor, index) => (
                      <motion.div
                        key={visitor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="visitor-card group hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {visitor.name}
                            </h3>
                            {visitor.company && (
                              <p className="text-gray-600 flex items-center mb-1">
                                <Building2 className="h-4 w-4 mr-2" />
                                {visitor.company}
                              </p>
                            )}
                            {visitor.purpose && (
                              <p className="text-gray-600 mb-2">
                                {visitor.purpose}
                              </p>
                            )}
                            {visitor.host && (
                              <p className="text-sm text-gray-500 mb-2">
                                <strong>Ansprechpartner:</strong> {visitor.host}
                              </p>
                            )}
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              Angemeldet: {new Date(visitor.start_time).toLocaleTimeString('de-DE')}
                            </div>
                          </div>
                          <ChevronRight className="h-6 w-6 text-vitasco-primary group-hover:translate-x-1 transition-transform" />
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
      <div className="absolute bottom-0 left-0 right-0 bg-vitasco-primary text-white py-3">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <p className="text-sm">
              © 2024 {settings?.company_name || 'Vitasco GmbH'} - Besucherverwaltung
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}