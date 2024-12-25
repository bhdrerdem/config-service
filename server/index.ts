import config from "./src/config";
import { Server } from "./src/server";

const server = new Server(config);

(async () => {
  await server.run();
})().catch((error) => {
  console.error("Error starting server:", error);
});
