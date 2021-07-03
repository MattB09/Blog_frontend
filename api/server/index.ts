const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
// const routes = require('./routes')

const app = express()

const allowedOrigins = ['http://localhost:3000']

app.use(cors({
  origin: function(origin, callback){
    //allow requests with no origin
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },

  credentials: true
}))

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json('hello')
})

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=> {
  console.log(`Server listening at localhost:${PORT}`);
});