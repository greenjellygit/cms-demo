import { UserOut, UserRegister } from '@cms/model'
import { apiClient } from '../api-client/api-client'

export const UserClient = {
    getUsers: (): Promise<UserOut[]> => apiClient.get('/users').then((response) => response.data),
    addUser: (userCreate: UserRegister): Promise<UserOut[]> =>
        apiClient.post('/users', userCreate).then((response) => response.data),
}
