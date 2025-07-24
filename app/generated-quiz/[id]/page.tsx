'use client';

import {
  Download,
  Link as LinkIcon,
  Lock,
  BookOpen,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../../store/useQuizStore';

const GeneratedQuiz = () => {
  const router = useRouter();
  const { quizId, documentName, questions } = useQuizStore();

  console.log('this is the document name in aanother page sir', questions);
  return (
    <div className='min-h-screen bg-white flex justify-center px-4 md:py-32 py-20'>
      <div className='w-full max-w-4xl space-y-10'>
        {/* PDF Info */}
        <div className='flex items-center justify-center'>
          <div className='flex items-center gap-4 bg-gray-100 px-6 py-4 rounded-2xl shadow border border-gray-200'>
            <FileText className='w-7 h-7 text-gray-800' />
            <div className='flex'>
              <span className='font-semibold text-xl text-gray-800'>
                {documentName}
              </span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className='text-3xl md:text-4xl font-bold text-center text-gray-800'>
          Your Questions Are Ready!
        </h1>

        {/* Mode Selection Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Exam Mode */}
          <div className='group bg-gradient-to-tr from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all p-6 rounded-2xl shadow-md border border-green-200'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='bg-green-200 text-green-700 p-3 rounded-xl'>
                <ShieldCheck className='w-8 h-8' />
              </div>
              <h2 className='text-2xl font-semibold text-gray-800'>
                Exam Mode
              </h2>
            </div>
            <p className='text-sm text-gray-600 mb-4'>
              Simulates real exam conditions. No hints or answers till the end.
              Timed and strict.
            </p>
            <button
              onClick={() => router.push(`/exam-mode/${quizId}`)}
              className='w-full bg-green-600 hover:bg-green-700 transition text-white py-3 px-5 rounded-xl text-lg font-medium cursor-pointer'
            >
              Start Exam
            </button>
          </div>

          {/* Study Mode */}
          <div className='group bg-gradient-to-tr from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all p-6 rounded-2xl shadow-md border border-blue-200'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='bg-blue-200 text-blue-700 p-3 rounded-xl'>
                <BookOpen className='w-8 h-8' />
              </div>
              <h2 className='text-2xl font-semibold text-gray-800'>
                Study Mode
              </h2>
            </div>
            <p className='text-sm text-gray-600 mb-4'>
              Practice at your own pace. See hints and answers immediately after
              each question.
            </p>
            <button
              onClick={() => router.push(`/study-mode/${quizId}`)}
              className='w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 px-5 rounded-xl text-lg font-medium cursor-pointer'
            >
              Start Study
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
          {/* Download Button */}
          <button className='w-full md:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-700 transition'>
            <Download className='w-5 h-5' />
            Download Questions
          </button>

          {/* Shareable Link (Locked) */}
          <div className='w-full md:w-auto flex items-center justify-between border border-gray-200 rounded-xl px-5 py-3 bg-gray-50 gap-3 shadow-sm'>
            <div className='flex items-center gap-2 text-gray-500 text-sm'>
              <LinkIcon className='w-4 h-4' />
              Shareable Link
            </div>
            <Lock className='w-4 h-4 text-gray-400' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedQuiz;
