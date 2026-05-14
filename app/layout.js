import Script from 'next/script';

export const metadata = {
  title: 'RollX',
  description: 'RollX Telegram Mini App'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}

        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
