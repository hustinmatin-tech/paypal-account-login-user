import { createFileRoute } from "@tanstack/react-router";
import { PayPalFlow } from "@/components/paypal-flow";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "PayPal • Balance and Add Money" },
    { name: "description", content: "View your PayPal balance and choose a way to add funds." },
    { property: "og:title", content: "PayPal • Balance and Add Money" },
    { property: "og:description", content: "View your PayPal balance and choose a way to add funds." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PayPalFlow,
});
