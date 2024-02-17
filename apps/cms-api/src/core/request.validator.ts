import { HttpStatusCode } from 'axios'
import { ValidationError, validateOrReject } from 'class-validator'

// eslint-disable-next-line no-restricted-imports
import { NextFunction, Request, Response } from 'express'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidationSchema = { new (): any }

export type TypRequest<T> = Request<{ [key: string]: string }, unknown, T>
export type TypResponse<T> = Response<T>
export type SchemaError = {
    prop: string
    errors?: Record<string, string>
    children: SchemaError[]
}

function getValidationErrors(errors?: ValidationError[]): SchemaError[] {
    return (
        errors?.map((error) => ({
            prop: error.property,
            errors: error.constraints,
            children: getValidationErrors(error.children),
        })) || []
    )
}

export const validate =
    (Schema: ValidationSchema) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const object = Object.assign(new Schema(), req.body)
            await validateOrReject(object)
            next()
        } catch (e) {
            const errors = getValidationErrors(e as ValidationError[])
            res.status(HttpStatusCode.PreconditionFailed).send(errors)
        }
    }
