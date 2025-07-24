'use client';

import React, { useState } from 'react';
import Sidebar from './common/sidemenu';
import SmSidebar from './common/smSidemenu';
import Footer from './common/footer';

const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const layoutMargin = isSidebarOpen ? 'md:ml-64' : 'md:ml-18';

  return (
    <>
      <div className='md:hidden'>
        <SmSidebar />
      </div>

      <div className='hidden md:block'>
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen(!isSidebarOpen)}
        />
      </div>

      <div className={`min-h-screen bg-white ${layoutMargin}`}>
        {children}
        <Footer />
      </div>
    </>
  );
};

export default LayoutShell;
