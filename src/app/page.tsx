import { AssetMarquee } from "@/components/home/AssetMarquee";
import { Backing } from "@/components/home/Backing";
import { Creators } from "@/components/home/Creators";
import { CtaBand } from "@/components/home/CtaBand";
import { Faq } from "@/components/home/Faq";
import { Featured } from "@/components/home/Featured";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <>
      <Hero />
      <AssetMarquee />
      <Featured />
      <HowItWorks />
      <Backing />
      <Creators />
      <Faq />
      <CtaBand />
    </>
  );
}
