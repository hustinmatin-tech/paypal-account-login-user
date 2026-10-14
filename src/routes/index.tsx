import { createFileRoute } from "@tanstack/react-router";
import { PayPalFlow } from "@/components/paypal-flow";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "PayPal Finances • Savings, Balance and Crypto Demo" },
    { name: "description", content: "Explore a visual PayPal Finances recreation with 2025-inspired Savings goals, simulated funding, and crypto screens. No real transactions." },
    { property: "og:title", content: "PayPal Finances • Savings, Balance and Crypto Demo" },
    { property: "og:description", content: "Explore Savings goals, balance, funding, and crypto in a clearly labeled visual demo. No real money moves." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PayPalFlow,
});
