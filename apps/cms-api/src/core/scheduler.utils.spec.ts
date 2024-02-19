import { onInstanceCreation } from './scheduler.utils'

describe('onInstanceCreation decorator', () => {
    it('should call function after class instance created', () => {
        const mockFunc = jest.fn()

        @onInstanceCreation(() => {
            mockFunc()
        })
        class Test {}

        new Test()
        new Test()

        expect(mockFunc).toHaveBeenCalledTimes(2)
    })

    it('should call function together with constructor', () => {
        const mockFunc = jest.fn()

        @onInstanceCreation(() => {
            mockFunc()
        })
        class Test {
            constructor() {
                mockFunc()
            }
        }

        new Test()
        new Test()

        expect(mockFunc).toHaveBeenCalledTimes(4)
    })

    it('should not call function when instance not created', () => {
        const mockFunc = jest.fn()

        @onInstanceCreation(() => {
            mockFunc()
        })
        class Test {
            constructor() {
                mockFunc()
            }
        }

        expect(mockFunc).toHaveBeenCalledTimes(0)
    })

    it('should provide constructor of decorated class as a parameter', () => {
        let providedParam: any

        @onInstanceCreation((param) => {
            providedParam = param
        })
        class Test {}
        new Test()

        expect(typeof providedParam).toBe('function')
        expect(providedParam.name).toBe('Test')
    })
})
