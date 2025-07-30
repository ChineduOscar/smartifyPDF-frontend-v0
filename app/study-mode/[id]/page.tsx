'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizStore } from '../../store/useQuizStore';
import { useStudyStore } from '@/app/store/useStudyStore';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ConfirmSubmitDialog from '@/app/components/dialogs/confirmSubmitDialog';

const StudyMode = () => {
  const params = useParams();
  const router = useRouter();
  const { setQuizData, quizId, questions } = useQuizStore();
  const {
    selectedOptions,
    currentPage,
    setSelectedOption,
    setCompleted,
    setCurrentPage,
    resetStudy,
  } = useStudyStore();

  const quizIdFromUrl = params?.id as string;
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);

  const currentQuestion = questions[currentPage - 1];
  const totalQuestions = questions.length;
  console.log(questions);
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
    const totalAnswered = Object.keys(selectedOptions).length;

    if (totalAnswered === 0) {
      setErrorMessage('Please answer at least one question before submitting.');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    const unanswered = totalQuestions - totalAnswered;

    if (unanswered > 0) {
      setUnansweredCount(unanswered);
      setShowConfirmDialog(true);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setCompleted(true);
    const submissionPayload = {
      quizId: quizIdFromUrl,
      mode: 'study',
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
    try {
      const res = await fetch(`http://localhost:3333/quiz/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload),
      });

      if (!res.ok) {
        throw new Error('Failed to submit quiz result');
      }
      const data = await res.json();
      console.log(data);

      resetStudy();
      router.push(`/generated-quiz/${quizIdFromUrl}/study-results`);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to submit result. Please try again.'
      );
    }
    // router.push(`/generated-quiz/${quizIdFromUrl}/study-results`);
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
        {showError && (
          <div className='fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-md z-50'>
            <div className='font-semibold text-center'>
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
                className='px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
              >
                Submit Exam ({totalAnswered}/{totalQuestions})
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmSubmitDialog
        open={showConfirmDialog}
        unansweredCount={unansweredCount}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          setShowConfirmDialog(false);
          handleFinalSubmit();
        }}
      />
    </div>
  );
};

export default StudyMode;
