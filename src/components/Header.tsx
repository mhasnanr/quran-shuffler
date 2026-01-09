import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="gradient-islamic px-4 py-6 text-primary-foreground">
      <div className="flex items-center justify-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight">Quran Shuffler</h1>
          <p className="font-arabic text-sm opacity-90">مُرَتِّب القِرَاءَة</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
