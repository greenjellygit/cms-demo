import { addDays, subDays, subMonths } from 'date-fns'
import { DateUtils } from './date.utils'

describe('DateUtils.formatAsAgo', () => {
    it('should return current date formatted', () => {
        const given = new Date()
        expect(DateUtils.formatAsAgo(given)).toBe('less than a minute ago')
    })
    it('should return date 3 ago formatted', () => {
        const given = subDays(new Date(), 3)
        expect(DateUtils.formatAsAgo(given)).toBe('3 days ago')
    })
    it('should return date 3 months ago formatted', () => {
        const given = subMonths(new Date(), 3)
        expect(DateUtils.formatAsAgo(given)).toBe('3 months ago')
    })
    it('should return date 3 days in future formatted', () => {
        const given = addDays(new Date(), 3)
        expect(DateUtils.formatAsAgo(given)).toBe('in 3 days')
    })
})
