import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';

const ChapterForm = ({ chapters, onChange }) => {
  const addChapter = () => {
    onChange([...chapters, { title: '', videoUrl: '' }]);
  };

  const updateChapter = (index, field, value) => {
    const updatedChapters = chapters.map((chapter, i) => 
      i === index ? { ...chapter, [field]: value } : chapter
    );
    onChange(updatedChapters);
  };

  const removeChapter = (index) => {
    onChange(chapters.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label>Capítulos</Label>
      {chapters.map((chapter, index) => (
        <div key={index} className="flex space-x-2 mb-2 items-center">
          <Input
            placeholder="Título del capítulo"
            value={chapter.title}
            onChange={(e) => updateChapter(index, 'title', e.target.value)}
          />
          <Input
            placeholder="URL del video"
            value={chapter.videoUrl}
            onChange={(e) => updateChapter(index, 'videoUrl', e.target.value)}
          />
          <Button type="button" onClick={() => removeChapter(index)} variant="ghost" size="icon">
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addChapter} variant="outline" size="sm" className="mt-2">
        <Plus className="h-4 w-4 mr-2" /> Añadir Capítulo
      </Button>
    </div>
  );
};

export default ChapterForm;