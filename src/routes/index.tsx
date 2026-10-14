import { createFileRoute } from "@tanstack/react-router";
import { PayPalFlow } from "@/components/paypal-flow";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "PayPal Finances • Balance and Crypto Demo" },
    { name: "description", content: "Explore a visual PayPal Finances recreation with simulated funding and 2025-inspired crypto screens. No real transactions." },
    { property: "og:title", content: "PayPal Finances • Balance and Crypto Demo" },
    { property: "og:description", content: "Explore balance, funding, and crypto screens in a clearly labeled visual demo. No real money or crypto moves." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PayPalFlow,
});
