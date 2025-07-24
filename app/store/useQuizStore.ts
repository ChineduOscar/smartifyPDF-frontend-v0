import { create } from 'zustand';

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
  setQuizData: (
    quizId: string,
    documentName: string,
    questions: Question[]
  ) => void;
  clearQuizData: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  quizId: null,
  documentName: '',
  createdAt: '',
  questions: [],
  setQuizData: (quizId, documentName, questions) =>
    set({ quizId, documentName, questions }),
  clearQuizData: () => set({ quizId: null, documentName: '', questions: [] }),
}));
