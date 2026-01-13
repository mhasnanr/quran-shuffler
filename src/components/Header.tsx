import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="gradient-islamic px-4 py-3 text-primary-foreground">
      <div className="flex items-center justify-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/20">
          <BookOpen className="h-4 w-4" />
        </div>
        <h1 className="text-base font-semibold tracking-tight">Quran Shuffler</h1>
      </div>
    </header>
  );
};

export default Header;
