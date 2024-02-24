import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator'

export class UserRegister {
    @Length(3, 100)
    @IsEmail()
    @IsNotEmpty()
    email: string

    @MinLength(8)
    @IsNotEmpty()
    password: string
}

export class UserOut {
    @Expose() id: string
    @Expose() email: string
    @Expose() createdAt: Date
}
