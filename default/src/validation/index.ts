import {
    ArgumentMetadata,
    ValidationPipe as ClassValidationPipe,
    Injectable,
    PipeTransform,
  } from '@nestjs/common';
  import { zodValidate } from './zod';
  
  export class ValidationException extends Error {
    errors: any[];
  
    constructor(errors: any[]) {
      super('ValidationException');
      this.errors = errors;
    }
  }
  
  /* NOTE:
   * Implicit conversion transforms string primitives to their actual values
   * e.g.: 'false' (string) -> false (boolean)
   * However, this can lead to issues when a string is actually required
   * e.g.: '123' is a search query, but was implicity converted to a number
   * Use the `Type` decorator from "class-transformer" to denote types
   * e.g.: @Type(() => Number)
   * See: https://stackoverflow.com/questions/59531427/why-should-we-not-use-enableimplicitconversion-when-using-class-transformer
   */
  function classValidationPipe() {
    return new ClassValidationPipe({
      enableDebugMessages: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => {
        return new ValidationException(errors);
      },
    });
  }
  
  @Injectable()
  export class ValidationPipe implements PipeTransform {
    private readonly classValidationPipe = classValidationPipe();
  
    async transform(value: any, metadata: ArgumentMetadata) {
      const metatype: any = metadata.metatype;
      if (metatype?.isZodDto) {
        return zodValidate(value, metatype);
      } else {
        return await this.classValidationPipe.transform(value, metadata);
      }
    }
  }
  