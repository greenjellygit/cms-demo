import { UserOut } from '@cms/model'
import { queryByAttribute, render } from '@testing-library/react'

import UserDetails from './user-details'

describe('WelcomeText', () => {
    it('should display a provided user data', () => {
        const user: UserOut = {
            id: 1,
            login: 'John',
            createdAt: new Date(),
        }
        const getById = queryByAttribute.bind(null, 'id')
        const dom = render(<UserDetails user={user} />)
        expect(getById(dom.container, 'user_id')?.textContent).toBe('Id: 1')
        expect(getById(dom.container, 'user_name')?.textContent).toBe('Name: John')
        expect(getById(dom.container, 'user_reg_date')?.textContent).toBe(
            'Registration date: less than a minute ago',
        )
    })
})
