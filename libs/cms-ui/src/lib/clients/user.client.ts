import { UserCreate, UserOut } from '@cms/model'
import { apiClient } from '../api-client/api-client'

export const UserClient = {
    getUsers: (): Promise<UserOut[]> => apiClient.get('/users').then((response) => response.data),
    addUser: (userCreate: UserCreate): Promise<UserOut[]> =>
        apiClient.post('/users', userCreate).then((response) => response.data),
}
