import { Request, Response } from "express";
import { Configuration } from "../models/Configuration";
import { RestError } from "../errors/RestError";
import configurationService from "../services/configurationService";
import { ValidationError } from "class-validator";
import { Audience } from "../models/Audience";
import audienceService from "../services/audienceService";
import overrideService from "../services/overrideService";

const create = async (req: Request, res: Response) => {
  const configData = req.body;
  if (!configData) {
    return res.status(400).json({ error: "Body cannot be null" });
  }

  let configuration = Configuration.fromPlain(configData);
  try {
    await configuration.validate();
  } catch (error) {
    if (
      Array.isArray(error) &&
      error.every((e) => e instanceof ValidationError)
    ) {
      const message = Object.values(error[0].constraints || {})[0];
      return res.status(400).json({ error: message });
    }

    console.error("Validation failed for configuration:", error);
    return res.status(400).json({ error: "Invalid configuration" });
  }

  try {
    configuration = await configurationService.create(configuration);
    res.status(201).json(configuration.toObject());
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to create a configuration:", error);
    res.status(500).json({
      error: "Failed to create a configuration, please try again.",
    });
  }
};

const getById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const audienceName = req.query.audience as string;

  try {
    let audience: Audience | null = null;
    if (audienceName) {
      audience = await audienceService.getById(audienceName);
      if (!audience) {
        return res
          .status(400)
          .json({ error: `Audience ${audienceName} not found` });
      }
    }

    const configuration = await configurationService.getById(id, audience);
    if (!configuration) {
      return res.status(400).json({ error: `Configuration ${id} not found` });
    }
    res.status(200).json(configuration.toObject());
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error getting configuration:", error);
    res.status(500).json({ error: "Failed to get a configuration" });
  }
};

const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const configData = req.body;
  if (!configData) {
    return res.status(400).json({ error: "Body cannot be null" });
  }

  try {
    let configuration = await configurationService.getById(id);
    if (!configuration) {
      return res.status(400).json({ error: `Configuration ${id} not found` });
    }

    if (configData.version && configData.version !== configuration.version) {
      return res.status(412).json({
        error:
          "The provided version shows that the entity has been updated in the meantime, please re-fetch the resource first",
      });
    }

    configuration = Configuration.fromPlain({
      ...configuration.toObject(),
      ...configData,
    });

    await configuration.validate();

    configuration = await configurationService.update(configuration);
    res.status(200).json(configuration.toObject());
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (
      Array.isArray(error) &&
      error.every((e) => e instanceof ValidationError)
    ) {
      const message = Object.values(error[0].constraints || {})[0];
      return res.status(400).json({ error: message });
    }

    console.error("Failed to update configuration:", error);
    res.status(500).json({
      error: "Failed to update configuration, please try again.",
    });
  }
};

const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await configurationService.remove(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to delete configuration:", error);
    return res.status(500).json({ error: "Failed to delete configuration" });
  }
};

const getAll = async (req: Request, res: Response) => {
  const audienceName = req.query.audience as string;
  console.log("audienceName", audienceName);
  try {
    let audience: Audience | null = null;
    if (audienceName) {
      audience = await audienceService.getById(audienceName);
      if (!audience) {
        return res
          .status(400)
          .json({ error: `Audience ${audienceName} not found` });
      }
    }

    const configurations = await configurationService.getAll(audience);
    res.status(200).json(configurations.map((config) => config.toObject()));
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to get all configurations:", error);
    res.status(500).json({ error: "Error getting configurations" });
  }
};

const getAllForMobile = async (req: Request, res: Response) => {
  const audienceName = req.query.audience as string;

  try {
    let audience: Audience | null = null;
    if (audienceName) {
      audience = await audienceService.getById(audienceName);
      if (!audience) {
        return res
          .status(400)
          .json({ error: `Audience ${audienceName} not found` });
      }
    }

    const configurations = await configurationService.getAllForMobile(audience);
    res.status(200).send(Object.fromEntries(configurations));
  } catch (error) {
    if (error instanceof RestError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to get all configurations:", error);
    res.status(500).json({ error: "Error getting configurations" });
  }
};

export default {
  create,
  getById,
  update,
  remove,
  getAll,
  getAllForMobile,
};
