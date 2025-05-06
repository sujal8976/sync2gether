import app from "./app";
import { WSserver }from './websocket/ws-app';
// start server
const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 5000;

app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

WSserver.listen(WS_PORT, () => {
  console.log(`WebSocket server is running on port ${WS_PORT}`);
})