import { User, UserCreate } from '@cms/model'

const usersDb: User[] = [
    {
        id: 1,
        name: 'John',
        registrationDate: new Date(new Date().setDate(new Date().getDate() - 125)),
    },
    {
        id: 2,
        name: 'Mike',
        registrationDate: new Date(new Date().setDate(new Date().getDate() - 45)),
    },
    {
        id: 3,
        name: 'Adam',
        registrationDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    },
]

export function getUsers(): User[] {
    return usersDb
}

export function createUser(userCreate: UserCreate): User[] {
    usersDb.push({
        id: Math.max(...usersDb.map((user) => user.id)) + 1,
        name: userCreate.userName,
        registrationDate: new Date(),
    })
    return usersDb
}
