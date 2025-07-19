import React from 'react';
import { LiquidCanvas } from './components/LiquidCanvas';
import { MainContent } from './components/MainContent';
import { ScrollingBackground } from './components/ScrollingBackground';
import { useIsMobile } from './hooks/useIsMobile';

function App() {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full">
      {/* Scrollable content area */}
      <div style={{ height: '600vh' }} className="relative">
        {/* Scrolling background images */}
        <ScrollingBackground />
        
        {/* Conditional liquid glass background - only on desktop */}
        {!isMobile && <LiquidCanvas />}
        
        {/* Static background for mobile */}
        {isMobile && (
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-yellow-900 to-amber-900" />
        )}
        
        {/* Fixed main content overlay */}
        <MainContent />
      </div>
    </div>
  );
}

export default App;