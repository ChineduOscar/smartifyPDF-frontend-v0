'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, Minus, Plus } from 'lucide-react';
import { useQuizStore } from './store/useQuizStore';
import { useRouter } from 'next/navigation';
import { showToast } from './utils/toast';

interface QuizSettings {
  questionCount: number;
  difficulty: 'auto' | 'easy' | 'medium' | 'hard';
}

const SmartifyHomePage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    setQuizData,
    clearQuizData,
    setNewQuizAdded,
    setTriggerFileDialog,
    triggerFileDialog,
  } = useQuizStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    questionCount: 10,
    difficulty: 'auto',
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };
  const handleGenerateQuiz = async () => {
    if (!selectedFile) {
      showToast('Please upload a PDF file first', 'error');
      return;
    }

    setIsGenerating(true);
    clearQuizData();

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('noOfQuestions', quizSettings.questionCount.toString());
      formData.append('difficultyLevel', quizSettings.difficulty);

      const response = await fetch(
        'http://localhost:3333/documents/upload-and-generate',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response?.ok) {
        const { data: quizData } = await response.json();
        setQuizData(quizData?.id, quizData?.documentName, quizData?.questions);
        router.push(`/generated-quiz/${quizData?.id}`);
        setNewQuizAdded(true);
      } else {
        showToast(
          'Failed to generate quiz. Please refresh and try again.',
          'error'
        );
      }
    } catch (error) {
      showToast(
        'Failed to generate quiz. Please refresh and try again.',
        'error'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (triggerFileDialog) {
      fileInputRef.current?.click();
      setTriggerFileDialog(false);
    }
  }, [triggerFileDialog]);

  const incrementQuestionCount = () => {
    setQuizSettings((prev) => ({
      ...prev,
      questionCount: Math.min(prev.questionCount + 1, 100),
    }));
  };

  const decrementQuestionCount = () => {
    setQuizSettings((prev) => ({
      ...prev,
      questionCount: Math.max(prev.questionCount - 1, 10),
    }));
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuizSettings((prev) => ({
      ...prev,
      difficulty: e.target.value as QuizSettings['difficulty'],
    }));
  };

  const difficultyOptions = [
    { key: 'auto', title: 'Auto (Smart Mix)' },
    { key: 'beginner', title: 'Beginner' },
    { key: 'intermediate', title: 'Intermediate' },
    { key: 'advanced', title: 'Advanced' },
  ];

  const getReadableSize = (size: number) => {
    return size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <div className='min-h-screen bg-white flex items-center justify-center px-4 md:py-8'>
        <div className='w-full max-w-4xl'>
          {/* Hero */}
          <div className='text-center mb-6 md:mb-8'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4 text-black leading-tight'>
              Generate quizzes from PDFs instantly
            </h1>
            <p className='md:text-lg text-gray-600 max-w-2xl mx-auto'>
              Great for students, teachers, and professionals. Generate smart
              questions fast and practice in real exam-like conditions.
            </p>
          </div>

          {/* Upload Section */}
          <div className='bg-white rounded-2xl border border-gray-200 mb-6'>
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragOver
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className='flex justify-center mb-4'>
                <File className='w-12 h-12 text-gray-500' />
              </div>
              {selectedFile ? (
                <div className='text-gray-800 font-medium'>
                  <p className='text-black text-base font-semibold mb-1'>
                    {selectedFile.name}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {getReadableSize(selectedFile.size)}
                  </p>
                </div>
              ) : (
                <div className='text-base text-gray-700 mb-2'>
                  <span className='text-black font-semibold'>
                    Click to upload
                  </span>{' '}
                  or{' '}
                  <span className='text-black font-semibold'>
                    drag your PDF here
                  </span>
                </div>
              )}
              <button
                className='mt-6 bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition-all duration-200 flex items-center gap-2 mx-auto'
                type='button'
              >
                <Upload className='w-4 h-4' />
                {selectedFile ? 'Change PDF' : 'Upload PDF'}
              </button>
              <input
                ref={fileInputRef}
                type='file'
                id='file-input'
                accept='.pdf'
                onChange={handleFileSelect}
                className='hidden'
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateQuiz}
            disabled={!selectedFile || isGenerating}
            className={`w-full py-4 px-8 rounded-xl text-lg font-semibold text-white transition-all duration-300 mb-6 ${
              isGenerating || !selectedFile
                ? 'bg-primary-500 opacity-60 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 hover:-translate-y-0.5 shadow-lg hover:shadow-green-500/30'
            }`}
          >
            {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>

          {/* Settings Row */}
          <div className='flex flex-col md:flex-row justify-between gap-6'>
            {/* Question Count with Buttons */}
            <div className='w-full md:w-1/2'>
              <label className='block text-gray-700 font-medium text-sm md:text-base mb-2'>
                Number of Questions
              </label>
              <div className='flex items-center gap-4'>
                <button
                  type='button'
                  onClick={decrementQuestionCount}
                  className='w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 transition'
                >
                  <Minus className='w-5 h-5 text-gray-600' />
                </button>

                <div className='w-16 h-16 rounded-lg border-2 bg-white flex items-center justify-center text-xl font-bold text-primary-600 shadow-sm'>
                  {quizSettings.questionCount}
                </div>

                <button
                  type='button'
                  onClick={incrementQuestionCount}
                  className='w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 transition'
                >
                  <Plus className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <p className='text-sm text-gray-500 mt-1'>
                You can select between 10 and 100 questions.
              </p>
            </div>

            {/* Difficulty Dropdown */}
            <div className='w-full md:w-1/2'>
              <label className='block text-gray-700 font-medium text-sm md:text-base mb-2'>
                Difficulty Level
              </label>
              <select
                value={quizSettings.difficulty}
                onChange={handleDifficultyChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-primary-500 transition-all'
              >
                {difficultyOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmartifyHomePage;
