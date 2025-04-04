import express, { Request, Response } from "express";
import { Config } from "./config";
import { Cache } from "./storage/Cache";
import { Firestore } from "./storage/DB";
import v1Routes from "./routes/v1Routes";
import cors from "cors";

export class Server {
  private config: Config;
  private health: boolean = true;

  constructor(config: any) {
    this.config = config;
  }

  public async run() {
    await Cache.init(this.config.cache);
    await Firestore.init(this.config.firebase);

    const cache = Cache.getInstance();

    setInterval(async () => {
      try {
        if (!cache.getHealthCheck()) {
          console.log("Redis is not healthy, attempting to reconnect...");
          this.health = false;
          await cache.connect();
        }
        await cache.ping();
      } catch (error) {
        this.health = false;
        console.error("Error during Redis health check or reconnect:", error);
      }
    }, 10000);

    const app = express();
    const port = this.config.port;

    if (process.env.NODE_ENV !== "dev") {
      app.use(cors());
    } else {
      app.use(
        cors({
          origin: `http://localhost:5173`,
          credentials: true,
        })
      );
    }
    app.use(express.json());

    app.get("/health", (req: Request, res: Response) => {
      if (this.health) {
        return res.status(200).json({ status: "UP" });
      } else {
        return res.status(500).json({ status: "DOWN" });
      }
    });

    app.use("/api/v1", v1Routes);

    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  }
}
