'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
} from '@mui/material';
import { Clock, Timer, ShieldCheck, X, CheckCircle } from 'lucide-react';

interface ExamSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onStartExam: (settings: ExamSettings) => void;
  documentName: string;
  questionCount: number;
}

export interface ExamSettings {
  isTimedExam: boolean;
  timeLimit: number;
  timeUnit: 'minutes' | 'hours';
}

const ExamSettingsModal: React.FC<ExamSettingsModalProps> = ({
  open,
  onClose,
  onStartExam,
  documentName,
  questionCount,
}) => {
  const [isTimedExam, setIsTimedExam] = useState(true);
  const [timeLimit, setTimeLimit] = useState(10);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');

  const handleStartExam = () => {
    const settings: ExamSettings = {
      isTimedExam,
      timeLimit: isTimedExam ? timeLimit : 0,
      timeUnit,
    };
    onStartExam(settings);
  };

  const getTotalMinutes = () => {
    if (!isTimedExam) return 0;
    return timeUnit === 'hours' ? timeLimit * 60 : timeLimit;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '8px',
          maxWidth: '500px',
        },
      }}
    >
      <DialogTitle sx={{ padding: '24px 24px 16px 24px' }}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div>
              <h2 className='text-xl font-semibold text-gray-800'>
                Exam Settings
              </h2>
              <p className='text-sm text-gray-500 mt-1'>
                Configure your exam preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>
      </DialogTitle>

      <DialogContent sx={{ padding: '0 24px' }}>
        <div className='space-y-6'>
          {/* Document Info */}
          <div className='bg-gray-50 p-4 rounded-xl border border-gray-200'>
            <div className='flex items-center gap-3 mb-2'>
              <span className='font-medium text-gray-800'>Exam Details</span>
            </div>
            <div className='text-sm text-gray-600 space-y-1'>
              <p>
                <strong>Questions:</strong> {questionCount}
              </p>
            </div>
          </div>

          {/* <Divider /> */}

          {/* Timer Settings */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Timer className='w-5 h-5 text-blue-600' />
                <div>
                  <h3 className='font-medium text-gray-800'>Timed Exam</h3>
                  <p className='text-sm text-gray-500'>
                    Set a time limit for this exam
                  </p>
                </div>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={isTimedExam}
                    onChange={(e) => setIsTimedExam(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#10B981',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          backgroundColor: '#10B981',
                        },
                    }}
                  />
                }
                label=''
              />
            </div>

            {isTimedExam && (
              <div className='bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-4'>
                <div className='flex items-center gap-2'>
                  <Clock className='w-4 h-4 text-blue-600' />
                  <span className='text-sm font-medium text-blue-800'>
                    Time Configuration
                  </span>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <TextField
                    label='Time Limit'
                    type='number'
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    inputProps={{
                      min: 1,
                      max: timeUnit === 'hours' ? 10 : 300,
                    }}
                    size='small'
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                      },
                    }}
                  />
                  <TextField
                    select
                    label='Unit'
                    value={timeUnit}
                    onChange={(e) =>
                      setTimeUnit(e.target.value as 'minutes' | 'hours')
                    }
                    size='small'
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                      },
                    }}
                  >
                    <MenuItem value='minutes'>Minutes</MenuItem>
                    <MenuItem value='hours'>Hours</MenuItem>
                  </TextField>
                </div>

                <div className='text-xs text-blue-600 bg-white p-2 rounded border border-blue-200'>
                  <strong>Total time:</strong> {getTotalMinutes()} minutes
                </div>
              </div>
            )}

            {!isTimedExam && (
              <div className='bg-gray-50 p-4 rounded-xl border border-gray-200'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <CheckCircle className='w-4 h-4' />
                  <span className='text-sm'>
                    No time limit - Take as long as you need
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Exam Mode Info */}
          <div className='bg-yellow-50 p-4 rounded-xl border border-yellow-200'>
            <h4 className='font-medium text-yellow-800 mb-2'>
              Exam Mode Rules:
            </h4>
            <ul className='text-sm text-yellow-700 space-y-1'>
              <li>• No hints or explanations during the exam</li>
              <li>• Cannot go back to previous questions</li>
              <li>• All answers must be submitted at once</li>
              <li>• Results shown only at the end</li>
            </ul>
          </div>
        </div>
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px 24px 24px' }}>
        <div className='flex gap-3 w-full'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors text-xs md:text-base'
          >
            Cancel
          </button>
          <button
            onClick={handleStartExam}
            className='flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-xs md:text-base'
          >
            <ShieldCheck className='w-4 h-4' />
            Start Exam
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ExamSettingsModal;
