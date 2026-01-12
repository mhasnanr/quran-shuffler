import { cn } from '@/lib/utils';
import { BookOpen, Settings, Calendar, BookOpenCheck } from 'lucide-react';

export type TabType = 'guide' | 'schedule' | 'config' | 'history';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: 'guide' as TabType, label: 'Guide', icon: BookOpenCheck },
    { id: 'schedule' as TabType, label: 'Today', icon: BookOpen },
    { id: 'config' as TabType, label: 'Settings', icon: Settings },
    { id: 'history' as TabType, label: 'History', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                activeTab === tab.id && "scale-110"
              )} />
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 h-0.5 w-12 gradient-islamic rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
