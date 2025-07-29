'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Copy, 
  ExternalLink, 
  CheckCircle,
  AlertTriangle,
  Code,
  Settings,
  FileText,
  Play
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function SupabaseSetupGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('In Zwischenablage kopiert!');
  };

  const envTemplate = `NEXT_PUBLIC_SUPABASE_URL=https://ihr-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-anon-key-hier`;

  const migrationSQL = `-- Diese SQL in Supabase SQL Editor ausführen
-- Kopieren Sie den Inhalt aus: supabase/migrations/20250729092453_purple_star.sql`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="vitasco-gradient p-4 rounded-full">
              <Database className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supabase für Vitasco einrichten
          </h1>
          <p className="text-gray-600">
            Folgen Sie diesen 4 einfachen Schritten für die Live-Verbindung
          </p>
        </div>

        <div className="grid gap-6">
          {/* Step 1 */}
          <Card className="vitasco-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge className="bg-vitasco-primary text-white">1</Badge>
                <span>Supabase-Projekt öffnen</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Öffnen Sie Ihr bestehendes Supabase-Projekt oder erstellen Sie ein neues.
              </p>
              <Button
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                className="vitasco-button"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Supabase Dashboard öffnen
              </Button>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="vitasco-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge className="bg-vitasco-primary text-white">2</Badge>
                <span>API-Schlüssel kopieren</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Gehen Sie in Ihrem Supabase-Projekt zu: <strong>Settings → API</strong>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Benötigte Werte:
                    </p>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• <strong>Project URL</strong> (beginnt mit https://)</li>
                      <li>• <strong>anon public</strong> API-Schlüssel</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="vitasco-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge className="bg-vitasco-primary text-white">3</Badge>
                <span>Environment-Datei erstellen</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Erstellen Sie eine <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> Datei 
                im Projektverzeichnis:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
                <pre>{envTemplate}</pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  onClick={() => copyToClipboard(envTemplate)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Wichtig:
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Ersetzen Sie "ihr-projekt-id" und "ihr-anon-key-hier" mit Ihren echten Werten!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="vitasco-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Badge className="bg-vitasco-primary text-white">4</Badge>
                <span>Datenbank-Schema einrichten</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Führen Sie die Migration in Ihrem Supabase-Projekt aus:
              </p>
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Migration verfügbar:
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        <code>supabase/migrations/20250729092453_purple_star.sql</code>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
                  <pre>{migrationSQL}</pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => copyToClipboard(migrationSQL)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Play className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        So führen Sie die Migration aus:
                      </p>
                      <ol className="text-sm text-green-700 mt-1 space-y-1">
                        <li>1. Gehen Sie zu <strong>SQL Editor</strong> in Supabase</li>
                        <li>2. Kopieren Sie den kompletten Inhalt der Migration</li>
                        <li>3. Fügen Sie ihn ein und klicken Sie <strong>Run</strong></li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success */}
          <Card className="vitasco-card border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-6 w-6" />
                <span>System bereit!</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  Nach der Einrichtung starten Sie das System neu. Es erkennt automatisch 
                  die Supabase-Verbindung und wechselt vom Demo- in den Live-Modus.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Vollständiges System:
                      </p>
                      <ul className="text-sm text-green-700 mt-1 space-y-1">
                        <li>• Besucher-Anmeldung mit Datenbank</li>
                        <li>• Admin-Dashboard mit Statistiken</li>
                        <li>• Tablet-Display mit Slideshow</li>
                        <li>• Authentifizierung und Sicherheit</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="text-vitasco-primary border-vitasco-primary hover:bg-vitasco-primary hover:text-white"
          >
            ← Zurück zum Demo-System
          </Button>
        </div>
      </div>
    </div>
  );
}