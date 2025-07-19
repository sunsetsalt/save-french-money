import React, { useState } from 'react';
import { DollarSign, ChevronDown, Info } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface Statement {
  id: number;
  text: string;
  points: number;
}

const statements: Statement[] = [
  { id: 1, text: "Multiple income streams are essential", points: 4 },
  { id: 2, text: "Regular asset investment builds wealth", points: 3 },
  { id: 3, text: "Emergency funds provide financial security", points: 10 },
  { id: 4, text: "Cryptocurrency knowledge is valuable", points: 5 },
  { id: 5, text: "Real estate creates long-term value", points: 4.5 },
  { id: 6, text: "Portfolio diversification reduces risk", points: 3 },
  { id: 7, text: "Financial optimization requires regular review", points: 2 },
  { id: 8, text: "Passive income enables financial freedom", points: 5 },
  { id: 9, text: "Tax strategies maximize wealth retention", points: 2 },
  { id: 10, text: "Clear planning accelerates wealth building", points: 3 },
  { id: 11, text: "Financial education drives better decisions", points: 2 },
  { id: 12, text: "Business ownership creates equity value", points: 4 },
];

const getEmoji = (score: number): string => {
  if (score === 0) return '🕸️';
  if (score <= 7) return '🧱';
  if (score <= 14) return '💼';
  if (score <= 21) return '💰';
  if (score <= 28) return '💎';
  if (score <= 35) return '🔱';
  if (score <= 42) return '🧠';
  if (score <= 43.8) return '👑';
  return '🌌';
};

const getStatusText = (score: number): string => {
  if (score === 0) return 'Getting Started';
  if (score <= 7) return 'Building Foundation';
  if (score <= 14) return 'Taking Shape';
  if (score <= 21) return 'Gaining Momentum';
  if (score <= 28) return 'Well Positioned';
  if (score <= 35) return 'Highly Aligned';
  if (score <= 42) return 'Elite Status';
  if (score <= 43.8) return 'Wealth Master';
  return 'Transcendent';
};

const getWikipediaLink = (id: number): string => {
  const links: { [key: number]: string } = {
    1: 'https://en.wikipedia.org/wiki/Multiple_income_streams',
    2: 'https://en.wikipedia.org/wiki/Investment',
    3: 'https://en.wikipedia.org/wiki/Emergency_fund',
    4: 'https://en.wikipedia.org/wiki/Cryptocurrency',
    5: 'https://en.wikipedia.org/wiki/Real_estate_investment',
    6: 'https://en.wikipedia.org/wiki/Diversification_(finance)',
    7: 'https://en.wikipedia.org/wiki/Financial_planning',
    8: 'https://en.wikipedia.org/wiki/Passive_income',
    9: 'https://en.wikipedia.org/wiki/Tax_strategy',
    10: 'https://en.wikipedia.org/wiki/Wealth_management',
    11: 'https://en.wikipedia.org/wiki/Financial_literacy',
    12: 'https://en.wikipedia.org/wiki/Business_ownership'
  };
  
  return links[id] || 'https://en.wikipedia.org/wiki/Personal_finance';
};

