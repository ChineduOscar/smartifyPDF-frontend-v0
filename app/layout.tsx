import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutShell from './layoutShell';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

export const metadata: Metadata = {
  title: 'SmartifyPDF',
  description: 'Generate exam-like quizzes from your PDF instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <LayoutShell>{children}</LayoutShell>
        <ToastContainer
          position='top-center'
          autoClose={1500}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme='colored'
        />
      </body>
    </html>
  );
}
