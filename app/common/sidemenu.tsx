'use client';
import React, { useState, useEffect } from 'react';
import { Upload, FileText, User, Crown, PanelLeft } from 'lucide-react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useQuizStore } from '../store/useQuizStore';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

interface Quiz {
  id: string;
  documentName: string;
  createdAt: string;
  totalQuestions: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [pendingFileDialogTrigger, setPendingFileDialogTrigger] =
    useState(false);
  const { newQuizAdded, setNewQuizAdded, setTriggerFileDialog } =
    useQuizStore();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const currentQuizId = params?.id as string;

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleToggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));

  // Simple truncate function
  const truncateFileName = (
    fileName: string,
    maxLength: number = 25
  ): string => {
    if (fileName.length <= maxLength) return fileName;
    return fileName.substring(0, maxLength - 3) + '...';
  };

  const handleQuizNavigation = (quizId: string) => {
    router.push(`/generated-quiz/${quizId}`);
  };

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('http://localhost:3333/quiz');
      const data = await res.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Failed to fetch quizzes', error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (newQuizAdded) {
      fetchQuizzes();
      setNewQuizAdded(false);
    }
  }, [newQuizAdded]);

  useEffect(() => {
    if (pendingFileDialogTrigger && pathname === '/') {
      setTriggerFileDialog(true);
      setPendingFileDialogTrigger(false);
    }
  }, [pathname, pendingFileDialogTrigger, setTriggerFileDialog]);

  const handleUploadPDF = () => {
    if (pathname === '/') {
      setTriggerFileDialog(true);
    } else {
      setPendingFileDialogTrigger(true);
      router.push('/');
    }
  };

  return (
    <>
      <div
        className={`hidden fixed top-0 h-full bg-white border-r border-gray-200 transition-all duration-100 ease-in z-50 md:flex flex-col ${
          isOpen ? 'w-64' : 'w-18'
        }`}
      >
        {/* Header - Fixed at top */}
        <div
          className={`flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 ${
            !isOpen ? 'justify-center' : ''
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              !isOpen ? 'justify-center w-full' : ''
            }`}
          >
            <div
              className='w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center cursor-pointer'
              onClick={handleToggle}
              aria-label='Toggle Sidebar'
            >
              <span className='text-white font-bold text-sm'>S</span>
            </div>
            {isOpen && (
              <h1 className='text-xl font-bold text-gray-800'>SmartifyPDF</h1>
            )}
          </div>
          {isOpen && (
            <button
              onClick={handleToggle}
              aria-label='Collapse Sidebar'
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <PanelLeft className='w-5 h-5 text-gray-600' />
            </button>
          )}
        </div>

        {/* Upload PDF - Fixed below header */}
        <div
          className={`p-4 border-b border-gray-100 flex-shrink-0 ${
            !isOpen ? 'flex flex-col items-center' : ''
          }`}
        >
          <div
            className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-colors text-primary-800 bg-white border border-dashed border-primary-500 w-fit ${
              !isOpen ? 'justify-center' : ''
            }`}
            onClick={handleUploadPDF}
          >
            <Upload className='w-5 h-5 text-primary-900' />
            {isOpen && (
              <span className='font-medium text-primary-900'>Upload PDF</span>
            )}
          </div>
        </div>

        {/* Scrollable Quizzes List - Fills remaining space */}
        <div className='flex-1 overflow-hidden flex flex-col'>
          <div className='p-4 pb-2 flex-shrink-0'>
            {isOpen && (
              <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3'>
                Quizzes
              </h3>
            )}
          </div>

          {/* Scrollable content */}
          <div className='flex-1 overflow-y-auto px-4 pb-4'>
            <div className='space-y-2'>
              {quizzes.map((quiz) => {
                const isActive = quiz.id === currentQuizId;
                const truncatedName = isOpen
                  ? truncateFileName(quiz.documentName)
                  : quiz.documentName;

                return (
                  <div
                    key={quiz.id}
                    onClick={() => handleQuizNavigation(quiz.id)}
                    className={`cursor-pointer p-3 rounded-lg flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-primary-200 text-primary-900 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    title={quiz.documentName}
                  >
                    <FileText className='w-5 h-5 flex-shrink-0' />
                    {isOpen && (
                      <span className='truncate text-sm'>{truncatedName}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section - Fixed at bottom */}
        <div
          className={`border-t border-gray-200 p-4 space-y-2 flex-shrink-0 ${
            !isOpen ? 'flex flex-col items-center' : ''
          }`}
        >
          {/* Profile */}
          <div
            className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors ${
              !isOpen ? 'justify-center' : ''
            }`}
          >
            <div className='w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0'>
              <User className='w-4 h-4 text-white' />
            </div>
            {isOpen && (
              <span className='text-gray-800 font-medium'>My Profile</span>
            )}
          </div>

          {/* Upgrade */}
          <div
            className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors ${
              !isOpen ? 'justify-center' : ''
            }`}
          >
            <Crown className='w-5 h-5 text-yellow-500 flex-shrink-0' />
            {isOpen && (
              <span className='text-gray-800 font-medium'>
                Upgrade your account
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
