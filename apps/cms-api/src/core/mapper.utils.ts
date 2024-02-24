import {
    ClassConstructor,
    ClassTransformOptions,
    Transform,
    plainToInstance,
} from 'class-transformer'

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

export function Boolean(): PropertyDecorator {
    const mapFunction = Transform(({ value }) => [true, 'enabled', 'true'].indexOf(value) > -1)
    return (target: object, propertyName: string | symbol): void =>
        mapFunction(target, propertyName)
}
