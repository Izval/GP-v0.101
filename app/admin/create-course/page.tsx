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
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import CoursePreview from '@/components/CoursePreview';
import ChapterForm from '@/components/ChapterForm';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
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
    const fetchGames = async () => {
      const gamesCollection = collection(db, 'games');
      const gamesSnapshot = await getDocs(gamesCollection);
      const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(gamesList);
    };

    fetchGames();
  }, []);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `course_images/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setCourseData(prev => ({ ...prev, image: downloadURL }));
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'courses'), courseData);
      toast({
        title: "Curso creado",
        description: `El curso ha sido creado exitosamente con ID: ${docRef.id}`,
      });
      router.push('/admin');
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear el curso.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthWrapper>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Curso</CardTitle>
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
                    <Label htmlFor="image">Imagen del Curso</Label>
                    <Input id="image" name="image" type="file" onChange={handleImageUpload} accept="image/*" />
                    {courseData.image && (
                      <img src={courseData.image} alt="Course preview" className="mt-2 max-w-xs" />
                    )}
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
                  <Button type="submit">Crear Curso</Button>
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