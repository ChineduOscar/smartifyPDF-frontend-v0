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

interface StudyState {
  selectedOptions: Record<number, number>;
  isCompleted: boolean;
  showCorrectAnswers: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setSelectedOption: (questionNumber: number, optionIndex: number) => void;
  setCompleted: (completed: boolean) => void;
  resetStudy: () => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      selectedOptions: {},
      isCompleted: false,
      showCorrectAnswers: true,
      currentPage: 1,

      setCurrentPage: (page) => set({ currentPage: page }),

      setSelectedOption: (questionNumber, optionIndex) =>
        set((state) => ({
          selectedOptions: {
            ...state.selectedOptions,
            [questionNumber]: optionIndex,
          },
        })),

      setCompleted: (completed) => set({ isCompleted: completed }),

      resetStudy: () =>
        set({
          selectedOptions: {},
          isCompleted: false,
          showCorrectAnswers: true,
          currentPage: 1,
        }),
    }),
    {
      name: 'study-storage',
      partialize: (state) => ({
        selectedOptions: state.selectedOptions,
        isCompleted: state.isCompleted,
        currentPage: state.currentPage,
      }),
    }
  )
);
