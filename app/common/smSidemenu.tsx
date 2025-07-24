'use client';

import React, { useState } from 'react';
import { Upload, User, Crown, Menu, X } from 'lucide-react';

const SmSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chats = [
    { id: 1, name: 'lead developer.pdf' },
    { id: 2, name: 'finding ade.pdf' },
    { id: 3, name: 'chidera.doc' },
  ];

  return (
    <div className='md:hidden'>
      {/* Hamburger Icon */}
      <button onClick={() => setIsOpen(true)} className='z-50 p-2 mx-4 my-2'>
        <Menu className='w-6 h-6 text-gray-800' />
      </button>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>S</span>
            </div>
            <h1 className='text-lg font-bold text-gray-800'>SmartifyPDF</h1>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X className='w-5 h-5 text-gray-800' />
          </button>
        </div>

        {/* Menu Content */}
        <div className='flex-1 overflow-y-auto p-4'>
          {/* Upload */}
          <div className='mb-4'>
            <div className='flex items-center gap-3 py-2 px-3 bg-primary-200 rounded-lg cursor-pointer'>
              <Upload className='w-5 h-5 text-primary-900' />
              <span className='font-medium text-primary-900'>Upload PDF</span>
            </div>
          </div>

          {/* Chats */}
          <div className='mb-6'>
            <h3 className='text-sm font-semibold text-gray-500 uppercase mb-2'>
              Chats
            </h3>
            <div className='space-y-2'>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className='cursor-pointer hover:bg-gray-50 p-3 rounded-lg flex items-center'
                >
                  <span className='text-gray-700 text-sm truncate'>
                    {chat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Menu */}
        <div className='border-t border-gray-200 p-4 space-y-2'>
          <div className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg'>
            <div className='w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center'>
              <User className='w-4 h-4 text-white' />
            </div>
            <span className='text-gray-800 font-medium'>My Profile</span>
          </div>

          <div className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg'>
            <Crown className='w-5 h-5 text-yellow-500' />
            <span className='text-gray-800 font-medium'>
              Upgrade your account
            </span>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/30 z-30'
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SmSidebar;
