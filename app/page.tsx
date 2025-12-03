import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import {
  ProblemSection,
  SolutionSection,
  HowItWorksSection,
  FeaturesSection,
  DemoSection,
  ComparisonSection,
  FAQSection,
  CTASection,
  InstallationSection,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      
      <main className="min-h-screen">
        <Hero />
        
        {/* Problem Section */}
        <ProblemSection />
        
        {/* Solution Section - Bio-inspired concept */}
        <SolutionSection />
        
        {/* How It Works - Interactive mycelium learning demo */}
        <HowItWorksSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Installation Section - Quick Start */}
        <InstallationSection />
        
        {/* Demo Section with Live Telemetry */}
        <DemoSection />
        
        {/* Comparison Section */}
        <ComparisonSection />
        
        {/* FAQ Section */}
        <FAQSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      <Footer />
    </>
  );
}
