import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { CoreSystemsSection } from '@/components/landing/CoreSystemsSection'
import { OpenSourceSection } from '@/components/landing/OpenSourceSection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <CoreSystemsSection />
      <OpenSourceSection />
      <Footer />
    </main>
  )
}
