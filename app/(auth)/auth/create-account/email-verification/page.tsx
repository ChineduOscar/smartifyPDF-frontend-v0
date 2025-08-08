'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import logo from '@/app/assets/logo.png';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/utils/toast';
import { useAuthStore } from '@/app/store/useAuthStore';

const OTPVerification = () => {
  const router = useRouter();
  const email = useAuthStore((state) => state.email);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      showToast('OTP must be 6 digits', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3333/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      router.push('/auth/create-account/complete-profile');
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      showToast(error.message || 'Verification failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      showToast('Email not found. Please go back and try again.', 'error');
      return;
    }

    setIsResending(true);

    try {
      const res = await fetch(
        'http://localhost:3333/auth/resend-verification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      showToast('OTP resent successfully!', 'success');
      setCountdown(30);
      setCanResend(false);
      setOtp('');
    } catch (error: any) {
      console.error('Resend OTP failed:', error);
      showToast(error.message || 'Could not resend code', 'error');
    } finally {
      setIsResending(false);
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

        {/* Title */}
        <div className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-medium text-gray-900 mb-3'>
            Head over to your inbox!
          </h2>
          <p className='text-gray-600 text-base'>
            Enter the verification code sent to
            <span className='font-medium text-gray-800'> {email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className='mb-6'>
          <Input
            type='text'
            value={otp}
            onChange={handleOtpChange}
            placeholder='Enter 6-digit code'
            maxLength={6}
            className='h-12 text-center text-lg font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 tracking-widest'
          />
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyOtp}
          disabled={isLoading || otp.length !== 6}
          className='w-full bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-300 h-12 text-white font-medium mb-6 cursor-pointer'
        >
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>

        {/* Resend Section */}
        <div className='text-center mb-6'>
          {!canResend ? (
            <p className='text-gray-600 text-sm'>
              Didn't receive the code?{' '}
              <span className='text-primary-600 font-medium'>
                Resend in {countdown}s
              </span>
            </p>
          ) : (
            <div className='text-sm'>
              <span className='text-gray-600'>Didn't receive the code? </span>
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className='text-primary-600 hover:text-primary-700 font-medium cursor-pointer'
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='mt-8 text-center'>
          <div className='flex justify-center items-center space-x-4 text-sm text-gray-500'>
            <button className='hover:text-primary-600 cursor-pointer'>
              Terms of Use
            </button>
            <span>|</span>
            <button className='hover:text-primary-600 cursor-pointer'>
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
