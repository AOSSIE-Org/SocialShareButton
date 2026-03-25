import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { EverywhereFeatures } from "@/components/EverywhereFeatures";
import { CodeShowcase } from "@/components/CodeShowcase";
import { Playground } from "@/components/Playground";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen selection:bg-[#FFCC00]/30">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <EverywhereFeatures />
        <CodeShowcase />
        <Playground />
        <ComparisonTable />
      </main>
      <Footer />
    </div>
  );
}
