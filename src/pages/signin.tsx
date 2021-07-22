import React, {FormEvent, FunctionComponent, useState, useEffect } from "react"
import { useRouter, NextRouter } from 'next/router'
import { useAuthContext } from "../components/auth/AuthProvider"
import API from '../utils/api'

const SignIn: React.FC = () => {
  const { status, login } = useAuthContext()
  const [email, setEmail] = useState<string>('')
  const [signupEmail, setSignupEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('')
  const router: NextRouter = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  const handleSignInSubmit = async (clickEvent:FormEvent<HTMLFormElement>): Promise<void> => {
    clickEvent.preventDefault()

    if (email === '' || password === '') {
      alert("must fill out form");
      return;
    }

    try {
      const result = await API.post(`/login`, {email, password}, {withCredentials: true})
      login({ at: result.data.accessToken, expire: result.data.expire })
      router.push('/')
    } catch (err) {
      console.log(`login failed with error ${err}`)
      alert('username or password is incorrect.')
    }
  }

  const handleSignupSubmit = async (clickEvent: FormEvent<HTMLFormElement>): Promise<void> => {
    clickEvent.preventDefault()

    if (signupEmail === '' || signupPassword === '') {
      alert("must fill out form");
      return;
    }

    try {
      const result = await API.post(`/signup`, {signupEmail, signupPassword}, {withCredentials: true})
      login({ at: result.data.accessToken, expire: result.data.expire })
      router.push('/')
    } catch (err) {
      console.log(`signup failed with error ${err}`)
      alert('A user is already registered to that email address.')
    }

  }

  return (
    <main className="flex flex-col md:flex-row justify-center px-4 mt-14 mx-auto">
      {status == 'unauthenticated' && 
      (<>
      <div className="w-full sm:w-80 md:mr-16 mx-auto md:mx-0 justify-center"> 
        <h1 className="font-bold text-4xl tracking-wide block text-blue-800">Sign In</h1>
        <form onSubmit={handleSignInSubmit} className="mt-4">

          <label htmlFor="email" className="block text-sm text-gray-600 mb-2">Email</label>
          <input id="email" value={email} type="email" placeholder="email" className="w-full px-4 py-1 rounded" 
              onChange={e => setEmail(e.target.value)} />

          <label htmlFor="password" className="block text-sm text-gray-600 mt-4 mb-2">Password</label>
          <input id="password" value={password} type="password" placeholder="password" className="w-full px-4 py-1 rounded"
            onChange={e => setPassword(e.target.value)} />      
          
          <button type="submit" className="bg-blue-800 text-gray-100 py-1 rounded text-center w-full mt-8">Sign In</button>
        </form>
      </div>

      <div className="w-full sm:w-80 mt-16 md:mt-0 mx-auto md:mx-0">  
        <h1 className="font-bold text-4xl tracking-wide block text-blue-800">Sign up</h1>
        <form onSubmit={handleSignupSubmit} className="mt-4">

          <label htmlFor="signupEmail" className="block text-sm text-gray-600 mb-2">Email</label>
          <input id="signupEmail" value={signupEmail} type="email" placeholder="email" className="w-full px-4 py-1 rounded" 
              onChange={e => setSignupEmail(e.target.value)} />

          <label htmlFor="signupPassword" className="block text-sm text-gray-600 mt-4 mb-2">Password</label>
          <input id="signupPassword" value={signupPassword} type="password" placeholder="password" className="w-full px-4 py-1 rounded"
            onChange={e => setSignupPassword(e.target.value)} />
            
          
          <button type="submit" className="bg-blue-800 text-gray-100 py-1 rounded text-center w-full mt-8">Sign Up</button>
        </form>
      </div>
      </>)}
    </main>
  )
}

export default SignIn