import { UserOut } from '@cms/model'
import { apiClient } from '../api-client/api-client'

export const UserClient = {
    getUsers: (): Promise<UserOut[]> => apiClient.get('/users').then((response) => response.data),
    addUser: (userName: string): Promise<UserOut[]> =>
        apiClient.post('/users', { userName }).then((response) => response.data),
}
