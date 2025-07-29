# Vitasco Besucherverwaltungssystem

Ein modernes, professionelles Besucherverwaltungssystem für Unternehmen, entwickelt mit Next.js und Supabase.

## 🚀 Features

- **Besucher-Anmeldung** - Einfache Registrierung für Gäste
- **Admin-Dashboard** - Übersicht und Statistiken
- **Tablet-Display** - Empfangs-Anzeige mit Slideshow
- **Slideshow-Manager** - Verwaltung von Inhalten
- **Layout-Manager** - Anpassung des Designs
- **Systemeinstellungen** - Globale Konfiguration
- **Responsive Design** - Funktioniert auf allen Geräten

## 🛠️ Technologie-Stack

- **Frontend:** Next.js 13, React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL)
- **Authentifizierung:** Supabase Auth
- **Animationen:** Framer Motion
- **Icons:** Lucide React

## 📦 Installation

1. **Repository klonen:**
```bash
git clone https://github.com/IHR-USERNAME/vitasco-visitor-system.git
cd vitasco-visitor-system
```

2. **Dependencies installieren:**
```bash
npm install
```

3. **Umgebungsvariablen einrichten:**
```bash
cp .env.example .env.local
```

Fügen Sie Ihre Supabase-Credentials in `.env.local` ein:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ihr-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-anon-key
```

4. **Datenbank einrichten:**
- Führen Sie die Migration in `supabase/migrations/20250729092453_purple_star.sql` in Ihrem Supabase-Projekt aus

5. **Entwicklungsserver starten:**
```bash
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` verfügbar.

## 🔧 Konfiguration

### Supabase Setup
1. Erstellen Sie ein neues Supabase-Projekt
2. Kopieren Sie die URL und den anon key
3. Führen Sie die SQL-Migration aus
4. Aktualisieren Sie die `.env.local` Datei

### Admin-Zugang
- **Demo-Login:** admin@vitasco.com / admin123
- Erstellen Sie einen echten Admin-User in Supabase Auth

## 📱 Verwendung

### Für Besucher:
1. Öffnen Sie die Hauptseite
2. Füllen Sie das Anmeldeformular aus
3. Klicken Sie "Anmelden"

### Für Administratoren:
1. Gehen Sie zu `/login`
2. Melden Sie sich mit Admin-Credentials an
3. Verwenden Sie das Navigationsmenü (☰) für alle Bereiche

### Tablet-Display:
- Öffnen Sie `/tablet-display` auf einem Tablet
- Zeigt aktuelle Besucher und Slideshow
- Aktualisiert sich automatisch

## 🎨 Anpassung

### Design anpassen:
- Verwenden Sie den **Layout-Manager** (`/admin/layout`)
- Ändern Sie Farben, Header, Footer
- Laden Sie ein eigenes Logo hoch

### Slideshow verwalten:
- Verwenden Sie den **Slideshow-Manager** (`/admin/slideshow`)
- Fügen Sie Bilder und Texte hinzu
- Stellen Sie Anzeigedauer ein

### Systemeinstellungen:
- Öffnen Sie **Systemeinstellungen** (`/admin/settings`)
- Konfigurieren Sie Sprache, Zeitzone, etc.
- Aktivieren Sie automatische Funktionen

## 🚀 Deployment

### Vercel (Empfohlen):
1. Verbinden Sie GitHub mit Vercel
2. Importieren Sie das Repository
3. Fügen Sie Umgebungsvariablen hinzu
4. Deploy!

### Netlify:
1. Verbinden Sie GitHub mit Netlify
2. Build Command: `npm run build`
3. Publish Directory: `out`
4. Fügen Sie Umgebungsvariablen hinzu

## 📄 Lizenz

Dieses Projekt wurde für Vitasco GmbH entwickelt.

## 🤝 Support

Bei Fragen oder Problemen erstellen Sie ein Issue in diesem Repository.

---

**Entwickelt mit ❤️ für Vitasco GmbH**