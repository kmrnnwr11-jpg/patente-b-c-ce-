import { FC } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const LoginPage: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] flex items-center justify-center p-6">
      <LoginForm />
    </div>
  );
};

