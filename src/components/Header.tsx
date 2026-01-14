import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="gradient-islamic px-4 py-2.5 text-primary-foreground">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20">
          <BookOpen className="h-3.5 w-3.5" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight">Quran Shuffler</h1>
      </div>
    </header>
  );
};

export default Header;
