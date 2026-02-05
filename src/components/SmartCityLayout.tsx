import React, { type ReactNode } from 'react';
import DockMenu from './DockMenu';

interface LayoutProps {
  children: ReactNode;
  showDock?: boolean;
}

const SmartCityLayout: React.FC<LayoutProps> = ({ children, showDock = true }) => {
  return (
    // z-10 penting biar konten ada DI ATAS background
    <div className="relative z-10 w-full h-screen flex flex-col justify-between font-sans overflow-hidden">
      
      {/* AREA KONTEN (Header, Widget, dll) */}
      <div className="flex-1 w-full relative flex flex-col">
         {children}
      </div>

      {/* DOCK MENU */}
      {showDock && (
         <div className="relative z-50 w-full animate-slide-up">
           <DockMenu />
         </div>
      )}

    </div>
  );
};

export default SmartCityLayout;