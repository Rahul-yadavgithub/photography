import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { IntentProvider } from './context/IntentContext.jsx'
import { BrowserRouter } from 'react-router-dom'

import { enUS } from '@clerk/localizations'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const localization = {
  ...enUS,
  signIn: {
    start: {
      title: 'Signing into Subham Photo Studio',
      subtitle: 'to continue to Subham Photo Studio',
    },
  },
  signUp: {
    start: {
      title: 'Signing into Subham Photo Studio',
      subtitle: 'to continue to Subham Photo Studio',
    },
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      localization={localization}
      appearance={{
        layout: {
          logoImageUrl: undefined, // Will hide default Amit Board logo if we want, or we can leave it
          socialButtonsVariant: 'iconButton',
        },
        variables: {
          colorPrimary: '#ea580c',
        }
      }}
    >
      <BookingProvider>
        <BrowserRouter>
          <IntentProvider>
            <App />
          </IntentProvider>
        </BrowserRouter>
      </BookingProvider>
    </ClerkProvider>
  </StrictMode>,
)
