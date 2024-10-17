"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-secondary">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a GamePath</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Descubre cursos de gaming impartidos por expertos y mejora tus habilidades
      </p>
      <div className="space-x-4">
        {!user ? (
          <Button asChild>
            <Link href="/auth">Iniciar sesión</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/profile">Mi Perfil</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/courses">Explorar cursos</Link>
        </Button>
      </div>
      {user && user.email === 'valdezisaac81@gmail.com' && (
        <div className="mt-8">
          <Button asChild variant="secondary">
            <Link href="/admin/create-course">Crear Curso</Link>
          </Button>
        </div>
      )}
    </div>
  );
}