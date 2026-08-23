import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Features } from "@/components/Features";
import { EverywhereFeatures } from "@/components/EverywhereFeatures";
import { CodeShowcase } from "@/components/CodeShowcase";
import { Playground } from "@/components/Playground";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <ComparisonTable />
        <Features />
        <EverywhereFeatures />
        <CodeShowcase />
        <Playground />
      </main>
      <Footer />
    </div>
  );
}
