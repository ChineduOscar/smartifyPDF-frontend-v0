import React from 'react';
import { FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='bg-gray-50 py-8 border-t border-gray-200'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='flex items-center mb-4 md:mb-0'>
            <div className='bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg mr-3'>
              <FileText className='h-5 w-5 text-white' />
            </div>
            <span className='text-gray-600 font-medium'>
              © 2025 SmartifyPDF. Transform your PDFs into smart exam questions.
            </span>
          </div>
          <div className='flex space-x-6 text-sm text-gray-500'>
            <a href='#' className='hover:text-gray-700 transition-colors'>
              Privacy Policy
            </a>
            <a href='#' className='hover:text-gray-700 transition-colors'>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
