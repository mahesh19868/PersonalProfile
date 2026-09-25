import { Header } from "@/components/Header";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Journey } from "@/components/Journey";
import { Portfolio } from "@/components/Portfolio";
import { Contact, Footer } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <About />
        <Journey />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
