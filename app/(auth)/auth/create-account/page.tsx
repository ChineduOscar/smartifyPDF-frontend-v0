'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';
import GoogleIcon from '@/app/assets/googleIcon';
import Image from 'next/image';
import logo from '@/app/assets/logo.png';
import { signInWithGoogle } from '@/app/lib/firebaseAuth';
import { showToast } from '@/app/utils/toast';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { useAuthStore } from '@/app/store/useAuthStore';

const CreateAccount = () => {
  const router = useRouter();
  const [email, setEmailInput] = useState('');
  const { setEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSignup = async () => {
    if (!email || !isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3333/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setEmail(email);

      if (data.exists && data.provider === 'google') {
        await handleGoogleSignup();
      } else if (data.exists && data.provider === 'local') {
        router.push('/auth/login');
      } else if (!data.exists) {
        router.push('/auth/create-account/password');
      }
    } catch (error: any) {
      showToast(
        error.message || 'Failed to initiate signup. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);

      const userCredential = await signInWithGoogle();
      const idToken = await userCredential.getIdToken();

      const res = await fetch('http://localhost:3333/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Google login failed');
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

      router.push('/');
    } catch (err) {
      if (
        err instanceof FirebaseError &&
        err.code === 'auth/popup-closed-by-user'
      ) {
        // Do nothing
      } else {
        showToast('Google login failed. Please try again.', 'error');
      }
    } finally {
      setIsGoogleLoading(false);
    }
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
          <h2 className='text-3xl font-medium text-gray-900 mb-2'>
            Create an account
          </h2>
        </div>

        {/* Email Form */}
        <div className='mb-6'>
          <div className='mb-4 relative'>
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10' />
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmailInput(e.target.value)}
              className='pl-10 h-12'
              placeholder='Email address'
            />
          </div>

          <Button
            onClick={handleEmailSignup}
            disabled={isLoading || !email}
            className='w-full bg-primary-500 hover:bg-primary-600 h-12 text-white font-medium cursor-pointer'
          >
            {isLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              'Continue'
            )}
          </Button>
        </div>

        {/* Sign up link */}
        <div className='text-center mb-6'>
          <span className='text-gray-600'>Don't have an account? </span>
          <button
            className='text-primary-600 hover:underline font-medium cursor-pointer'
            onClick={() => router.push('/auth/login')}
          >
            Log in
          </button>
        </div>

        {/* Divider */}
        <div className='text-center mb-6'>
          <span className='text-gray-500 text-sm font-medium'>OR</span>
        </div>

        {/* Social Login Options */}
        <Button
          onClick={handleGoogleSignup}
          variant='outline'
          className='w-full h-12 font-medium cursor-pointer'
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            </>
          ) : (
            <>
              <GoogleIcon />
              <span className='text-gray-700'>Continue with Google</span>
            </>
          )}
        </Button>

        {/* Footer Links */}
        <div className='mt-8 text-center'>
          <div className='flex justify-center items-center space-x-4 text-sm text-gray-500'>
            <button className='hover:underline cursor-pointer'>
              Terms of Use
            </button>
            <span>|</span>
            <button className='hover:underline cursor-pointer'>
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
