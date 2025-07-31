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
import { useExamStore } from '@/app/store/useExamStore';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { downloadQuizFile } from '@/app/utils/downloadQuizFIle';
import { Menu, MenuItem } from '@mui/material';
import PdfIcon from '@/app/assets/pdfIcon';
import DocxIcon from '@/app/assets/docxIcon';
import ExamSettingsModal, {
  ExamSettings,
} from '@/app/components/dialogs/examSettingsDialog';
import { useStudyStore } from '@/app/store/useStudyStore';

const GeneratedQuiz = () => {
  const router = useRouter();
  const params = useParams();
  const { setQuizData } = useQuizStore();
  const { setExamSettings } = useExamStore();
  const quizIdFromUrl = params?.id as string;
  const { quizId, documentName, questions } = useQuizStore();
  const { examQuizId, setExamQuizId } = useExamStore();
  const { studyQuizId, setStudyQuizId } = useStudyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchQuiz = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:3333/quiz/${quizIdFromUrl}`);

      if (res.ok) {
        const data = await res.json();
        const {
          id: quizId,
          document: { documentName },
          questions,
        } = data;

        setQuizData(quizId, documentName, questions);
      } else {
        setIsLoading(false);
        setShowError(true);
        setErrorMessage('Quiz not found');

        setTimeout(() => {
          setShowError(false);
          router.replace('/');
        }, 1500);
      }
    } catch (error) {
      setShowError(true);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Quiz not found or failed to load.'
      );

      setTimeout(() => {
        setShowError(false);
        router.replace('/');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  // This reloads the page when localStorage is updated from another tab.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'exam-storage' || event.key === 'study-storage') {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (quizIdFromUrl && !questions?.length) {
      fetchQuiz();
    } else if (quizIdFromUrl && quizId && quizIdFromUrl !== quizId) {
      setErrorMessage('Unable to load quiz.');
      setShowError(true);
      setIsLoading(false);

      const timeout = setTimeout(() => {
        setShowError(false);
        router.replace('/');
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [quizIdFromUrl, quizId, questions?.length, router]);

  const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setAnchorEl(null);
  };

  const handleQuizDownload = async (format: 'pdf' | 'docx') => {
    handleDownloadClose();
    if (quizId) {
      await downloadQuizFile(quizId, format);
    }
  };

  const handleExamModeClick = () => {
    if (examQuizId === quizId) {
      setErrorMessage('You already have an ongoing exam for this quiz.');
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 3000);
      return;
    }

    setExamModalOpen(true);
  };

  const handleExamStart = (settings: ExamSettings) => {
    setExamModalOpen(false);
    setExamQuizId(quizId);
    setExamSettings({
      isTimedExam: settings.isTimedExam,
      timeLimit: settings.timeLimit,
      timeUnit: settings.timeUnit,
    });
    window.open(`/exam-mode/${quizId}`);
  };

  const handleStudyStart = () => {
    if (studyQuizId === quizId) {
      setErrorMessage('You already have an ongoing study for this quiz.');
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 3000);
      return;
    }
    setStudyQuizId(quizId);
    window.open(`/study-mode/${quizId}`, '_blank');
  };

  const handleCloseExamModal = () => {
    setExamModalOpen(false);
  };

  if (isLoading && !showError) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='text-gray-500 text-lg font-semibold animate-pulse'>
          Loading quiz...
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white flex justify-center px-4 md:py-32'>
      <div className='w-full max-w-4xl space-y-10'>
        {showError && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl'>
            <div className='font-semibold'>
              {errorMessage || 'Something went wrong. Please try again.'}
            </div>
          </div>
        )}
        {!isLoading && questions && (
          <>
            <div className='flex items-center justify-center'>
              <div className='flex items-center gap-4 bg-gray-100 px-6 py-4 rounded-2xl shadow border border-gray-200'>
                <FileText className='w-7 h-7 text-gray-800' />
                <div className='flex'>
                  <span className='font-semibold md:text-xl text-gray-800'>
                    {documentName}
                  </span>
                </div>
              </div>
            </div>
            <h1 className='text-3xl md:text-4xl font-bold text-center text-gray-800'>
              Your Questions Are Ready!
            </h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                  Simulates real exam conditions. No hints or answers till the
                  end. Timed and strict.
                </p>
                <button
                  onClick={handleExamModeClick}
                  className='w-full bg-green-600 hover:bg-green-700 transition text-white py-3 px-5 rounded-xl text-lg font-medium cursor-pointer'
                >
                  Start Exam
                </button>
              </div>

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
                  Practice at your own pace. See hints and answers immediately
                  after each question.
                </p>
                <button
                  onClick={handleStudyStart}
                  className='w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 px-5 rounded-xl text-lg font-medium cursor-pointer'
                >
                  Start Study
                </button>
              </div>
            </div>
            <div className='flex items-center justify-center gap-4'>
              {/* Tailwind Button with MUI Menu */}
              <div>
                <button
                  onClick={handleDownloadClick}
                  className='w-full md:w-auto flex items-center justify-center cursor-pointer gap-2 bg-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200'
                >
                  <Download className='w-5 h-5' />
                  Download
                </button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleDownloadClose}
                  PaperProps={{
                    sx: {
                      borderRadius: '12px',
                      minWidth: '200px',
                      padding: '8px 0',
                      boxShadow:
                        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                      border: '1px solid rgb(229 231 235)',
                    },
                  }}
                  transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                  sx={{ marginTop: '6px' }}
                >
                  <MenuItem
                    onClick={() => handleQuizDownload('pdf')}
                    sx={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: 'rgb(55 65 81)',
                      '&:hover': {
                        backgroundColor: 'rgb(249 250 251)',
                      },
                    }}
                  >
                    <div className='flex items-center w-full'>
                      <PdfIcon />
                      Download as PDF
                    </div>
                  </MenuItem>

                  <MenuItem
                    onClick={() => handleQuizDownload('docx')}
                    sx={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: 'rgb(55 65 81)',
                      '&:hover': {
                        backgroundColor: 'rgb(249 250 251)',
                      },
                    }}
                  >
                    <div className='flex items-center w-full'>
                      <DocxIcon />
                      Download as DOCX
                    </div>
                  </MenuItem>
                </Menu>
              </div>

              {/* Shareable Link Section */}
              <div className='w-full md:w-auto flex items-center justify-between border border-gray-200 rounded-xl px-5 py-3 bg-gray-50 gap-3 shadow-sm'>
                <div className='flex items-center gap-2 text-gray-500 text-sm'>
                  <LinkIcon className='w-4 h-4' />
                  Shareable Link
                </div>
                <Lock className='w-4 h-4 text-gray-400' />
              </div>
            </div>

            <ExamSettingsModal
              open={examModalOpen}
              onClose={handleCloseExamModal}
              onStartExam={handleExamStart}
              documentName={documentName || ''}
              questionCount={questions?.length || 0}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GeneratedQuiz;
