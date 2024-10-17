"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  chapters: { id: number; title: string; videoUrl: string }[];
}

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<{ id: number; title: string; videoUrl: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourse = async () => {
      const courseDoc = doc(db, 'courses', courseId);
      const courseSnapshot = await getDoc(courseDoc);
      if (courseSnapshot.exists()) {
        const courseData = courseSnapshot.data() as Course;
        setCourse({ id: courseSnapshot.id, ...courseData });
        setSelectedChapter(courseData.chapters[0]);
      } else {
        console.log('No such course!');
      }
    };

    fetchCourse();
  }, [courseId]);

  const handlePurchase = () => {
    // Implement Mercado Pago integration here
    toast({
      title: "Compra iniciada",
      description: "Redirigiendo a la pasarela de pago...",
    });
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>Instructor: {course.instructor}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{course.description}</p>
          {selectedChapter && (
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src={selectedChapter.videoUrl}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Capítulos</h3>
              <ul className="space-y-2">
                {course.chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setSelectedChapter(chapter)}
                    >
                      {chapter.title}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Detalles del curso</h3>
              <p>Precio: ${course.price}</p>
              <Button onClick={handlePurchase} className="mt-4">Comprar curso</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}