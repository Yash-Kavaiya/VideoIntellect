// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Intel Intelligent Meeting Assistant | Powered by OPEA™',
  description: 'Transform your enterprise meetings with AI-powered summaries, notes, and insights using Intel\'s OPEA™ platform and cutting-edge hardware.',
  keywords: 'Intel, OPEA, AI, Meeting Assistant, Enterprise AI, Video Analysis, Transcription, OpenVINO, Tiber AI Cloud',
  authors: [
    { name: 'Chetan Sonigra' },
    { name: 'Yash Kavaiya' }
  ],
  openGraph: {
    title: 'Intel Intelligent Meeting Assistant',
    description: 'Transform your enterprise meetings with AI-powered summaries, notes, and insights using Intel\'s OPEA™ platform.',
    type: 'website',
    images: ['/assets/intel-meeting-assistant-og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intel Intelligent Meeting Assistant',
    description: 'Transform your enterprise meetings with AI-powered summaries, notes, and insights using Intel\'s OPEA™ platform.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0071c5" />
        <meta name="msapplication-TileColor" content="#0071c5" />
      </head>
      <body className={inter.className}>
        {/* Navigation Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-intel-light-gray">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 intel-gradient rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">IA</span>
              </div>
              <span className="font-semibold text-intel-navy text-lg">
                Intel Meeting Assistant
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-intel-gray hover:text-intel-blue transition-colors">
                Features
              </a>
              <a href="#technology" className="text-intel-gray hover:text-intel-blue transition-colors">
                Technology
              </a>
              <a href="#demo" className="text-intel-gray hover:text-intel-blue transition-colors">
                Demo
              </a>
              <a href="#contact" className="text-intel-gray hover:text-intel-blue transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <button className="bg-intel-blue text-white px-4 py-2 rounded-md hover:bg-intel-navy transition-colors">
                Get Started
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-intel-navy text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-intel-light-blue rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">IA</span>
                  </div>
                  <span className="font-semibold text-xl">Intel Meeting Assistant</span>
                </div>
                <p className="text-gray-300 mb-4 max-w-md">
                  Powered by Intel's OPEA™ platform, transforming enterprise meetings 
                  with cutting-edge AI technology for better productivity and insights.
                </p>
                <div className="flex space-x-4">
                  <span className="text-sm text-gray-400">Powered by:</span>
                  <span className="text-intel-light-blue font-semibold">OPEA™</span>
                  <span className="text-intel-light-blue font-semibold">Intel® Tiber AI Cloud</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>AI Video Summary</li>
                  <li>Smart Notes</li>
                  <li>Blog Generation</li>
                  <li>MCQ Creation</li>
                  <li>Transcript Search</li>
                  <li>AI Chat Assistant</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Technology</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>Intel® Xeon® CPUs</li>
                  <li>Intel® Gaudi® AI</li>
                  <li>OpenVINO™</li>
                  <li>OPEA™ Platform</li>
                  <li>Intel® NPUs</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Intel Meeting Assistant. Built for Intel Hackathon.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">
                  Developers: Chetan Sonigra & Yash Kavaiya
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}