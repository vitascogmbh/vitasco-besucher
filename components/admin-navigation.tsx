'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Menu,
  X,
  Home,
  Users,
  Monitor,
  Image,
  Palette,
  Settings,
  LogOut,
  Building2,
  ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Übersicht und Statistiken'
  },
  {
    title: 'Besucher-Anmeldung',
    href: '/',
    icon: Users,
    description: 'Hauptseite für Besucher'
  },
  {
    title: 'Tablet-Display',
    href: '/tablet-display',
    icon: Monitor,
    description: 'Empfangs-Anzeige'
  },
  {
    title: 'Slideshow-Manager',
    href: '/admin/slideshow',
    icon: Image,
    description: 'Inhalte verwalten'
  },
  {
    title: 'Layout-Manager',
    href: '/admin/layout',
    icon: Palette,
    description: 'Design anpassen'
  },
  {
    title: 'Systemeinstellungen',
    href: '/admin/settings',
    icon: Settings,
    description: 'Konfiguration'
  }
];

export function AdminNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase?.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="vitasco-gradient p-2 rounded-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Vitasco Admin</h2>
                    <p className="text-sm text-gray-600">Besucherverwaltung</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isActive(item.href) 
                          ? 'bg-vitasco-primary/10 border-vitasco-primary shadow-sm' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleNavigation(item.href)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isActive(item.href) 
                                ? 'bg-vitasco-primary text-white' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className={`font-medium ${
                                isActive(item.href) ? 'text-vitasco-primary' : 'text-gray-900'
                              }`}>
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className={`h-4 w-4 ${
                            isActive(item.href) ? 'text-vitasco-primary' : 'text-gray-400'
                          }`} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Logout Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Abmelden
                </Button>
              </motion.div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  © 2024 Vitasco GmbH
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Besucherverwaltung v1.0
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}