import { formatDistance } from 'date-fns'

export class DateUtils {
    public static formatAsAgo(date: Date): string {
        return formatDistance(date, new Date(), { addSuffix: true })
    }
}
