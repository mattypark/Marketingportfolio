import Hero from './components/Hero'
import Reviews from './components/Reviews'
import SignatureCapture from './components/SignatureCapture'

export default function App() {
  // Visit /?sign to open the signature-capture page.
  const isSign =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('sign')

  if (isSign) return <SignatureCapture />

  return (
    <main>
      <Hero />
      <Reviews />
    </main>
  )
}
