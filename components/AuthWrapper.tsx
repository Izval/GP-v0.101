"use client"

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/components/ui/use-toast';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleSendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast({
          title: "Verification Email Sent",
          description: "Please check your email to verify your account.",
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
        toast({
          title: "Error",
          description: "Failed to send verification email. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (user && !user.emailVerified) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Email Verification Required</h1>
        <p className="mb-4">Please verify your email address to access this page.</p>
        <Button onClick={handleSendVerificationEmail}>Resend Verification Email</Button>
      </div>
    );
  }

  return <>{children}</>;
}