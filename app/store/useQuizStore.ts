import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Question {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizState {
  quizId: string | null;
  documentName: string;
  questions: Question[];
  selectedOptions: Record<number, number>;
  isCompleted: boolean;
  setQuizData: (
    quizId: string,
    documentName: string,
    questions: Question[]
  ) => void;
  setSelectedOption: (questionNumber: number, optionIndex: number) => void;
  setCompleted: (completed: boolean) => void;
  clearQuizData: () => void;
  getScore: () => { correct: number; total: number; percentage: number };
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizId: null,
      documentName: '',
      questions: [],
      selectedOptions: {},
      isCompleted: false,
      setQuizData: (quizId, documentName, questions) =>
        set({ quizId, documentName, questions }),
      setSelectedOption: (questionNumber, optionIndex) =>
        set((state) => ({
          selectedOptions: {
            ...state.selectedOptions,
            [questionNumber]: optionIndex,
          },
        })),
      setCompleted: (completed) => set({ isCompleted: completed }),
      clearQuizData: () =>
        set({
          quizId: null,
          documentName: '',
          questions: [],
          selectedOptions: {},
          isCompleted: false,
        }),
      getScore: () => {
        const state = get();
        const correct = state.questions.reduce((count, question, index) => {
          const questionNumber = index + 1;
          const selectedOption = state.selectedOptions[questionNumber];
          return selectedOption === question.correctAnswer ? count + 1 : count;
        }, 0);
        const total = state.questions.length;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        return { correct, total, percentage };
      },
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        quizId: state.quizId,
        documentName: state.documentName,
        questions: state.questions,
        selectedOptions: state.selectedOptions,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
