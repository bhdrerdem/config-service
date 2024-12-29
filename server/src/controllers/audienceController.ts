import { Request, Response } from "express";
import { Audience } from "../models/Audience";
import { RestError } from "../errors/RestError";
import audienceService from "../services/audienceService";

const create = async (req: Request, res: Response) => {
  const audienceData = req.body;
  if (!audienceData) {
    return res.status(400).json({ error: "Body cannot be empty" });
  }

  let audience = Audience.fromPlain(audienceData);
  try {
    await audience.validate();
  } catch (error) {
    console.error("Validation failed for audience:", error);
    return res.status(400).json({ error: "Invalid audience data" });
  }

  try {
    const existingAudience = await audienceService.getById(audience.name);
    if (existingAudience) {
      return res.status(400).json({ error: "Audience already exists" });
    }

    audience = await audienceService.create(audience);
    res.status(201).json(audience.toObject());
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to create an audience:", error);
    res.status(500).json({
      error: "Failed to create an audience, please try again.",
    });
  }
};

const getById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const audience = await audienceService.getById(id);
    if (!audience) {
      return res.status(400).json({ error: `Audience ${id} not found` });
    }
    res.status(200).json(audience.toObject());
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error getting audience:", error);
    res.status(500).json({ error: "Failed to get an audience" });
  }
};

const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const audienceData = req.body;
  if (!audienceData) {
    return res.status(400).json({ error: "Body cannot be null" });
  }

  try {
    let audience = await audienceService.getById(id);
    if (!audience) {
      return res.status(400).json({ error: `Audience ${id} not found` });
    }

    audience = Audience.fromPlain({
      ...audience.toObject(),
      ...audienceData,
    });

    await audience.validate();

    audience = await audienceService.update(audience);
    res.status(200).json(audience.toObject());
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to update audience:", error);
    res.status(500).json({
      error: "Failed to update audience, please try again.",
    });
  }
};

const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await audienceService.remove(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to delete audience:", error);
    return res.status(500).json({ error: "Failed to delete audience" });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const audiences = await audienceService.getAll();
    res.status(200).json(audiences.map((audience) => audience.toObject()));
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to get all audiences:", error);
    res.status(500).json({ error: "Error getting audiences" });
  }
};

export default {
  create,
  getById,
  update,
  remove,
  getAll,
};
