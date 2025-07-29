'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp,
  Calendar,
  Building2,
  Settings,
  Monitor,
  LogOut,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Visitor } from '@/lib/supabase';
import { AdminNavigation } from '@/components/admin-navigation';

export default function DashboardPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [activeVisitors, setActiveVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    activeNow: 0,
    averageStay: 0,
    totalThisWeek: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load all visitors
      const { data: allVisitors, error: visitorsError } = await supabase
        .from('visitors')
        .select('*')
        .order('start_time', { ascending: false });

      if (visitorsError) throw visitorsError;

      // Load active visitors
      const { data: activeVisitorsData, error: activeError } = await supabase
        .from('visitors')
        .select('*')
        .eq('is_active', true)
        .order('start_time', { ascending: false });

      if (activeError) throw activeError;

      setVisitors(allVisitors || []);
      setActiveVisitors(activeVisitorsData || []);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayVisitors = allVisitors?.filter(v => 
        new Date(v.start_time) >= today
      ) || [];

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weekVisitors = allVisitors?.filter(v => 
        new Date(v.start_time) >= weekAgo
      ) || [];

      // Calculate average stay time
      const completedVisits = allVisitors?.filter(v => v.end_time) || [];
      const totalStayTime = completedVisits.reduce((acc, v) => {
        const start = new Date(v.start_time);
        const end = new Date(v.end_time!);
        return acc + (end.getTime() - start.getTime());
      }, 0);
      
      const averageStay = completedVisits.length > 0 
        ? Math.round(totalStayTime / completedVisits.length / (1000 * 60)) // in minutes
        : 0;

      setStats({
        totalToday: todayVisitors.length,
        activeNow: activeVisitorsData?.length || 0,
        averageStay,
        totalThisWeek: weekVisitors.length
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Fehler beim Laden der Dashboard-Daten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async (visitorId: string) => {
    try {
      const { error } = await supabase
        .from('visitors')
        .update({
          end_time: new Date().toISOString(),
          is_active: false
        })
        .eq('id', visitorId);

      if (error) throw error;

      toast.success('Besucher erfolgreich abgemeldet');
      loadDashboardData();
    } catch (error) {
      console.error('Error checking out visitor:', error);
      toast.error('Fehler bei der Abmeldung');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vitasco-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      {/* Header */}
      <header className="vitasco-gradient text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Vitasco Dashboard</h1>
                <p className="text-blue-100">Besucherverwaltung</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="vitasco-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Heute</p>
                    <p className="text-3xl font-bold text-vitasco-primary">
                      {stats.totalToday}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-vitasco-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="vitasco-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktiv</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.activeNow}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="vitasco-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ø Aufenthalt</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.averageStay}m
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="vitasco-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Diese Woche</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.totalThisWeek}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Visitors */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-6 w-6 text-green-600" />
                    <span>Aktive Besucher</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {activeVisitors.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activeVisitors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Keine aktiven Besucher</p>
                    </div>
                  ) : (
                    activeVisitors.map((visitor, index) => (
                      <motion.div
                        key={visitor.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
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
                                <strong>Host:</strong> {visitor.host}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(visitor.start_time).toLocaleString('de-DE')}
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

          {/* Recent Visitors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="vitasco-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-vitasco-primary" />
                  <span>Letzte Besucher</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {visitors.slice(0, 10).map((visitor, index) => (
                    <motion.div
                      key={visitor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{visitor.name}</h4>
                        {visitor.company && (
                          <p className="text-sm text-gray-600">{visitor.company}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(visitor.start_time).toLocaleString('de-DE')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {visitor.is_active ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aktiv
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                            <XCircle className="h-3 w-3 mr-1" />
                            Beendet
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}