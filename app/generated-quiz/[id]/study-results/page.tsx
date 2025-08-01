'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuizStore } from '../../../store/useQuizStore';
import { useStudyStore } from '@/app/store/useStudyStore';
import { CheckCircle, X, Trophy, RotateCcw, Home } from 'lucide-react';
import { showToast } from '@/app/utils/toast';

const StudyResults = () => {
  const params = useParams();
  const router = useRouter();
  const quizIdFromUrl = params?.id as string;
  const { clearQuizData } = useQuizStore();
  const { resetStudy } = useStudyStore();

  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resultData, setResultData] = useState<null | {
    score: number;
    percentage: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    questions: any[];
    documentName?: string;
  }>(null);

  useEffect(() => {
    clearQuizData();
    resetStudy();

    // Prevent Back Navigation
    const blockBackNavigation = () => {
      history.pushState(null, '', location.href);
    };

    blockBackNavigation();
    window.addEventListener('popstate', blockBackNavigation);

    const fetchResult = async () => {
      try {
        const resultRes = await fetch(
          `http://localhost:3333/quiz/${quizIdFromUrl}/results?mode=study`
        );
        if (!resultRes.ok)
          showToast(
            'Failed to fetch result. Please refresh and try again.',
            'error'
          );
        const data = await resultRes.json();

        setResultData({
          score: data.score,
          percentage: data.percentage,
          totalQuestions: data.totalQuestions,
          correctAnswers: data.correctAnswers,
          incorrectAnswers: data.incorrectAnswers,
          questions: data.questions || [],
          documentName: data.documentName || 'Quiz App',
        });
      } catch (err) {
        console.error(err);
        router.push(`/generated-quiz/${quizIdFromUrl}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();

    return () => {
      window.removeEventListener('popstate', blockBackNavigation);
    };
  }, [quizIdFromUrl, router, clearQuizData, resetStudy]);

  if (isLoading || !resultData) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='text-gray-500 text-lg font-semibold animate-pulse'>
          Loading results...
        </div>
      </div>
    );
  }

  const {
    percentage,
    totalQuestions,
    correctAnswers,
    questions,
    documentName,
  } = resultData;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-primary-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (percentage >= 80) return 'bg-primary-50';
    if (percentage >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const handleRetakeQuiz = () => {
    router.push(`/generated-quiz/${quizIdFromUrl}`);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className='min-h-screen bg-white px-4 md:py-20'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Results Header */}
        <div className='text-center space-y-4'>
          <div className='flex justify-center mb-6'>
            <div className='relative'>
              <Trophy className='w-20 h-20 text-primary-500' />
              <div className='absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg'>
                <CheckCircle className='w-8 h-8 text-primary-500' />
              </div>
            </div>
          </div>
          <h1 className='text-4xl font-bold text-gray-800'>Congratulations!</h1>
          <p className='text-xl text-gray-600'>
            You have completed the quiz successfully!
          </p>
        </div>

        {/* Score Card */}
        <div className={`rounded-2xl border p-8 ${getScoreBgColor()}`}>
          <div className='text-center space-y-4'>
            <h2 className='text-2xl font-semibold text-gray-800'>Your Score</h2>
            <div className={`text-6xl font-bold ${getScoreColor()}`}>
              {Math.round(percentage)}%
            </div>
            <div className='text-xl text-gray-700'>
              <span className='font-semibold'>{correctAnswers}</span> out of{' '}
              <span className='font-semibold'>{totalQuestions}</span> questions
              correct
            </div>
            <div className='w-full bg-gray-200 rounded-full h-4 mt-4'>
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  percentage >= 80
                    ? 'bg-primary-500'
                    : percentage >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-center gap-2 md:gap-4'>
          <button
            onClick={() => setShowSummary(!showSummary)}
            className='flex items-center gap-2 px-6 py-3 text-sm md:text-base rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-primary-500 hover:from-primary-600 hover:to-indigo-700 transition-shadow shadow-md hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer'
          >
            {showSummary ? 'Hide' : 'Show'} Summary
          </button>
        </div>

        {/* Question Summary */}
        {showSummary && questions && questions.length > 0 && (
          <div className='bg-white rounded-2xl shadow-lg md:p-8 space-y-6'>
            <h3 className='text-2xl font-bold text-gray-800 text-center'>
              Quiz Summary
            </h3>
            <div className='space-y-6'>
              {questions.map((questionResult, index) => {
                const selectedOption = questionResult.selectedOptionIndex;
                const isCorrect = questionResult.isCorrect;

                return (
                  <div
                    key={questionResult.id}
                    className={`border-2 rounded-xl p-6 ${
                      isCorrect
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className='flex items-start gap-3 mb-4'>
                      {isCorrect ? (
                        <CheckCircle className='w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0' />
                      ) : (
                        <X className='w-6 h-6 text-red-600 mt-0.5 flex-shrink-0' />
                      )}
                      <div className='flex-1'>
                        <h4 className='font-semibold text-gray-800 mb-2'>
                          Question {index + 1}: {questionResult.question}
                        </h4>

                        <div className='space-y-2 mb-4'>
                          {questionResult.options.map(
                            (option: string, optionIndex: number) => {
                              const isSelected = selectedOption === optionIndex;
                              const isCorrectAnswer =
                                optionIndex ===
                                questionResult.correctAnswerIndex;

                              let optionClass =
                                'px-4 py-2 rounded-lg border-2 ';
                              if (isCorrectAnswer) {
                                optionClass +=
                                  'bg-primary-100 border-primary-300 text-primary-800';
                              } else if (isSelected && !isCorrectAnswer) {
                                optionClass +=
                                  'bg-red-100 border-red-300 text-red-800';
                              } else {
                                optionClass +=
                                  'bg-gray-50 border-gray-200 text-gray-700';
                              }

                              return (
                                <div key={optionIndex} className={optionClass}>
                                  <div className='flex items-center justify-between'>
                                    <span>
                                      <strong>
                                        {String.fromCharCode(65 + optionIndex)}.
                                      </strong>{' '}
                                      {option}
                                    </span>
                                    <div className='flex gap-2'>
                                      {isSelected && (
                                        <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                                          Your Answer
                                        </span>
                                      )}
                                      {isCorrectAnswer && (
                                        <span className='text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded'>
                                          Correct
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>

                        {selectedOption === null && (
                          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4'>
                            <p className='text-yellow-800 text-sm font-medium'>
                              ⚠️ No answer provided for this question
                            </p>
                          </div>
                        )}

                        {questionResult.explanation && (
                          <div className='bg-gray-100 rounded-lg p-4'>
                            <h5 className='font-semibold text-gray-800 mb-2'>
                              Explanation:
                            </h5>
                            <p className='text-gray-700'>
                              {questionResult.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className='flex flex-wrap justify-center gap-4'>
          <button
            onClick={handleRetakeQuiz}
            className='flex items-center text-sm md:text-base gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-shadow shadow-md hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer'
          >
            <RotateCcw className='w-5 h-5' />
            Retake Quiz
          </button>
          <button
            onClick={handleGoHome}
            className='flex items-center text-sm md:text-base gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 border border-gray-300 transition-shadow shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer'
          >
            <Home className='w-5 h-5' />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyResults;
