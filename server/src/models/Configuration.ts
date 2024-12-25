import { firestore } from "firebase-admin";
import {
  Expose,
  Transform,
  plainToInstance,
  instanceToPlain,
  Type,
} from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  validateOrReject,
} from "class-validator";

export class Configuration {
  @Expose()
  @IsString()
  @IsOptional()
  public id?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public parameterKey: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public value: string;

  @Expose()
  @IsString()
  @IsOptional()
  public description?: string;

  @Expose()
  @Transform(({ value }: { value: any }) => {
    if (value instanceof firestore.Timestamp) {
      return value.toDate();
    }

    if (typeof value === "string") {
      return new Date(value);
    }

    if (value instanceof Date) {
      return value;
    }

    return new Date();
  })
  @IsOptional()
  public createdAt?: Date;

  @Expose()
  @Transform(({ value }: { value: any }) => {
    if (value instanceof firestore.Timestamp) {
      return value.toDate();
    }

    if (typeof value === "string") {
      return new Date(value);
    }

    if (value instanceof Date) {
      return value;
    }

    return new Date();
  })
  @IsOptional()
  public updatedAt?: Date;

  @Expose()
  @IsNumber()
  @IsOptional()
  public version: number = 1;

  constructor(data: Partial<Configuration> = {}) {
    this.parameterKey = data.parameterKey ?? "";
    this.value = data.value ?? "";
  }

  public static fromPlain(data: Record<string, unknown>): Configuration {
    console.log("data2", data);
    return plainToInstance(Configuration, data);
  }

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }

  public toObject(): Record<string, unknown> {
    return instanceToPlain(this, {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  public static fromDB(data: any, id: string): Configuration {
    if (data?.createdAt instanceof firestore.Timestamp) {
      data.createdAt = data.createdAt.toDate();
    }
    if (data?.updatedAt instanceof firestore.Timestamp) {
      data.updatedAt = data.updatedAt.toDate();
    }

    return Configuration.fromPlain({
      ...data,
      id,
    });
  }
}
