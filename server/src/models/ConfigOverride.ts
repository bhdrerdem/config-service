import { firestore } from "firebase-admin";
import {
  Expose,
  Transform,
  plainToInstance,
  instanceToPlain,
} from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  validateOrReject,
  Matches,
} from "class-validator";
import { Audience } from "./Audience";
import { Configuration } from "./Configuration";
import audienceService from "../services/audienceService";
import configurationService from "../services/configurationService";
import { RestError } from "../errors/RestError";

export class ConfigOverride {
  @Expose()
  @IsOptional()
  public id?: string;

  @Expose()
  @IsOptional()
  public audience!: Audience;

  @Expose()
  @IsOptional()
  public configuration!: Configuration;

  @Expose()
  @IsOptional()
  public value: string;

  constructor(data: Partial<ConfigOverride> = {}) {
    this.audience = data.audience ?? new Audience();
    this.configuration = data.configuration ?? new Configuration();
    this.value = data.value ?? "";
  }

  public static async fromPlain(
    data: Record<string, unknown>,
    includes: string[] = []
  ): Promise<ConfigOverride> {
    try {
      const overrideData: Partial<ConfigOverride> = {
        value: (data.value as string) || "",
        id: (data.id as string) || "",
      };

      if (
        !data.audience ||
        typeof data.audience !== "object" ||
        !("name" in data.audience)
      ) {
        throw new RestError(`Audience is required`, 400);
      }

      overrideData.audience = plainToInstance(Audience, data.audience);
      if (includes.includes("audience")) {
        const audience = await audienceService.getById(
          (data.audience as Record<string, string>).name
        );
        if (!audience) {
          throw new RestError(`Audience ${data.audience.name} not found`, 404);
        }
        overrideData.audience = audience;
      }

      if (
        !data.configuration ||
        typeof data.configuration !== "object" ||
        !("id" in data.configuration)
      ) {
        throw new RestError(`Configuration is required`, 400);
      }

      overrideData.configuration = plainToInstance(
        Configuration,
        data.configuration
      );
      if (includes.includes("configuration")) {
        const configuration = await configurationService.getById(
          (data.configuration as Record<string, string>).id
        );
        if (!configuration) {
          throw new RestError(
            `Configuration ${data.configuration.id} not found`,
            404
          );
        }
        overrideData.configuration = configuration;
      }

      return plainToInstance(ConfigOverride, overrideData);
    } catch (error) {
      if (error instanceof RestError) {
        throw error;
      }

      console.error(`Error in fromPlain: ${error}`);
      throw new Error(`Failed to transform data from plain`);
    }
  }

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }

  public toObject(): Record<string, unknown> {
    return instanceToPlain(this, {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  public static async fromDB(
    data: any,
    id: string,
    includes: string[] = []
  ): Promise<ConfigOverride> {
    if (!data.audienceRef) {
      throw new Error("Audience reference cannot be null");
    }

    data.audience = {
      name: data.audienceRef.id,
    };

    if (!data.configRef) {
      throw new Error("Configuration reference cannot be null");
    }

    data.configuration = {
      id: data.configRef.id,
    };

    data.id = id;

    return ConfigOverride.fromPlain(data, includes);
  }
}
