'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizStore } from '../../store/useQuizStore';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const Study = () => {
  const params = useParams();
  const router = useRouter();
  const {
    setQuizData,
    quizId,
    documentName,
    questions,
    selectedOptions,
    setSelectedOption,
    setCompleted,
  } = useQuizStore();
  const quizIdFromUrl = params?.id as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log(questions);
  const currentQuestion = questions[currentPage - 1];
  const totalQuestions = questions.length;

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
    router.push(`/generated-quiz/${quizIdFromUrl}/results`);
  };

  const getOptionClass = (optionIndex: number) => {
    const selectedOption = selectedOptions[currentPage];
    if (selectedOption === undefined) {
      return 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50';
    }

    if (optionIndex === currentQuestion.correctAnswer) {
      return 'bg-primary-500 text-white border-primary-500';
    }

    if (
      optionIndex === selectedOption &&
      optionIndex !== currentQuestion.correctAnswer
    ) {
      return 'bg-red-500 text-white border-red-500';
    }

    return 'bg-gray-100 text-gray-500 border-gray-200';
  };

  const getOptionIcon = (optionIndex: number) => {
    const selectedOption = selectedOptions[currentPage];
    if (selectedOption === undefined) return null;

    if (optionIndex === currentQuestion.correctAnswer) {
      return <CheckCircle className='w-5 h-5' />;
    }

    if (
      optionIndex === selectedOption &&
      optionIndex !== currentQuestion.correctAnswer
    ) {
      return <X className='w-5 h-5' />;
    }

    return null;
  };

  const hasAnswered = selectedOptions[currentPage] !== undefined;
  const totalAnswered = Object.keys(selectedOptions).length;

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
    <div className='min-h-screen bg-white px-4 md:py-12'>
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
                {currentQuestion.question}
              </h2>
              <div className='text-sm text-gray-500 font-medium mb-8'>
                {totalAnswered} / {totalQuestions} answered
              </div>

              <div className='space-y-4'>
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={hasAnswered}
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
                    {getOptionIcon(index)}
                  </button>
                ))}
              </div>
            </div>

            {hasAnswered && (
              <div className='bg-primary-50 border-l-4 border-primary-500 rounded-md p-6'>
                <div className='flex items-start gap-3'>
                  <CheckCircle className='w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <h3 className='font-semibold text-primary-800 mb-2'>
                      Explanation:
                    </h3>
                    <p className='text-primary-700 leading-relaxed'>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

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

            <div className='p-6 border border-gray-100'>
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
                className='px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={totalAnswered < totalQuestions}
              >
                Submit Exam ({totalAnswered}/{totalQuestions})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Study;
