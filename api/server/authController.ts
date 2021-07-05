import pool from './db/index'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { createAccessToken, createRefreshToken, accessTokenExpire, refreshTokenExpire} from './auth'

import { Request, response, Response } from 'express'
import { UserInfo } from '../types'
import { access } from 'fs'

const login = async (req: Request, res:Response): Promise<Response> => {
  const email: string = req.body.email
  const password: string = req.body.password
  
  if (!email || !password) {
    return res.json({ error: 'email and password required'})
  }

  let user = await pool.query('SELECT * FROM users WHERE LOWER(email)=$1', [email.toLowerCase()])

  if (user.rowCount === 1) {
    // user is already registered. validate password and send token
    user = user.rows[0]
    try {
      const compareRes = await bcrypt.compare(password, user.password_hash)
      if (compareRes) {
        let payload: UserInfo = {
          userId: user.id,
          email: user.email,
          avatar: user.avatar_color
        }
        res.cookie(
          'rt', 
          createRefreshToken(payload), 
          { 
            expires: new Date(Date.now() + refreshTokenExpire),
            httpOnly: true
          })
        return res.status(200).json({ 
          accessToken: createAccessToken(payload),
          expire: accessTokenExpire
        })
      } else {
        return response.status(401).json({ error: 'Invalid password'})
      }
    } catch (err) {
      console.log(err)
      return res.status(401).json({error: 'Something went wrong while authenticating'})
    }
  }
  // user is not yet registered. Register and send token
  try {
    const password_hash = await bcrypt.hash(password, 10)
    const user_color = colorGenerator()
    user = await pool.query('INSERT INTO users (email, password_hash, avatar_color) VALUES ($1, $2, $3) RETURNING *', [email, password_hash, user_color])
    user = user.rows[0]
    let payload: UserInfo = {
      userId: user.id,
      email: user.email,
      avatar: user.avatar_color
    }
    res.cookie('rt', createRefreshToken(payload), { expires: new Date(Date.now() + refreshTokenExpire), httpOnly: true })
    return res.status(200).json({ accessToken: createAccessToken(payload), expire: accessTokenExpire })
  } catch (err) {
    return response.status(400).json({error: err})
  }
}

const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const token = req.cookies.rt

  if (!token) return response.json({ ok: 'false', rt: '' })

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.REFRESH_SECRET)
  } catch (err) {
    console.log(err)
    return res.json({ ok: 'false', rt: '' })
  }

  let user: UserInfo = { 
    userId: (<any>decoded).userId, 
    email: (<any>decoded).email, 
    avatar: (<any>decoded).avatar
  }

  res.cookie('rt', createRefreshToken(user), { expires: new Date(Date.now() + refreshTokenExpire), httpOnly: true })
  return res.json({ok: 'true', accessToken: createAccessToken(user), expire: accessTokenExpire })
}

const logout = async (req: Request, res: Response): Promise<Response> => {
  res.cookie('rt', '', { httpOnly: true })
  return response.sendStatus(204)
}

export {
  login, 
  refreshToken, 
  logout
}

function colorGenerator(): string {
  const letters = "0123456789ABCDEF";
  let colorString = '#';

  for (let i = 0; i < 6; i++) {
    colorString += letters[(Math.floor(Math.random() * 16))]
  }

  return colorString;
}