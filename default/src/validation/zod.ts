/* NOTE: zod for validation
 * zod works for query, but need to add `coerce` to non-string types
 * nested works for body, not for query
 * swagger docs for query need to use custom decorator (https://github.com/risen228/nestjs-zod/issues/90#issuecomment-2031081132)
 */

import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { SchemaObjectMetadata } from '@nestjs/swagger/dist/interfaces/schema-object-metadata.interface';
import { ZodDto, zodToOpenAPI, validate } from 'nestjs-zod';
import { ZodSchema, ZodTypeDef } from 'nestjs-zod/z';
import { ValidationException } from '.';

export function zodValidate(value: any, metatype: any) {
  const zodMetatype: ZodDto<unknown> = metatype;
  return validate(value, zodMetatype.schema, (zodError) => {
    return new ValidationException(zodError.errors);
  });
}

export function createZodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(schema: ZodSchema<TOutput, TDef, TInput>) {
  class AugmentedZodDto {
    public static isZodDto = true;
    public static schema = schema;

    public static create(input: unknown) {
      return this.schema.parse(input);
    }

    static _OPENAPI_METADATA_FACTORY = () =>
      toSchemaObjectMetadata(zodToOpenAPI(schema));
  }

  return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput>;
}

function toSchemaObjectMetadata(schema: SchemaObject): SchemaObjectMetadata {
  return Object.fromEntries(
    Object.entries(schema.properties as object).map(([key, value]) => [
      key,
      {
        ...value,
        required: (schema.required ?? []).includes(key),
      },
    ]),
  );
}
