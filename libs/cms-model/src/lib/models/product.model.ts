import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class ProductCreate {
    @Length(3, 100)
    @IsNotEmpty()
    name: string
}

export class ProductOut {
    @Expose() id: string
    @Expose() name: string
}
