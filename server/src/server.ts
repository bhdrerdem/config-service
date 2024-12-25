import express, { Request, Response } from "express";
import { Config } from "./config";
import { Redis } from "./storage/Redis";
import { Firestore } from "./storage/DB";
import v1Routes from "./routes/v1Routes";

export class Server {
  private config: Config;
  private health: boolean = true;

  constructor(config: any) {
    this.config = config;
  }

  public async run() {
    await Redis.init(this.config.redis);
    await Firestore.init(this.config.firebase);

    const redis = Redis.getInstance();

    setInterval(async () => {
      try {
        if (!redis.getHealthCheck()) {
          console.log("Redis is not healthy, attempting to reconnect...");
          this.health = false;
          await redis.connect();
        }
        await redis.ping();
      } catch (error) {
        this.health = false;
        console.error("Error during Redis health check or reconnect:", error);
      }
    }, 10000);

    const app = express();
    const port = this.config.port;

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
