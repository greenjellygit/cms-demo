import { PasswordUtils } from './password.utils'

describe('PasswordUtils', () => {
    it('should hash return encoded password', async () => {
        const plainPassword = 'this_is_password'
        const encodedPassword = await PasswordUtils.hash(plainPassword)

        expect(encodedPassword).not.toBe(plainPassword)
        expect(encodedPassword.length).toBeGreaterThan(0)
    })

    it('should verify return true when passwords matches', async () => {
        const plainPassword = 'this_is_password'
        const encodedPassword = await PasswordUtils.hash(plainPassword)

        expect(await PasswordUtils.verify(plainPassword, encodedPassword)).toBe(true)

        expect(await PasswordUtils.verify(plainPassword, plainPassword)).toBe(false)
        expect(await PasswordUtils.verify(encodedPassword, encodedPassword)).toBe(false)
        expect(await PasswordUtils.verify('different_password', encodedPassword)).toBe(false)
    })
})
