'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown,
  Image,
  Palette,
  Clock,
  Save,
  X
} from 'lucide-react';
import type { SlideshowItem } from '@/lib/supabase';
import { AdminNavigation } from '@/components/admin-navigation';

export default function SlideshowManagerPage() {
  const [slides, setSlides] = useState<SlideshowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<SlideshowItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    display_time: 5,
    background_color: '#1e40af',
    text_color: '#ffffff',
    is_active: true
  });

  const supabase = createClient();

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const { data, error } = await supabase!
        .from('slideshow_items')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error loading slides:', error);
      toast.error('Fehler beim Laden der Slides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const slideData = {
        ...formData,
        order: editingSlide ? editingSlide.order : slides.length + 1
      };

      if (editingSlide) {
        const { error } = await supabase!
          .from('slideshow_items')
          .update(slideData)
          .eq('id', editingSlide.id);

        if (error) throw error;
        toast.success('Slide erfolgreich aktualisiert');
      } else {
        const { error } = await supabase!
          .from('slideshow_items')
          .insert([slideData]);

        if (error) throw error;
        toast.success('Slide erfolgreich erstellt');
      }

      setIsDialogOpen(false);
      setEditingSlide(null);
      resetForm();
      loadSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Fehler beim Speichern');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Slide löschen möchten?')) return;

    try {
      const { error } = await supabase!
        .from('slideshow_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Slide erfolgreich gelöscht');
      loadSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  const toggleActive = async (slide: SlideshowItem) => {
    try {
      const { error } = await supabase!
        .from('slideshow_items')
        .update({ is_active: !slide.is_active })
        .eq('id', slide.id);

      if (error) throw error;
      toast.success(`Slide ${!slide.is_active ? 'aktiviert' : 'deaktiviert'}`);
      loadSlides();
    } catch (error) {
      console.error('Error toggling slide:', error);
      toast.error('Fehler beim Ändern des Status');
    }
  };

  const moveSlide = async (slide: SlideshowItem, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === slide.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    try {
      const targetSlide = slides[targetIndex];
      
      // Swap orders
      await supabase!
        .from('slideshow_items')
        .update({ order: targetSlide.order })
        .eq('id', slide.id);

      await supabase!
        .from('slideshow_items')
        .update({ order: slide.order })
        .eq('id', targetSlide.id);

      toast.success('Reihenfolge geändert');
      loadSlides();
    } catch (error) {
      console.error('Error moving slide:', error);
      toast.error('Fehler beim Verschieben');
    }
  };

  const openEditDialog = (slide?: SlideshowItem) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        title: slide.title,
        content: slide.content || '',
        image_url: slide.image_url || '',
        display_time: slide.display_time,
        background_color: slide.background_color,
        text_color: slide.text_color,
        is_active: slide.is_active
      });
    } else {
      setEditingSlide(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image_url: '',
      display_time: 5,
      background_color: '#1e40af',
      text_color: '#ffffff',
      is_active: true
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vitasco-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Slides werden geladen...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Slideshow-Manager</h1>
            <p className="text-gray-600 mt-2">Verwalten Sie die Inhalte für die Tablet-Anzeige</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openEditDialog()} className="vitasco-button">
                <Plus className="h-4 w-4 mr-2" />
                Neuer Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSlide ? 'Slide bearbeiten' : 'Neuer Slide'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titel *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Slide-Titel"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Inhalt</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Slide-Inhalt"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bild-URL</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Anzeigedauer (Sekunden)</label>
                    <Input
                      type="number"
                      value={formData.display_time}
                      onChange={(e) => setFormData({...formData, display_time: parseInt(e.target.value)})}
                      min="1"
                      max="60"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">Aktiv</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Hintergrundfarbe</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.background_color}
                        onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={formData.background_color}
                        onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                        placeholder="#1e40af"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Textfarbe</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.text_color}
                        onChange={(e) => setFormData({...formData, text_color: e.target.value})}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={formData.text_color}
                        onChange={(e) => setFormData({...formData, text_color: e.target.value})}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Abbrechen
                  </Button>
                  <Button onClick={handleSave} className="vitasco-button">
                    <Save className="h-4 w-4 mr-2" />
                    Speichern
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {slides.length === 0 ? (
            <Card className="vitasco-card">
              <CardContent className="text-center py-12">
                <Image className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Slides vorhanden</h3>
                <p className="text-gray-600 mb-4">Erstellen Sie Ihren ersten Slide für die Slideshow</p>
                <Button onClick={() => openEditDialog()} className="vitasco-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Ersten Slide erstellen
                </Button>
              </CardContent>
            </Card>
          ) : (
            slides.map((slide, index) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="vitasco-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold">{slide.title}</h3>
                          <Badge variant={slide.is_active ? "default" : "secondary"}>
                            {slide.is_active ? 'Aktiv' : 'Inaktiv'}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {slide.display_time}s
                          </div>
                        </div>
                        
                        {slide.content && (
                          <p className="text-gray-600 mb-3">{slide.content}</p>
                        )}
                        
                        {slide.image_url && (
                          <div className="mb-3">
                            <img 
                              src={slide.image_url} 
                              alt={slide.title}
                              className="w-32 h-20 object-cover rounded border"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Palette className="h-4 w-4" />
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: slide.background_color }}
                            ></div>
                            <span>{slide.background_color}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: slide.text_color }}
                            ></div>
                            <span>{slide.text_color}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSlide(slide, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSlide(slide, 'down')}
                          disabled={index === slides.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(slide)}
                        >
                          {slide.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(slide)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(slide.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}