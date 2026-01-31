# What I Have done

I implemented SSE ( Server Side Event) in order that backend can call frontend ( one way channel ).
Basically Frontend open the connection in the HomePage.tsx, calling api/customers/realtime

In the browser Network Tab you will see a pendig call. This means that the channel is open.
Now you can open swagger UI and call the pushInChannel api.

You will notice that the pending call receive a response in Stream subTab, and the frontend will be notified.

Notice that this is a very basic configuration. You can implement also an automatic reconnection if backend goes offline for a while.
