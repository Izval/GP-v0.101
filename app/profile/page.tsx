"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserData {
  accountType: string;
  // Add other user data fields as needed
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <AuthWrapper>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Nombre:</strong> {user?.displayName || 'No especificado'}
              </div>
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>Tipo de cuenta:</strong> {userData?.accountType || 'No especificado'}
              </div>
              {/* Add more user information here */}
              <Button asChild>
                <Link href="/courses">Explorar cursos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthWrapper>
  );
}