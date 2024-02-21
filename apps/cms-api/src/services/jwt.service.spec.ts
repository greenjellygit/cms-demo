import { HttpStatusCode } from 'axios'
import { addHours, differenceInMinutes } from 'date-fns'
import * as appConfig from '../config/app.config'
import { AppConfig } from '../config/app.config'
import { HttpException } from '../exceptions/http.exception'
import * as jwtService from './jwt.service'

beforeAll(() => {
    const getSettingsMock = jest.spyOn(appConfig, 'getAppConfig')
    getSettingsMock.mockReturnValue({
        jwtExpireTime: 10800, // 3 hours
        jwtSecret: 'hello world of secrets',
    } as AppConfig)
})

describe('jwt.service', () => {
    it('should createAccessToken return token with payload and expiration time', () => {
        // given
        jest.useFakeTimers()
        const mockedDate = new Date('2001-05-17T03:24:20')
        jest.setSystemTime(mockedDate)

        // when
        const accessToken = jwtService.createAccessToken({ userId: 1 })

        // then
        const [headerText, payloadText] = accessToken.split('.')
        const header = JSON.parse(Buffer.from(headerText, 'base64').toString())
        const payload = JSON.parse(Buffer.from(payloadText, 'base64').toString())

        expect(header.typ).toBe('JWT')
        expect(payload.userId).toBe(1)

        const expDate = new Date(payload.exp * 1000)
        expect(differenceInMinutes(expDate, mockedDate)).toBe(180)
    })

    it('should verifyToken return token data', () => {
        const accessToken = jwtService.createAccessToken({ userId: 2 })
        const verifiedToken = jwtService.verifyToken(accessToken)
        expect(verifiedToken).toStrictEqual({ userId: 2 })
    })

    it('should verifyToken throw exception when token expired', () => {
        // given
        const mockedDate = new Date('2001-05-17T03:24:20')
        jest.useFakeTimers()
        jest.setSystemTime(mockedDate)
        const accessToken = jwtService.createAccessToken({ userId: 2 })

        // when
        jest.setSystemTime(addHours(mockedDate, 3))

        // then
        try {
            jwtService.verifyToken(accessToken)
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException)
            expect(error).toHaveProperty('statusCode', HttpStatusCode.Forbidden)
            expect(error).toHaveProperty('message', 'Could not validate credentials')
        }
    })
})
