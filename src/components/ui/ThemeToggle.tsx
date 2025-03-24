
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './dropdown-menu';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system'
  );

  // Apply the theme when component loads and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (newTheme: string) => {
      if (newTheme === 'dark' || 
         (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(theme);
    
    // Listen for system preference changes if in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const setMode = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setMode('light')} className="gap-2">
          <Sun className="h-4 w-4 text-yellow-500" />
          <span>Claro</span>
          {theme === 'light' && <span className="absolute right-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode('dark')} className="gap-2">
          <Moon className="h-4 w-4 text-blue-500" />
          <span>Escuro</span>
          {theme === 'dark' && <span className="absolute right-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode('system')} className="gap-2">
          <span className="flex h-4 w-4 items-center justify-center">🖥️</span>
          <span>Sistema</span>
          {theme === 'system' && <span className="absolute right-2">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
