import { ValidationError, validateOrReject } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypedRequest<T> = Request<{ [key: string]: string }, any, T>
export type TypedResponse<T> = Response<T>
export type SchemaError = {
    prop: string
    errors?: Record<string, string>
    children: SchemaError[]
}

const getValidationErrors = (errors?: ValidationError[]): SchemaError[] =>
    errors?.map((error) => ({
        prop: error.property,
        errors: error.constraints,
        children: getValidationErrors(error.children),
    })) || []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidationSchema = { new (): any }

export const validate =
    (Schema: ValidationSchema) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const object = Object.assign(new Schema(), req.body)
            await validateOrReject(object)
            next()
        } catch (e) {
            const errors = getValidationErrors(e as ValidationError[])
            res.status(StatusCodes.PRECONDITION_FAILED).send(errors)
        }
    }
