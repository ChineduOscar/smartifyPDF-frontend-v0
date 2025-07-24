'use client';

import { useState } from 'react';
import { CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizStore } from '../../store/useQuizStore';

const Study = () => {
  const { quizId, documentName, questions } = useQuizStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >({});

  const currentQuestion = questions[currentPage - 1];
  const totalQuestions = questions.length;

  const handleOptionClick = (optionIndex: number) => {
    setSelectedOptions({ ...selectedOptions, [currentPage]: optionIndex });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalQuestions) setCurrentPage(page);
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

  return (
    <div className='min-h-screen bg-white px-4 md:py-12'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Question */}
        <div className='mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800 leading-relaxed mb-2'>
            {currentQuestion?.question}
          </h2>
          <div className='text-sm text-gray-500 font-medium mb-8'>
            {Object.keys(selectedOptions).length} / {totalQuestions} answered
          </div>

          {/* Options */}
          <div className='space-y-4'>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={hasAnswered}
                className={`w-full text-left border-2 px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-between
                  ${getOptionClass(index)}`}
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

        {/* Explanation */}
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

        {/* Navigation Buttons */}
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

        {/* Question Numbers Grid */}
        <div className=' p-6 border border-gray-100'>
          <div className='grid grid-cols-5 md:grid-cols-10 gap-3'>
            {questions.map((_, i) => {
              const questionNumber = i + 1;
              const isAnswered = selectedOptions[questionNumber] !== undefined;
              const isCurrent = currentPage === questionNumber;

              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(questionNumber)}
                  className={`aspect-square rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105
                    ${
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

        {/* Submit Button */}
        <div className='text-center'>
          <button
            className='px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={Object.keys(selectedOptions).length < totalQuestions}
          >
            Submit Exam ({Object.keys(selectedOptions).length}/{totalQuestions})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Study;
