import React, { type ReactNode } from 'react';
import DockMenu from './DockMenu';

interface LayoutProps {
  children: ReactNode;
  showDock?: boolean;
}

const SmartCityLayout: React.FC<LayoutProps> = ({ children, showDock = true }) => {
  return (
    // z-10 penting biar konten ada DI ATAS background
    <div className="relative z-10 w-full h-screen font-sans overflow-hidden flex flex-col">

      {/* AREA KONTEN (Header, Widget, dll) - scrollable */}
      <div className="flex-1 w-full relative flex flex-col overflow-y-auto no-scrollbar" style={{ paddingBottom: showDock ? '120px' : '0' }}>
        {children}
      </div>

      {/* DOCK MENU - fixed di bawah layar */}
      {showDock && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
          <DockMenu />
        </div>
      )}

    </div>
  );
};

export default SmartCityLayout;