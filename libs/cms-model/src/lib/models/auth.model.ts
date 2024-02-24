import { IsEmail, IsNotEmpty } from 'class-validator'

export class AuthCredentials {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
}
