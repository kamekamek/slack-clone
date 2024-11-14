import type { Express } from "express";
import { db } from "../db";
import { channels, messages } from "../db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Get all channels
  app.get("/api/channels", async (req, res) => {
    try {
      const allChannels = await db.select().from(channels);
      res.json(allChannels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch channels" });
    }
  });

  // Create a new channel
  app.post("/api/channels", async (req, res) => {
    try {
      const { name } = req.body;
      const [channel] = await db.insert(channels).values({ name }).returning();
      res.status(201).json(channel);
    } catch (error) {
      res.status(500).json({ error: "Failed to create channel" });
    }
  });

  // Get all messages
  app.get("/api/messages", async (req, res) => {
    try {
      const allMessages = await db.select().from(messages);
      res.json(allMessages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Create a new message
  app.post("/api/messages", async (req, res) => {
    try {
      const { channelId, content, userName } = req.body;
      const [message] = await db
        .insert(messages)
        .values({ channelId, content, userName })
        .returning();
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to create message" });
    }
  });
}
