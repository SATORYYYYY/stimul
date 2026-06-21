import { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      api.get('/users/profile/')
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    try {
      const response = await api.post('/token/', { username, password })
      const { access, refresh } = response.data
      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)
      const profileRes = await api.get('/users/profile/')
      setUser(profileRes.data)
    } catch (error) {
      console.error('Login error:', error)

      let errorMessage = 'Ошибка входа. Проверьте данные.'

      if (error.response) {
        const { data, status } = error.response

        if (status === 401) {
          errorMessage = 'Неверное имя пользователя или пароль'
        } else if (status === 400) {
          if (data.detail) {
            errorMessage = data.detail
          } else if (data.non_field_errors) {
            errorMessage = data.non_field_errors[0]
          } else if (typeof data === 'string') {
            errorMessage = data
          }
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/users/register/', userData)
      return response
    } catch (error) {
      console.error('Register error:', error)
      throw error // Пробрасываем ошибку для обработки в компоненте
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}