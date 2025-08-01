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

interface ExamState {
  selectedOptions: Record<number, number>;
  isCompleted: boolean;
  currentPage: number;
  isTimedExam: boolean;
  timeLimit: number;
  timeUnit: 'minutes' | 'hours';
  examStartTime: number | null;
  examQuizId: string | null;
  setExamQuizId: (id: string | null) => void;
  setCurrentPage: (page: number) => void;
  setExamSettings: (settings: {
    isTimedExam: boolean;
    timeLimit: number;
    timeUnit: 'minutes' | 'hours';
  }) => void;
  setSelectedOption: (questionNumber: number, optionIndex: number) => void;
  setCompleted: (completed: boolean) => void;
  setExamStartTime: (startTime: number | null) => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      selectedOptions: {},
      isCompleted: false,
      currentPage: 1,
      isTimedExam: false,
      timeLimit: 10,
      timeUnit: 'minutes',
      examStartTime: null,
      examQuizId: null,

      setExamQuizId: (id) => set({ examQuizId: id }),

      setCurrentPage: (page) => set({ currentPage: page }),

      setExamSettings: ({ isTimedExam, timeLimit, timeUnit }) =>
        set({ isTimedExam, timeLimit, timeUnit }),

      setSelectedOption: (questionNumber, optionIndex) =>
        set((state) => ({
          selectedOptions: {
            ...state.selectedOptions,
            [questionNumber]: optionIndex,
          },
        })),

      setCompleted: (completed) => set({ isCompleted: completed }),

      setExamStartTime: (startTime) => set({ examStartTime: startTime }),

      resetExam: () =>
        set({
          selectedOptions: {},
          isCompleted: false,
          isTimedExam: false,
          timeLimit: 0,
          timeUnit: 'minutes',
          examStartTime: null,
          currentPage: 1,
          examQuizId: null,
        }),
    }),
    {
      name: 'exam-storage',
      partialize: (state) => ({
        selectedOptions: state.selectedOptions,
        isCompleted: state.isCompleted,
        currentPage: state.currentPage,
        isTimedExam: state.isTimedExam,
        timeLimit: state.timeLimit,
        timeUnit: state.timeUnit,
        examStartTime: state.examStartTime,
        examQuizId: state.examQuizId,
      }),
    }
  )
);