export const MainContent: React.FC = () => {
  const [activeStatements, setActiveStatements] = useState<Set<number>>(new Set());
  const isMobile = useIsMobile();

  const toggleStatement = (id: number) => {
    const newActive = new Set(activeStatements);
    if (newActive.has(id)) {
      newActive.delete(id);
    } else {
      newActive.add(id);
    }
    setActiveStatements(newActive);
  };

  const scrollToNextImage = () => {
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalHeight = document.body.scrollHeight - windowHeight;
    const imageHeight = totalHeight / 8; // 8 background images
    
    // Calculate which image section we're currently in
    const currentImageIndex = Math.floor(currentScroll / imageHeight);
    
    // Scroll to the next image section
    const nextImageScroll = Math.min((currentImageIndex + 1) * imageHeight, totalHeight);
    
    window.scrollTo({
      top: nextImageScroll,
      behavior: 'smooth'
    });
  };
  const totalScore = Array.from(activeStatements).reduce((sum, id) => {
    const statement = statements.find(s => s.id === id);
    return sum + (statement?.points || 0);
  }, 0);

  const gaugePercentage = Math.min((totalScore / 43.8) * 100, 100);
  const currentEmoji = getEmoji(totalScore);
  const statusText = getStatusText(totalScore);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="flex flex-col h-full p-4 gap-4 pointer-events-auto overflow-y-auto">
          {/* Top Section - Main Gauge */}
          <div className="flex-shrink-0">
            <div className="backdrop-blur-md bg-black/40 rounded-2xl p-6 border border-yellow-400/30 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-yellow-100 mb-2">
                  Wealth Alignment
                </h1>
                <p className="text-base text-yellow-100/80">
                  Financial principles assessment
                </p>
              </div>

              {/* Gauge Section */}
              <div className="text-center">
                <div className="text-5xl mb-4 transition-all duration-500 transform hover:scale-110">
                  {currentEmoji}
                </div>
                <div className="text-lg font-semibold text-yellow-100 mb-2">
                  {statusText}
                </div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400 mb-4">
                  {totalScore} {totalScore > 43.8 && <span className="text-sm text-yellow-300">/ 43.8+</span>}
                </div>

                {/* Gauge Bar */}
                <div className="relative w-full">
                  <div className="h-3 bg-black/40 rounded-full border border-yellow-400/20 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-700 ease-out relative"
                      style={{ width: `${gaugePercentage}%` }}
                    >
                      {totalScore > 43.8 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-yellow-300/60 mt-2">
                    <span>0</span>
                    <span>22</span>
                    <span>43.8{totalScore > 43.8 && '+'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Propositions in Two Columns */}
          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Left Column */}
              <div className="backdrop-blur-md bg-black/40 rounded-2xl p-4 border border-yellow-400/20 shadow-2xl">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-yellow-400/30 pr-1">
                  <div className="space-y-3">
                    {statements.slice(0, 6).map((statement) => {
                      const isActive = activeStatements.has(statement.id);
                      return (
                        <button
                          key={statement.id}
                          onClick={() => toggleStatement(statement.id)}
                          className={`
                            group relative p-3 rounded-xl border transition-all duration-300 text-left w-full
                            transform hover:scale-[1.02] hover:shadow-lg
                            ${isActive 
                              ? 'bg-gradient-to-r from-yellow-500/20 to-amber-600/20 border-yellow-400/50 shadow-yellow-400/20 shadow-lg' 
                              : 'bg-black/20 border-yellow-400/20 hover:border-yellow-400/40 hover:bg-black/30'
                            }
                          `}
                        >
                          <p className={`text-sm font-medium transition-colors duration-300 leading-relaxed ${
                            isActive ? 'text-yellow-100' : 'text-yellow-100/80'
                          }`}>
                            {statement.text} <span className={`font-bold ${
                              isActive ? 'text-yellow-300' : 'text-yellow-400/70'
                            }`}>+{statement.points}</span>
                          </p>
                          
                          {/* Glow effect for active items */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-amber-400/10 animate-pulse pointer-events-none" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="backdrop-blur-md bg-black/40 rounded-2xl p-4 border border-yellow-400/20 shadow-2xl">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-yellow-400/30 pr-1">
                  <div className="space-y-3">
                    {statements.slice(6, 12).map((statement) => {
                      const isActive = activeStatements.has(statement.id);
                      return (
                        <button
                          key={statement.id}
                          onClick={() => toggleStatement(statement.id)}
                          className={`
                            group relative p-3 rounded-xl border transition-all duration-300 text-left w-full
                            transform hover:scale-[1.02] hover:shadow-lg
                            ${isActive 
                              ? 'bg-gradient-to-r from-yellow-500/20 to-amber-600/20 border-yellow-400/50 shadow-yellow-400/20 shadow-lg' 
                              : 'bg-black/20 border-yellow-400/20 hover:border-yellow-400/40 hover:bg-black/30'
                            }
                          `}
                        >
                          <p className={`text-sm font-medium transition-colors duration-300 leading-relaxed ${
                            isActive ? 'text-yellow-100' : 'text-yellow-100/80'
                          }`}>
                            {statement.text} <span className={`font-bold ${
                              isActive ? 'text-yellow-300' : 'text-yellow-400/70'
                            }`}>+{statement.points}</span>
                          </p>
                          
                          {/* Glow effect for active items */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-amber-400/10 animate-pulse pointer-events-none" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Layout */
        <>
          {/* Fixed Center Gauge */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="backdrop-blur-md bg-black/30 rounded-3xl p-8 border border-yellow-400/30 shadow-2xl pointer-events-auto max-w-md w-full mx-4">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30">
                    <DollarSign className="w-6 h-6 text-yellow-300" />
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-yellow-100 mb-1">
                  Wealth Alignment
                </h1>
                <p className="text-sm text-yellow-100/80">
                  Financial principles assessment
                </p>
              </div>

              {/* Gauge Section */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-3 transition-all duration-500 transform hover:scale-110">
                  {currentEmoji}
                </div>
                <div className="text-lg font-semibold text-yellow-100 mb-1">
                  {statusText}
                </div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400 mb-4">
                  {totalScore} {totalScore > 43.8 && <span className="text-xs text-yellow-300">/ 43.8+</span>}
                </div>

                {/* Gauge Bar */}
                <div className="relative w-full">
                  <div className="h-3 bg-black/40 rounded-full border border-yellow-400/20 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-700 ease-out relative"
                      style={{ width: `${gaugePercentage}%` }}
                    >
                      {totalScore > 43.8 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-yellow-300/60 mt-2">
                    <span>0</span>
                    <span>22</span>
                    <span>43.8{totalScore > 43.8 && '+'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Scroll Indicator */}
      <div className="hidden xl:block absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
        <button 
          onClick={scrollToNextImage}
          className="bg-black/80 rounded-lg px-3 py-2 border border-white/20 animate-pulse hover:bg-black/90 hover:border-yellow-400/40 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white">Scroll</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </div>
        </button>
      </div>

      {/* Made by credit - Bottom Left */}
      <div className="absolute bottom-4 left-4 pointer-events-auto z-20">
        <a 
          href="https://en.wikipedia.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-white/60 hover:text-yellow-300 transition-colors duration-300 backdrop-blur-sm bg-black/20 px-2 py-1 rounded border border-white/10 hover:border-yellow-400/30"
        >
          made by xxx
        </a>
      </div>

      {/* Scrollable Propositions - Left Side */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-80 max-w-[calc(50vw-200px)] hidden xl:block pointer-events-auto">
        <div className="backdrop-blur-md bg-black/40 rounded-2xl p-4 border border-yellow-400/20 shadow-2xl">
          <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-yellow-400/30 pr-2">
            <div className="space-y-3">
              {statements.slice(0, 6).map((statement) => {
                const isActive = activeStatements.has(statement.id);
                return (
                  <button
                    key={statement.id}
                    onClick={() => toggleStatement(statement.id)}
                    className={`
                      group relative p-3 rounded-xl border transition-all duration-300 text-left w-full
                      transform hover:scale-[1.02] hover:shadow-lg
                      ${isActive 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-amber-600/20 border-yellow-400/50 shadow-yellow-400/20 shadow-lg' 
                        : 'bg-black/20 border-yellow-400/20 hover:border-yellow-400/40 hover:bg-black/30'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <p className={`text-sm font-medium transition-colors duration-300 inline ${
                          isActive ? 'text-yellow-100' : 'text-yellow-100/80'
                        }`}>
                          {statement.text}
                          <a 
                            href={getWikipediaLink(statement.id)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block ml-1 text-yellow-300/60 hover:text-yellow-300 transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Info className="w-3 h-3" />
                          </a>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-yellow-400 text-black' 
                            : 'bg-yellow-400/20 text-yellow-300'
                        }`}>
                          +{statement.points}
                        </span>
                        
                        <div className={`
                          w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                          ${isActive 
                            ? 'border-yellow-400 bg-yellow-400' 
                            : 'border-yellow-400/40 bg-transparent group-hover:border-yellow-400/60'
                          }
                        `}>
                          {isActive && (
                            <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Glow effect for active items */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-amber-400/10 animate-pulse pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Propositions - Right Side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-80 max-w-[calc(50vw-200px)] hidden xl:block pointer-events-auto">
        <div className="backdrop-blur-md bg-black/40 rounded-2xl p-4 border border-yellow-400/20 shadow-2xl">
          <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-yellow-400/30 pr-2">
            <div className="space-y-3">
              {statements.slice(6, 12).map((statement) => {
                const isActive = activeStatements.has(statement.id);
                return (
                  <button
                    key={statement.id}
                    onClick={() => toggleStatement(statement.id)}
                    className={`
                      group relative p-3 rounded-xl border transition-all duration-300 text-left w-full
                      transform hover:scale-[1.02] hover:shadow-lg
                      ${isActive 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-amber-600/20 border-yellow-400/50 shadow-yellow-400/20 shadow-lg' 
                        : 'bg-black/20 border-yellow-400/20 hover:border-yellow-400/40 hover:bg-black/30'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <p className={`text-sm font-medium transition-colors duration-300 inline ${
                          isActive ? 'text-yellow-100' : 'text-yellow-100/80'
                        }`}>
                          {statement.text}
                          <a 
                            href={getWikipediaLink(statement.id)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block ml-1 text-yellow-300/60 hover:text-yellow-300 transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Info className="w-3 h-3" />
                          </a>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-yellow-400 text-black' 
                            : 'bg-yellow-400/20 text-yellow-300'
                        }`}>
                          +{statement.points}
                        </span>
                        
                        <div className={`
                          w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                          ${isActive 
                            ? 'border-yellow-400 bg-yellow-400' 
                            : 'border-yellow-400/40 bg-transparent group-hover:border-yellow-400/60'
                          }
                        `}>
                          {isActive && (
                            <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Glow effect for active items */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-amber-400/10 animate-pulse pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};