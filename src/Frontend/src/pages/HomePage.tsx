
import { useEffect, useRef } from "react";
import { Typography } from "@mui/material";

export default function HomePage() {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Avoid running on the server (Next.js SSR)
    if (typeof window === "undefined") return;

    // If you ever need credentials/cookies, add { withCredentials: true }
    const es = new EventSource("http://localhost:5000/api/customers/realtime");
    esRef.current = es;

    console.log("Setting up SSE connection...");

    // Listen specifically for the 'customers' event (server emits eventType: "customers")
    const onCustomers = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data); // payload is your Customer object
        // event.lastEventId is available only if your server sends `id: ...`
        console.log("New Customer event:", payload);
      } catch (err) {
        console.error("Failed to parse SSE data", err, "raw:", event.data);
      }
    };

    // Optional generic message handler (for events without a custom name)
    const onMessage = (event: MessageEvent) => {
      console.log("SSE onmessage:", event.data);
    };

    // Connection opened
    const onOpen = () => {
      console.log("SSE connection opened");
    };

    // Errors & reconnects
    const onError = (event: Event) => {
      // readyState values: 0=CONNECTING, 1=OPEN, 2=CLOSED
      if (!esRef.current) return;
      const state = esRef.current.readyState;
      if (state === EventSource.CONNECTING) {
        console.log("SSE reconnecting...");
      } else if (state === EventSource.CLOSED) {
        console.warn("SSE closed");
      } else {
        console.error("SSE error", event);
      }
    };

    es.addEventListener("customers", onCustomers);
    es.onmessage = onMessage; // only fires if server sends default 'message' events
    es.onopen = onOpen;
    es.onerror = onError;

    // Cleanup on unmount
    return () => {
      console.log("Closing SSE connection...");
      es.removeEventListener("customers", onCustomers);
      es.close();
      esRef.current = null;
    };
  }, []);

  return (
    <>
      <Typography variant="h1" sx={{ textAlign: "center", mt: 10 }}>
        Welcome to the Test Application
      </Typography>
    </>
  );
}
