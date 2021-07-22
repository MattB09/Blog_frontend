import React, { createContext, useContext, useState, FunctionComponent } from "react";
import API from '../../utils/api'
import { UserInfo } from '../../types'

type Props = {
  children: React.ReactNode
}

type AuthContextType = {
  user: number | null,
  status?: string, 
  accessToken: string | null, 
  login: (data: any) => void, 
  logout: () => void
}

const initialVal = {
  user: null,
  status: 'string', 
  accessToken: null, 
  login: (data:any) => {}, 
  logout: () => {}
}

const AuthContext = createContext<AuthContextType>(initialVal)

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<number | null>(null)
  const [status, setStatus] = useState<string>('pending')
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const login = (data: any): void => {
    let parsed: UserInfo = JSON.parse(atob(data.at.split('.')[1]))
    setUser(parsed.userId)
    setAccessToken(data.at)
    setStatus('authenticated')
    localStorage.setItem('logged', 'true')
    startRefreshTimer(data.expire)
  }

  const logout = (): void => {
    setUser(null)
    setAccessToken(null)
    setStatus('unauthenticated')
    localStorage.removeItem('logged')
  }

  const startRefreshTimer = (expiration: number): void => {
    let refreshTimer = setInterval(() => {
      API.post(`refresh_token`, {}, { withCredentials: true }).then(async data => {
        if (data.data.ok === 'true') {
          setAccessToken(data.data.accessToken)
        } else {
          clearInterval(refreshTimer);
          logout()
        }
      })
    }, expiration * 900)
  }

  return (
    <AuthContext.Provider value={{user, status, accessToken, login, logout}}>
      { children }
    </AuthContext.Provider>
  )
}

// Export useContext Hook
export const useAuthContext = (): AuthContextType => {
  return useContext(AuthContext)
}