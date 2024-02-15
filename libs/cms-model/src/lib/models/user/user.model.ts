import { IsNotEmpty, Length } from 'class-validator'

export class UserCreate {
    @Length(3, 10)
    @IsNotEmpty()
    userName: string
}

export class UserOut {
    id: number
    name: string
    registrationDate: Date
}
