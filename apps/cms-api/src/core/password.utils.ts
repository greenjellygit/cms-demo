import bcrypt from 'bcrypt'

export class PasswordUtils {
    public static hash(plainPassword: string): Promise<string> {
        return bcrypt.hash(plainPassword, 10)
    }

    public static verify(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword)
    }
}
