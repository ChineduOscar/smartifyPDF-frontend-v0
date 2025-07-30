'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizStore } from '../../store/useQuizStore';
import { useExamStore } from '@/app/store/useExamStore';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const Study = () => {
  const params = useParams();
  const router = useRouter();
  const { setQuizData, quizId, documentName, questions } = useQuizStore();
  const {
    selectedOptions,
    currentPage,
    isTimedExam,
    timeLimit,
    timeUnit,
    examStartTime,
    setSelectedOption,
    setCurrentPage,
    setCompleted,
    setExamStartTime,
    resetExam,
  } = useExamStore();

  const quizIdFromUrl = params?.id as string;
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);

  console.log(questions);
  const currentQuestion = questions[currentPage - 1];
  const totalQuestions = questions.length;

  // Calculate time remaining based on start time
  const calculateTimeRemaining = useCallback(() => {
    if (!isTimedExam || !examStartTime) return 0;

    const totalTimeInSeconds =
      timeUnit === 'hours' ? timeLimit * 3600 : timeLimit * 60;
    const elapsedTime = Math.floor((Date.now() - examStartTime) / 1000);
    const remaining = Math.max(0, totalTimeInSeconds - elapsedTime);

    return remaining;
  }, [isTimedExam, examStartTime, timeLimit, timeUnit]);

  // Initialize timer when exam starts
  useEffect(() => {
    if (questions.length > 0 && !examStartTime) {
      const startTime = Date.now();
      setExamStartTime(startTime);
      setTimeRemaining(calculateTimeRemaining());
      setExamStarted(true);
    } else if (examStartTime) {
      // Exam already started, calculate current time remaining
      setTimeRemaining(calculateTimeRemaining());
      setExamStarted(true);
    }
  }, [
    questions.length,
    examStartTime,
    setExamStartTime,
    calculateTimeRemaining,
  ]);

  // Timer countdown effect
  useEffect(() => {
    if (!isTimedExam || !examStarted || !examStartTime) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        // Time's up - auto submit
        handleSubmitExam();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimedExam, examStarted, examStartTime, calculateTimeRemaining]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

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

  const handleOptionClick = (optionIndex: number) => {
    setSelectedOption(currentPage, optionIndex);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalQuestions) setCurrentPage(page);
  };

  const handleSubmitExam = () => {
    setCompleted(true);
    const submissionPayload = {
      quizId: quizIdFromUrl,
      mode: 'exam',
      answers: Object.entries(selectedOptions).map(
        ([questionNumber, selectedIndex]) => {
          const question = questions[parseInt(questionNumber) - 1];

          return {
            questionId: question.id,
            selectedOptionIndex: selectedIndex,
            correctOptionIndex: question.correctAnswer,
          };
        }
      ),
      submittedAt: new Date().toISOString(),
    };

    console.log(submissionPayload);
    resetExam();
    // router.push(`/generated-quiz/${quizIdFromUrl}/exam-results`);
  };

  const getOptionClass = (optionIndex: number) => {
    const selectedOption = selectedOptions[currentPage];
    if (selectedOption === undefined) {
      return 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50';
    }

    if (optionIndex === selectedOption) {
      return 'bg-primary-500 text-white border-primary-500';
    }

    return 'bg-gray-100 text-gray-500 border-gray-200';
  };

  const hasAnswered = selectedOptions[currentPage] !== undefined;
  const totalAnswered = Object.keys(selectedOptions).length;

  // Time warning colors
  const getTimeWarningClass = () => {
    return timeRemaining <= 60 ? 'text-red-500 animate-pulse' : 'text-red-500';
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
    <div className='min-h-screen bg-white px-4 md:py-12 relative'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {showError && !currentQuestion && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl'>
            <div className='font-semibold'>
              {errorMessage || 'Something went wrong. Please try again.'}
            </div>
          </div>
        )}

        {!isLoading && currentQuestion && (
          <>
            <div className='mb-6'>
              <h2 className='text-2xl font-semibold text-gray-800 leading-relaxed mb-2'>
                Question {currentPage} of {totalQuestions}
              </h2>
              <h3 className='text-xl text-gray-700 leading-relaxed mb-4'>
                {currentQuestion.question}
              </h3>
              <div className='text-sm text-gray-500 font-medium mb-8'>
                {totalAnswered} / {totalQuestions} answered
              </div>

              <div className='space-y-4'>
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    className={`w-full text-left border-2 px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-between ${getOptionClass(
                      index
                    )}`}
                  >
                    <div className='flex items-center'>
                      <span className='w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center text-sm font-bold bg-white text-gray-600'>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className='flex justify-between items-center'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700'
              >
                <ChevronLeft className='w-4 h-4' />
                Previous
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalQuestions}
                className='flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700'
              >
                Next
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>

            <div className='p-6 border border-gray-100 rounded-xl'>
              <div className='grid grid-cols-5 md:grid-cols-10 gap-3'>
                {questions.map((_, i) => {
                  const questionNumber = i + 1;
                  const isAnswered =
                    selectedOptions[questionNumber] !== undefined;
                  const isCurrent = currentPage === questionNumber;

                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(questionNumber)}
                      className={`aspect-square rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 ${
                        isCurrent
                          ? 'bg-primary-500 text-white shadow-lg'
                          : isAnswered
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                      }`}
                    >
                      {questionNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className='text-center'>
              <button
                onClick={handleSubmitExam}
                className='px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                // disabled={totalAnswered < totalQuestions}
              >
                Submit Exam ({totalAnswered}/{totalQuestions})
              </button>
              {totalAnswered < totalQuestions && (
                <p className='text-sm text-gray-500 mt-2'>
                  Please answer all questions before submitting
                </p>
              )}
            </div>
          </>
        )}

        {/* Floating Timer */}
        {!isLoading && currentQuestion && isTimedExam && (
          <div className='absolute top-6 left-6 z-50 bg-white border-2 border-gray-200 rounded-xl p-3 shadow-lg'>
            <div className='flex items-center gap-2'>
              <Clock
                className={`w-4 h-4 md:w-6 md:h-6 ${getTimeWarningClass()}`}
              />
              <div
                className={`text-base md:text-2xl font-bold ${getTimeWarningClass()}`}
              >
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Study;
