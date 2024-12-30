import { Request, Response } from "express";
import { RestError } from "../errors/RestError";
import configurationService from "../services/configurationService";
import audienceService from "../services/audienceService";
import overrideService from "../services/overrideService";
import { Audience } from "../models/Audience";
import { ConfigOverride } from "../models/ConfigOverride";

const create = async (req: Request, res: Response) => {
  const audience = req.body.audience;
  const configuration = req.body.configuration;
  const value = req.body.value as string;

  try {
    let override = await ConfigOverride.fromPlain({
      audience,
      configuration,
      value,
    });

    override = await overrideService.create(override);
    res.status(201).json(override.toObject());
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to create a configuration override:", error);
    res
      .status(500)
      .json({ error: "Failed to create a configuration override" });
  }
};

const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const value = req.body.value as string;

  if (!value) {
    return res.status(400).json({ error: "Field 'value' is required" });
  }

  try {
    const override = await overrideService.getById(id);
    override.value = value;

    await overrideService.update(override);
    res.status(200).json(override.toObject());
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to update a configuration override:", error);
    res
      .status(500)
      .json({ error: "Failed to update a configuration override" });
  }
};

const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await overrideService.remove(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to delete override:", error);
    return res.status(500).json({ error: "Failed to delete override" });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const overrides = await overrideService.getAllForUI();
    res.status(200).json(overrides.map((o) => o.toObject()));
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to get all override:", error);
    return res.status(500).json({ error: "Failed to get all override" });
  }
};

export default {
  create,
  update,
  remove,
  getAll,
};
