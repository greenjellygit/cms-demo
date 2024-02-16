import { DateUtils } from '@cms-utils'
import { UserOut } from '@cms/model'
import styles from './user-details.module.scss'

export interface UserDetailsProps {
    user: UserOut
}

export function UserDetails({ user }: UserDetailsProps) {
    return (
        <div className={styles.container}>
            <span id="user_id">Id: {user.id}</span>
            <span id="user_name">Name: {user.name}</span>
            <span id="user_reg_date">
                Registration date: {DateUtils.formatAsAgo(user.registrationDate)}
            </span>
        </div>
    )
}

export default UserDetails
