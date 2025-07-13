// Way to customize raw HTML skeleton before react app loads
// Fonts, attributes, meta tages
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          {/* Need Main and NextScript for app to work */}
          {/* 
          Main = special Next.js component that is placeholder for app
          Auto provided by Next.js, like a wrapper for app content from index.js
          */}
          <Main />
          {/* Injects Next.js scripts */}
          <NextScript />
        </body>
      </Html>
    );
  }
}
