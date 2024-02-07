import { render } from '@testing-library/react'

import WelcomeText from './welcome-text'

describe('WelcomeText', () => {
    it('should display a provided text', () => {
        const { getByText } = render(<WelcomeText name="TestName" />)
        expect(getByText(/TestName/i)).toBeTruthy()
    })
})
