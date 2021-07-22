import React, { useEffect } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import API from '../utils/api'
import { useAuthContext } from './auth/AuthProvider'
import { AxiosResponse } from 'axios'

const Layout: React.FC = ({ children }) => {
  const { login, status, logout } = useAuthContext()

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('logged') !== 'true') {
        logout()
        return
      }
      try {
        const result: AxiosResponse = await API.post(`/refresh_token`, {}, {withCredentials: true})
        login({ at: result.data.accessToken, expire: result.data.expire })
      } catch (e) {
        logout()
        console.log(e)
      }
    })()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {status !== 'pending' && 
        (<>
          <Head>
            <title>Blog</title>
            <meta name="description" content="Blog application" />
          </Head>
          <Navbar />
          <div className="flex-grow">
            { children }
          </div>
          <Footer />
        </>)
      }
    </div>
  )
}

export default Layout
