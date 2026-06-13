import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import { enUS } from '@clerk/localizations'
import { dark } from '@clerk/themes'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const localization = {
  ...enUS,
  signIn: {
    start: {
      title: 'Welcome 👋 to Shubham Photo Studio',
      subtitle: "Let's get started!",
    },
  },
  signUp: {
    start: {
      title: 'Welcome 👋 to Shubham Photo Studio',
      subtitle: "Let's get started!",
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
        baseTheme: dark,
        layout: {
          logoImageUrl: 'https://res.cloudinary.com/dzbliymin/image/upload/v1781267132/logosls_vcamss.jpg',
          socialButtonsVariant: 'iconButton',
        },
        variables: {
          colorPrimary: '#ea580c', // keep the orange accent
          colorBackground: '#0a0a0a', // very dark background
          colorInputBackground: '#18181b', // zinc-900 input bg
          colorInputText: '#ffffff',
          colorText: '#f4f4f5', // zinc-100
        },
        elements: {
          logoImage: 'rounded-full object-cover hover:scale-110 hover:rotate-3 transition-all duration-500 ring-2 ring-white/10 shadow-[0_0_15px_rgba(234,88,12,0.2)]',
          logoBox: 'flex justify-center',
          card: 'bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-2xl',
          headerTitle: 'text-xl font-serif font-bold text-white',
          headerSubtitle: 'text-sm text-zinc-400 font-medium',
          formButtonPrimary: 'bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold uppercase tracking-widest text-xs py-3',
          socialButtonsBlockButton: 'border-white/10 hover:bg-white/5 text-zinc-300',
          formFieldInput: 'bg-[#18181b] border-white/10 text-white focus:border-[#ea580c]',
          formFieldLabel: 'text-zinc-400 font-medium',
          footerActionLink: 'text-[#ea580c] hover:text-[#c2410c] font-bold',
          identityPreviewText: 'text-white',
          identityPreviewEditButton: 'text-[#ea580c] hover:text-[#c2410c]',
        }
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
