import CoreFeaturesSection from "@/components/landing/CoreFeaturesSection"
import FinalCTASection from "@/components/landing/FinalCTASection"
import FooterSection from "@/components/landing/FooterSection"
import HeroSection from "@/components/landing/HeroSection"
import Navbar from "@/components/landing/Navbar"

const Index = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <main className="pt-24">
      <HeroSection />
      <div id="features">
        <CoreFeaturesSection />
      </div>
      <FinalCTASection />
    </main>
    <FooterSection />
  </div>
);

export default Index;
