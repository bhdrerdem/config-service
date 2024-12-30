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

export class Audience {
  @Expose()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: "Name must be a string without spaces and in uppercase",
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Name must contain only letters, numbers and underscores",
  })
  public name: string;

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

  constructor(data: Partial<Audience> = {}) {
    this.name = data.name ?? "";
    this.description = data.description;
  }

  public static fromPlain(data: Record<string, unknown>): Audience {
    return plainToInstance(Audience, data);
  }

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }

  public toObject(): Record<string, unknown> {
    return instanceToPlain(this, {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  public static fromDB(data: any, id: string): Audience {
    if (data?.createdAt instanceof firestore.Timestamp) {
      data.createdAt = data.createdAt.toDate();
    }
    if (data?.updatedAt instanceof firestore.Timestamp) {
      data.updatedAt = data.updatedAt.toDate();
    }

    return Audience.fromPlain({
      ...data,
      name: id,
    });
  }
}
