import React, { useState } from 'react';
import { ViewMode } from './types';
import { ChatView } from './views/ChatView';
import { ImagineView } from './views/ImagineView';
import { DashboardView } from './views/DashboardView';
import { Icons } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.Chat);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ mode, icon, label }: { mode: ViewMode; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => {
        setActiveView(mode);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        activeView === mode
          ? 'bg-primary/10 text-primary'
          : 'text-zinc-400 hover:bg-surfaceHover hover:text-zinc-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-background text-zinc-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-surface/30 backdrop-blur-xl p-4">
        <div className="flex items-center gap-2 px-4 mb-8 mt-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
             <Icons.Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Lumina</span>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem mode={ViewMode.Chat} icon={<Icons.MessageSquare className="w-5 h-5"/>} label="Chat" />
          <NavItem mode={ViewMode.Imagine} icon={<Icons.Image className="w-5 h-5"/>} label="Imagine" />
          <NavItem mode={ViewMode.Dashboard} icon={<Icons.BarChart className="w-5 h-5"/>} label="Analytics" />
        </nav>

        <div className="mt-auto pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-300">
                U
            </div>
            <div>
                <p className="text-sm font-medium text-white">Premium User</p>
                <p className="text-xs text-zinc-500">Pro Plan Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-zinc-800 flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                 <Icons.Sparkles className="text-white w-4 h-4" />
             </div>
             <span className="font-bold">Lumina</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400">
              <Icons.Menu className="w-6 h-6" />
          </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-20 px-6">
           <nav className="space-y-2">
             <NavItem mode={ViewMode.Chat} icon={<Icons.MessageSquare className="w-5 h-5"/>} label="Chat" />
             <NavItem mode={ViewMode.Imagine} icon={<Icons.Image className="w-5 h-5"/>} label="Imagine" />
             <NavItem mode={ViewMode.Dashboard} icon={<Icons.BarChart className="w-5 h-5"/>} label="Analytics" />
           </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden pt-16 md:pt-0">
        <div className="flex-1 overflow-hidden">
            {activeView === ViewMode.Chat && <ChatView />}
            {activeView === ViewMode.Imagine && <ImagineView />}
            {activeView === ViewMode.Dashboard && <DashboardView />}
        </div>
      </main>
    </div>
  );
};

export default App;