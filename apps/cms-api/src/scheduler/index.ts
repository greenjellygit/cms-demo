import { DB } from '../config/db.config'
import MailScheduler from './mail.scheduler'

export const startSchedulers = () => {
    const db = DB.fork()
    new MailScheduler(db)
}
