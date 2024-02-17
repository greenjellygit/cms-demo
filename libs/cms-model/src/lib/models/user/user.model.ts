import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class UserCreate {
    @Length(3, 10)
    @IsNotEmpty()
    login: string
}

export class UserOut {
    @Expose() id: number
    @Expose() login: string
    @Expose() createdAt: Date
}
