import { User } from '@cms/model'
import { Request, Router } from 'express'

export const router = Router()

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

router.get('/', (req: Request, res) => {
    res.send(usersDb)
})

router.post('/', (req: Request, res) => {
    usersDb.push({
        id: Math.max(...usersDb.map((user) => user.id)) + 1,
        name: req.body.userName,
        registrationDate: new Date(),
    })
    res.send(usersDb)
})
