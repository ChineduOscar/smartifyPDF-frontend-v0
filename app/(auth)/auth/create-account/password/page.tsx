'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import logo from '@/app/assets/logo.png';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import { showToast } from '@/app/utils/toast';

const EnterPassword = () => {
  const router = useRouter();
  const email = useAuthStore((state) => state.email);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handlePasswordSubmit = async () => {
    if (!password) {
      showToast('Password is required.', 'error');
      return;
    }

    const isValidPassword = (password: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

    if (!isValidPassword(password)) {
      showToast(
        'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.',
        'error'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3333/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      router.push('/auth/create-account/email-verification');
    } catch (error: any) {
      showToast(error.message || 'Failed to create account.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEmail = () => {
    router.push('/auth/create-account');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='min-h-screen bg-white px-4 pt-16 md:pt-24'>
      <div className='w-full max-w-sm mx-auto'>
        {/* Logo */}
        <div className='flex items-center justify-center gap-2 mb-8 md:mb-12'>
          <Image
            src={logo}
            alt='smartifyPDF'
            width={100}
            height={100}
            className='w-8 h-10'
          />
          <h1 className='text-2xl font-bold text-primary-600 mb-2'>
            SmartifyPDF
          </h1>
        </div>

        {/* Welcome Text */}
        <div className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-medium text-gray-900 mb-2'>
            Enter your password
          </h2>
        </div>

        {/* Email and Password Form */}
        <div className='mb-6'>
          <div className='mb-4 relative'>
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10' />
            <Input
              id='email'
              type='email'
              value={email}
              className='pl-10 h-12 bg-gray-50'
              readOnly
            />
            <div
              onClick={handleEditEmail}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm cursor-pointer text-primary-900 underline hover:text-primary-700'
            >
              Edit
            </div>
          </div>

          <div className='mb-6 relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10' />
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='pl-10 pr-12 h-12'
              placeholder='Enter your password'
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 focus:outline-none focus:text-primary-600 transition-colors'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>

          <Button
            onClick={handlePasswordSubmit}
            disabled={isLoading || !password}
            className='w-full bg-primary-500 hover:bg-primary-600 focus:bg-primary-600 focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 h-12 text-white font-medium cursor-pointer transition-all'
          >
            {isLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              'Continue'
            )}
          </Button>
        </div>

        {/* Sign in link */}
        <div className='text-center mb-6'>
          <span className='text-gray-600'>Already have an account? </span>
          <button
            className='text-primary-600 hover:text-primary-700 focus:text-primary-700 hover:underline focus:underline focus:outline-none font-medium cursor-pointer'
            onClick={() => router.push('/auth/login')}
          >
            Log in
          </button>
        </div>

        {/* Footer Links */}
        <div className='mt-8 text-center'>
          <div className='flex justify-center items-center space-x-4 text-sm text-gray-500'>
            <button className='hover:text-primary-600 focus:text-primary-600 hover:underline focus:underline focus:outline-none cursor-pointer transition-colors'>
              Terms of Use
            </button>
            <span>|</span>
            <button className='hover:text-primary-600 focus:text-primary-600 hover:underline focus:underline focus:outline-none cursor-pointer transition-colors'>
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterPassword;
