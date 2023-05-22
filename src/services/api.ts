import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

interface createUserData {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const createUser = async (userData: createUserData) => {
  try {
    const response = await api.post('/users', userData)
    return response.data
  } catch (error) {
    throw new Error('Erro ao criar usuário')
  }
}