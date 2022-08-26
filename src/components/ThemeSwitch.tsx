import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div>
      <button
        className="rounded-md bg-black py-2 px-4 font-bold text-white hover:opacity-70"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Change Theme: {theme}
      </button>
    </div>
  );
};

export default ThemeSwitch;
