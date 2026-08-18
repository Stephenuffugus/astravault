import { ScrollViewStyleReset } from 'expo-router/html';
import React, { type PropsWithChildren } from 'react';

/** The HTML shell for the web export. Head tags here reach the crawler and
 *  the home-screen installer before any JavaScript runs. */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <title>Astra Vault</title>
        <meta
          name="description"
          content="Scan the cosmos and collect the sky. Real astronomy, live NASA data, lessons and citizen science. Free from Sky Wolf Studios, no ads, no accounts."
        />
        <meta name="theme-color" content="#02030b" />
        <meta property="og:title" content="Astra Vault" />
        <meta
          property="og:description"
          content="Scan the cosmos and collect the sky. Free, no ads, no accounts."
        />
        <meta
          property="og:image"
          content="https://sws-apps-9646d.web.app/astravault/icon-512.png"
        />
        <meta name="twitter:card" content="summary" />
        <link rel="manifest" href="/astravault/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/astravault/icon-192.png" />
        <style>{'html, body { background-color: #02030b; }'}</style>
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
