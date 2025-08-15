import React from 'react';
import SimpleHeader from './SimpleHeader';

interface ToolLayoutProps {
  children: React.ReactNode;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
};

export default ToolLayout;
