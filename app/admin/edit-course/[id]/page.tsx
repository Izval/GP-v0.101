"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CoursePreview from '@/components/CoursePreview';
import ChapterForm from '@/components/ChapterForm';
import { useRouter } from 'next/navigation';

export default function EditCoursePage({ params }) {
  const { id } = params;
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    brief: '',
    price: '',
    image: '',
    game: '',
    subcategories: [],
    chapters: [],
    instructor: {
      name: '',
      description: '',
      image: ''
    },
    duration: ''
  });
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const courseDoc = doc(db, 'courses', id);
      const courseSnapshot = await getDoc(courseDoc);
      if (courseSnapshot.exists()) {
        setCourseData(courseSnapshot.data());
      } else {
        toast({
          title: "Error",
          description: "No se encontró el curso.",
          variant: "destructive",
        });
        router.push('/admin');
      }
    };

    const fetchGames = async () => {
      const gamesCollection = collection(db, 'games');
      const gamesSnapshot = await getDocs(gamesCollection);
      const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(gamesList);
    };

    fetchCourse();
    fetchGames();
  }, [id, router, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleInstructorChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      instructor: { ...prev.instructor, [name]: value }
    }));
  };

  const handleGameChange = (e) => {
    setCourseData(prev => ({ ...prev, game: e.target.value }));
  };

  const handleChaptersChange = (chapters) => {
    setCourseData(prev => ({ ...prev, chapters }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseRef = doc(db, 'courses', id);
      await updateDoc(courseRef, courseData);
      toast({
        title: "Curso actualizado",
        description: "El curso ha sido actualizado exitosamente.",
      });
      router.push('/admin');
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el curso.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthWrapper>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título del Curso</Label>
                    <Input id="title" name="title" value={courseData.title} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea id="description" name="description" value={courseData.description} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="brief">Resumen Breve</Label>
                    <Input id="brief" name="brief" value={courseData.brief} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="price">Precio</Label>
                    <Input id="price" name="price" type="number" value={courseData.price} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="image">URL de la Imagen</Label>
                    <Input id="image" name="image" value={courseData.image} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="game">Juego</Label>
                    <select
                      id="game"
                      name="game"
                      value={courseData.game}
                      onChange={handleGameChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Selecciona un juego</option>
                      {games.map((game) => (
                        <option key={game.id} value={game.id}>{game.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duración</Label>
                    <Input id="duration" name="duration" value={courseData.duration} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label>Instructor</Label>
                    <Input name="name" placeholder="Nombre del instructor" value={courseData.instructor.name} onChange={handleInstructorChange} required />
                    <Input name="description" placeholder="Descripción del instructor" value={courseData.instructor.description} onChange={handleInstructorChange} required />
                    <Input name="image" placeholder="URL de la imagen del instructor" value={courseData.instructor.image} onChange={handleInstructorChange} required />
                  </div>
                  <ChapterForm chapters={courseData.chapters} onChange={handleChaptersChange} />
                  <Button type="submit">Actualizar Curso</Button>
                </form>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Vista Previa del Curso</h2>
                <CoursePreview course={courseData} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthWrapper>
  );
}