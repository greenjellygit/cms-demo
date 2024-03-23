/* eslint-disable @typescript-eslint/no-unused-vars */

import { onInstanceCreation } from './scheduler.utils'

describe('onInstanceCreation decorator', () => {
    it('should execute callback after class instance created', () => {
        const callbackFunc = jest.fn()

        @onInstanceCreation(callbackFunc)
        class Test {}

        new Test()
        new Test()

        expect(callbackFunc).toHaveBeenCalledTimes(2)
    })

    it('should execute callback together with constructor', () => {
        const callbackFunc = jest.fn()
        const constructorFunc = jest.fn()

        @onInstanceCreation(callbackFunc)
        class Test {
            constructor() {
                constructorFunc()
            }
        }

        new Test()
        new Test()

        expect(callbackFunc).toHaveBeenCalledTimes(2)
        expect(constructorFunc).toHaveBeenCalledTimes(2)
    })

    it('should not execute callback when instance is not created', () => {
        const callbackFunc = jest.fn()

        @onInstanceCreation(() => {
            callbackFunc()
        })
        class Test {
            constructor() {
                callbackFunc()
            }
        }

        expect(callbackFunc).toHaveBeenCalledTimes(0)
    })

    it('should provide instance of decorated class as a callback parameter', () => {
        @onInstanceCreation((param) => {
            expect(param.privateProp).toBe('private prop')
            expect(param.publicProp).toBe('public prop')
            // eslint-disable-next-line no-use-before-define
            expect(param instanceof Test)
        })
        class Test {
            public publicProp: string
            constructor(
                private privateProp: string,
                public prop: string,
            ) {
                this.publicProp = prop
            }
        }

        new Test('private prop', 'public prop')
    })
})
