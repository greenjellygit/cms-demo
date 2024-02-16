import { UserOut } from '@cms/model'
import { Button, UserClient } from '@cms/ui'
import { IconCirclePlus } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import UserDetails from '../components/user-details/user-details'
import styles from './App.module.scss'

export function App() {
    const [users, setUsers] = useState<UserOut[]>([])
    const [newUserName, setNewUserName] = useState<string>('')

    useEffect(() => {
        UserClient.getUsers().then((usersData) => {
            setUsers(usersData)
        })
    }, [])

    const addNewUser = () => {
        UserClient.addUser(newUserName).then((usersData) => {
            setUsers(usersData)
            setNewUserName('')
        })
    }

    return (
        <div className={styles.test}>
            <h1 className={styles.bla}>
                <span> List of the users:</span>
                {users.map((user) => (
                    <UserDetails key={user.id} user={user} />
                ))}
            </h1>
            <div>
                <div> New user name: </div>
                <input
                    value={newUserName}
                    onChange={(event) => setNewUserName(event.target.value)}
                />
                <Button onClick={addNewUser} disabled={!newUserName} icon={<IconCirclePlus />}>
                    Add new user
                </Button>
            </div>
        </div>
    )
}

export default App
