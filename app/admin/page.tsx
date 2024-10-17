"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  return (
    <AuthWrapper>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard de Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Button asChild>
                <Link href="/admin/create-course">Crear Nuevo Curso</Link>
              </Button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Cursos Existentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.brief}</p>
                    <Button asChild className="mt-2">
                      <Link href={`/admin/edit-course/${course.id}`}>Editar</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthWrapper>
  );
}