// Global providers file --> Controls how all pages in app initialized
// Controls what your pages render --> can wrap in layout, theme, etc

// Global CSS file for leaflet, can only be imported in _app.js
import 'leaflet/dist/leaflet.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import ReturnHome from '../components/ReturnHomeButton';
import Header from '../components/Header';
import Head from 'next/head';
import { ThemeContext } from '@emotion/react';
import theme from '@/theme';
import { SessionProvider } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';

/*
Component: The page currently being rendered
pageProps: any props to pass to the page
return <Component ... /> --> tells Next.js to render requested page
*/
export const GuestContext = createContext(false);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setIsGuest(localStorage.getItem('isGuest') === 'true');
  }, []);
  return (
    <SessionProvider session={session}>
      {/* Supplies aesthetics */}
      <GuestContext.Provider value={{ isGuest, setIsGuest }}>
        <ThemeProvider theme={theme}>
          {/* Sets margins/paddings and global typography */}
          <CssBaseline />

          {/* Injects metadata into the <head> of HTML */}
          <Head>
            <title>WanderLogger</title>
            <meta name="viewport" content="initial-scale-1, width=device-width" />
          </Head>

          <Header />
          {/* Renders whatever page user visits */}
          <Component {...pageProps} />
        </ThemeProvider>
      </GuestContext.Provider>
    </SessionProvider>
  );
}
