import { ClassConstructor, ClassTransformOptions, plainToInstance } from 'class-transformer'

export function mapToDto<T, V>(
    cls: ClassConstructor<T>,
    plain: V[],
    options?: ClassTransformOptions,
): T[]
export function mapToDto<T, V>(
    cls: ClassConstructor<T>,
    plain: V,
    options?: ClassTransformOptions,
): T
export function mapToDto<T, V>(
    cls: ClassConstructor<T>,
    plain: V | V[],
    options?: ClassTransformOptions,
): T | T[] {
    return plainToInstance(cls, plain, { excludeExtraneousValues: true, ...options })
}
