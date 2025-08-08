'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, User } from 'lucide-react';
import Image from 'next/image';
import logo from '@/app/assets/logo.png';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/utils/toast';
import { setCookie } from 'cookies-next';
import { useAuthStore } from '@/app/store/useAuthStore';

const EnterName = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const { email } = useAuthStore.getState();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3333/auth/set-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to complete profile');
      }

      const data = await res.json();
      console.log(data);

      const {
        tokens: { access_token, refresh_token },
        user,
      } = data;

      setCookie('access_token', access_token);
      setCookie('refresh_token', refresh_token);
      setCookie('user', JSON.stringify(user));
      console.log('Profile completed:', data);

      router.push('/');
    } catch (error: any) {
      showToast(error.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name.trim().length > 0;

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

        {/* Title */}
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-medium text-gray-900 mb-2'>
            What's your name?
          </h2>
          <p className='text-gray-600 text-base'>
            We'll use this to personalize your experience
          </p>
        </div>

        {/* Name Form */}
        <div className='mb-6'>
          <div className='mb-6 relative'>
            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10' />
            <Input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Full name (e.g., John Doe)'
              className='pl-10 h-12 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
            />
          </div>

          <Button
            onClick={handleContinue}
            disabled={isLoading || !isFormValid}
            className='w-full bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-300 h-12 text-white font-medium cursor-pointer'
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
            className='text-primary-600 hover:text-primary-700 font-medium'
            onClick={() => router.push('/auth/login')}
          >
            Log in
          </button>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center'>
          <div className='flex justify-center items-center space-x-4 text-sm text-gray-500'>
            <button className='hover:text-primary-600'>Terms of Use</button>
            <span>|</span>
            <button className='hover:text-primary-600'>Privacy Policy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterName;
