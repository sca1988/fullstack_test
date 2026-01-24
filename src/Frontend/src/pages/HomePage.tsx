import { Button, Typography } from "@mui/material";
import { useFetchWithLoading } from "../hooks/useFetchWithLoading";

export default function HomePage() {



  const openSSEChannel = async () => {

    const eventSource = new EventSource('http://localhost:5000/api/customers/realtime');

    // Listen for the specific 'orders' event type we defined in C#
    eventSource.addEventListener('customer', (event) => {
      const payload = JSON.parse(event.data);
      console.log(`New Customer ${event.lastEventId}:`, payload.data);
    });

    // Do something when the connection opens
    eventSource.onopen = () => {
      console.log('Connection opened');
    };

    // Handle generic messages (if any)
    eventSource.onmessage = (event) => {
      console.log('Received message:', event);
    };

    // Handle errors and reconnections
    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        console.log('Reconnecting...');
      }
    };
  }

  return (
    <>
      <Typography variant="h1" sx={{ textAlign: "center", mt: 10 }}>Welcome to the Test Application</Typography>
      <Button onClick={openSSEChannel}>Open SSE Channel</Button>
    </>
  )
}

