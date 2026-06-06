// tailwind.config.ts

import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  darkMode: "class", 
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    // 🚨 Replace the existing `theme` block with this one
    extend: {
      colors: {
        // --- 1. Core Colors (Background & Foreground) ---
        // We will focus ONLY on the background for now to isolate the issue.
        // Use a distinct name like 'app-bg' to avoid any conflict with Tailwind defaults.
        'app-bg': 'hsl(var(--background))',
        
        // Add other variables back only once this is confirmed to work
        'app-fg': 'hsl(var(--foreground))',
        'sidebar-bg': 'hsl(var(--sidebar-background))',
        
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        
        // --- 2. Component/Semantic Colors ---
        'card': 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        'popover': 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        'primary': 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'secondary': 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        'muted': 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        'accent': 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        'destructive': 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        
        // --- 3. Utility Colors ---
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
        
        // --- 4. Sidebar Specific Colors (Crucial for your Sidebar component) ---
        'sidebar-background': 'hsl(var(--sidebar-background))',
        'sidebar-foreground': 'hsl(var(--sidebar-foreground))',
        'sidebar-primary': 'hsl(var(--sidebar-primary))',
        'sidebar-accent': 'hsl(var(--sidebar-accent))',
      },
      // You can also add other extensions here if needed (e.g., shadows, borderRadius)
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [forms],
};

export default config;