"use client"

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">GamePath</Link>
        <div className="space-x-4">
          <Link href="/courses">Cursos</Link>
          {user ? (
            <>
              <Link href="/profile">Perfil</Link>
              {user.email === 'valdezisaac81@gmail.com' && (
                <Button asChild variant="secondary">
                  <Link href="/admin/create-course">Crear Curso</Link>
                </Button>
              )}
            </>
          ) : (
            <Link href="/auth">Iniciar sesión</Link>
          )}
        </div>
      </nav>
    </header>
  );
}