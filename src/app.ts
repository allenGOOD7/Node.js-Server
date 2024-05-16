import express from 'express'

import type { Express, Request, Response } from 'express'
import 'dotenv/config'

const port = process.env.PORT

const app: Express = express()

app.get('/', (request: Request, response: Response) => {
  response.type('text/plain')
  response.send('HelloWorld')
})

app.get('/articles', (request: Request, response: Response) => {
  response.type('text/plain')
  response.send('All articles are here!')
})

app.get('/about-me', (request: Request, response: Response) => {
  response.type('text/plain')
  response.send('My name is Allen.')
})

app.use((request: Request, response: Response) => {
  response.type('text/plain')
  response.status(404)
  response.send('Page is not found222.')
})

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`)
})
