import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import { UserInfo } from '../types'

const accessTokenExpire: string = "5m"
const refreshTokenExpire: string = "7d"

const createAccessToken = (user: UserInfo): string => {
  return jwt.sign(
    user, 
    process.env.JWT_SECRET, 
    {expiresIn: accessTokenExpire}
  )
}

const createRefreshToken = (user:UserInfo): string => {
  return jwt.sign(
    user,
    process.env.JWT_SECRET, 
    {expiresIn: refreshTokenExpire}
  )
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) res.sendStatus(401)
      else next()
    })
  } else {
    res.sendStatus(401)
  }
}

const authenticateRefresh = (req: Request, res: Response, next: NextFunction) => {
  const { cookies } = req
  if ('rt' in cookies && cookies['rt']) {
    jwt.verify(cookies['rt'], process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) res.sendStatus(401)
      else next()
    })
  } else {
    res.sendStatus(401)
  }
}

module.exports = { 
  createAccessToken,
  createRefreshToken,
  authenticate,
  authenticateRefresh,
  accessTokenExpire
}