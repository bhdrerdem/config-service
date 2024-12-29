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

export class ConfigOverride {
  @Expose()
  @IsOptional()
  public id?: string;

  @Expose()
  @IsOptional()
  public audienceId: string;

  @Expose()
  @IsOptional()
  public configurationId: string;

  @Expose()
  @IsOptional()
  public value: string;

  constructor(data: Partial<ConfigOverride> = {}) {
    this.audienceId = data.audienceId ?? "";
    this.configurationId = data.configurationId ?? "";
    this.value = data.value ?? "";
  }

  public static fromPlain(data: Record<string, unknown>): ConfigOverride {
    return plainToInstance(ConfigOverride, data);
  }

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }

  public toObject(): Record<string, unknown> {
    return instanceToPlain(this, {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  public static fromDB(data: any, id: string): ConfigOverride {
    return ConfigOverride.fromPlain({
      id,
      audienceId: data.audienceRef.id,
      configurationId: data.configRef.id,
      value: data.value,
    });
  }
}
