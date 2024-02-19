import { IsBoolean, IsInt, IsNotEmpty, Length, validateSync } from 'class-validator'
import { SchemaError, getValidationErrors } from './request.validator'

describe('getValidationErrors', () => {
    it('should return validation errors', async () => {
        class Dog {
            @Length(2, 5)
            @IsNotEmpty()
            name: string

            @IsInt()
            age: number

            @IsBoolean()
            isGoodBoy: boolean
        }

        const dog = Object.assign(new Dog(), { name: '', age: '6', isGoodBoy: 3 })
        const validationResult = await validateSync(dog)

        const errors = getValidationErrors(validationResult)
        expect(errors).toEqual([
            {
                prop: 'name',
                errors: {
                    isLength: 'name must be longer than or equal to 2 characters',
                    isNotEmpty: 'name should not be empty',
                },
                children: [],
            },
            {
                prop: 'age',
                errors: {
                    isInt: 'age must be an integer number',
                },
                children: [],
            },
            {
                prop: 'isGoodBoy',
                errors: {
                    isBoolean: 'isGoodBoy must be a boolean value',
                },
                children: [],
            },
        ] as SchemaError[])
    })
})
