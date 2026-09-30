import type { Metadata } from "next";
import { Explore } from "@/components/portfolio/Explore";

export const metadata: Metadata = {
  title: "Explore portfolios",
  description: "Every vault, what it holds and what it costs to get in.",
};

export default function PortfoliosPage() {
  return <Explore />;
}
