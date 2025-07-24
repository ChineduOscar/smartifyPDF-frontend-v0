'use client';
import React, { useState } from 'react';
import { Menu, Upload, FileText, User, Crown, PanelLeft } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleToggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));

  // Sample chat data
  const chats = [
    { id: 1, name: 'lead developer.pdf', type: 'pdf' },
    { id: 2, name: 'finding ade.pdf', type: 'pdf' },
    { id: 3, name: 'chidera.doc', type: 'doc' },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`hidden fixed top-0 h-full bg-white border-r border-gray-200 transition-all duration-100 ease-in z-50 md:flex flex-col justify-between ${
          isOpen ? 'w-64' : 'w-18'
        }`}
      >
        <div>
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b border-gray-200 ${
              !isOpen ? 'justify-center' : ''
            }`}
          >
            <div
              className={`flex items-center gap-3 ${
                !isOpen ? 'justify-center w-full' : ''
              }`}
            >
              {/* Logo */}
              <div
                className='w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center cursor-pointer'
                onClick={handleToggle}
                aria-label='Toggle Sidebar'
              >
                <span className='text-white font-bold text-sm'>S</span>
              </div>

              {/* Name */}
              {isOpen && (
                <h1 className='text-xl font-bold text-gray-800'>SmartifyPDF</h1>
              )}
            </div>

            {/* Toggle Button */}
            {isOpen && (
              <button
                onClick={handleToggle}
                aria-label='Collapse Sidebar'
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <PanelLeft className='w-5 h-5 text-gray-600' />
              </button>
            )}
          </div>

          {/* Menu Items */}
          <div
            className={`overflow-hidden ${
              !isOpen ? 'flex flex-col items-center justify-center' : ''
            }`}
          >
            {!isOpen && (
              <button
                onClick={handleToggle}
                aria-label='Collapse Sidebar'
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <PanelLeft className='w-5 h-5 text-gray-600' />
              </button>
            )}
            {/* Upload PDF */}
            <div
              className={`p-4 border-b border-gray-100 ${
                !isOpen ? 'flex flex-col items-center' : ''
              }`}
            >
              <div
                className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-colors bg-primary-200 w-fit ${
                  !isOpen ? 'justify-center' : ''
                }`}
              >
                <Upload className='w-5 h-5 text-primary-900' />
                {isOpen && (
                  <span className='font-medium text-primary-900'>
                    Upload PDF
                  </span>
                )}
              </div>
            </div>

            {/* Chats Section */}
            {isOpen && (
              <div
                className={`p-4 ${!isOpen ? 'flex flex-col items-center' : ''}`}
              >
                <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3'>
                  Chats
                </h3>

                <div
                  className={`space-y-2 ${
                    !isOpen ? 'flex flex-col items-center gap-4' : ''
                  }`}
                >
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors flex items-center ${
                        !isOpen ? 'justify-center' : ''
                      }`}
                      title={chat.name}
                    >
                      {isOpen && (
                        <span className='text-gray-700 text-md truncate ml-2'>
                          {chat.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`border-t border-gray-200 p-4 space-y-2 ${
            !isOpen ? 'flex flex-col items-center' : ''
          }`}
        >
          {/* Profile */}
          <div
            className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors ${
              !isOpen ? 'justify-center' : ''
            }`}
          >
            <div className='w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0'>
              <User className='w-4 h-4 text-white' />
            </div>
            {isOpen && (
              <span className='text-gray-800 font-medium'>My Profile</span>
            )}
          </div>

          {/* Upgrade */}
          <div
            className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors ${
              !isOpen ? 'justify-center' : ''
            }`}
          >
            <Crown className='w-5 h-5 text-yellow-500 flex-shrink-0' />
            {isOpen && (
              <span className='text-gray-800 font-medium'>
                Upgrade your account
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
