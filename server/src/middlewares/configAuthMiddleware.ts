import { Request, Response, NextFunction } from "express";
import config from "../config";
import admin from "firebase-admin";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || null;
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required." });
  }
  try {
    await validateToken(req.method, token);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const validateToken = async (method: string, token: string): Promise<void> => {
  if (method === "GET") {
    verifyApiToken(token);
  } else {
    await verifyIdToken(token);
  }
};

const verifyIdToken = async (token: string) => {
  await admin.auth().verifyIdToken(token);
};

const verifyApiToken = (token: string) => {
  if (token !== config.apiToken) {
    throw new Error("Invalid API token");
  }
};
