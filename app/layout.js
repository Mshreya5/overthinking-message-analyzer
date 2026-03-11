import './globals.css'

// Metadata for the website - used for SEO and browser tabs
export const metadata = {
  title: 'Overthinking Message Analyzer | Stop Overthinking Texts',
  description: 'Ever received "ok" or "fine" and spent hours analyzing it? Discover your overthinking level with our humorous message analyzer. Try it now!',
  keywords: 'overthinking, message analyzer, text anxiety, digital communication, funny app',
  authors: [{ name: 'Shreya' }],
  openGraph: {
    title: 'Overthinking Message Analyzer',
    description: 'Analyze how much you overthink short messages',
    type: 'website',
  },
}

// Root layout component - wraps all pages
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* All page content renders here */}
        {children}
      </body>
    </html>
  )
}
