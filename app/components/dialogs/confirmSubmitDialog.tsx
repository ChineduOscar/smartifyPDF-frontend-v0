'use client';

import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmSubmitDialogProps {
  open: boolean;
  unansweredCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmSubmitDialog = ({
  open,
  unansweredCount,
  onCancel,
  onConfirm,
}: ConfirmSubmitDialogProps) => {
  if (!open) return null;

  return (
    <>
      <div className='fixed inset-0 bg-black/30 z-50 flex items-center justify-center'>
        <div className='bg-white/90 border border-gray-200 rounded-xl shadow-2xl max-w-xs md:max-w-md w-full p-2'>
          <div className='px-4 py-3 border-b border-gray-100/80'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center'>
                  <CheckCircle2 className='w-3 h-3 text-blue-600' />
                </div>
                <div>
                  <h2 className='text-sm md:text-base font-bold text-gray-900'>
                    Submit Exam
                  </h2>
                </div>
              </div>
              <button
                onClick={onCancel}
                className='p-1 hover:bg-gray-100 rounded-full transition-colors'
              >
                <X className='w-4 h-4 text-gray-500' />
              </button>
            </div>
          </div>

          <div className='px-4 py-3 space-y-3'>
            {unansweredCount > 0 && (
              <div className='bg-amber-50/60 border border-amber-200 rounded-lg p-3'>
                <div className='flex items-center gap-2'>
                  <AlertTriangle className='w-5 h-5 text-amber-600' />
                  <div>
                    <div className='text-sm font-medium text-red-800'>
                      {unansweredCount} question
                      {unansweredCount !== 1 ? 's' : ''} left unanswered
                    </div>
                    <div className='text-sm text-amber-700'>
                      These will be marked as incorrect
                    </div>
                  </div>
                </div>
              </div>
            )}

            {unansweredCount === 0 && (
              <div className='bg-green-50/60 border border-green-200 rounded-lg p-3'>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='w-5 h-5 text-green-600' />
                  <div className='font-medium text-green-900'>
                    All questions answered! Ready to submit.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='px-4 py-3 bg-gray-50/60 rounded-b-xl flex gap-2'>
            <button
              onClick={onCancel}
              className='flex-1 px-3 py-3 text-gray-600 bg-white/60 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white/80 hover:border-gray-300 transition-all cursor-pointer'
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className='flex-1 px-3 py-3 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm cursor-pointer'
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmSubmitDialog;
