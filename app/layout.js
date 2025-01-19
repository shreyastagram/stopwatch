import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css'; // Global styles for the app
import styles from './styles/RootLayout.module.css'; // Import your CSS module

// Import Google Fonts
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Stopwatch App',
  description: 'A simple and optimized stopwatch app built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${styles.rootLayout}`}>
        <main className={styles.main}>
          <h1 className={styles.header}>Stopwatch App</h1>
          {children}
        </main>
        <footer className={styles.footer}>
          <p>© 2025 Stopwatch App By Shreyash Borkar</p>
        </footer>
      </body>
    </html>
  );
}
