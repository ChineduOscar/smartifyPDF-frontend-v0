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
  // To alert a refresh in the sidemenu once there is an upload in the home
  newQuizAdded: boolean;

  // To trigger a file upload in the home when the upload in sidemenu is clicked
  triggerFileDialog: boolean;

  setTriggerFileDialog: (val: boolean) => void;
  setQuizData: (
    quizId: string,
    documentName: string,
    questions: Question[]
  ) => void;
  clearQuizData: () => void;
  setNewQuizAdded: (value: boolean) => void;
}

export const useQuizStore = create<QuizState>()((set) => ({
  quizId: null,
  documentName: '',
  questions: [],
  newQuizAdded: false,
  triggerFileDialog: false,

  setTriggerFileDialog: (value) => set({ triggerFileDialog: value }),
  setQuizData: (quizId, documentName, questions) =>
    set({ quizId, documentName, questions }),
  clearQuizData: () => set({ quizId: null, documentName: '', questions: [] }),
  setNewQuizAdded: (value) => set({ newQuizAdded: value }),
}));
