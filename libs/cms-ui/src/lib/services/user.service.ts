import { User } from '@cms/model'
import { apiClient } from '../api-client/api-client'

export const UserService = {
    getUsers: (): Promise<User[]> => apiClient.get('/users').then((response) => response.data),
    addUser: (userName: string): Promise<User[]> =>
        apiClient.post('/users', { userName }).then((response) => response.data),
}
