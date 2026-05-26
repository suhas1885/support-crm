import express from 'express'
import { applyMiddleware } from './middleware/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'
import apiRouter from './routes/index.js'
import { getRoot } from './controllers/root.controller.js'

const app = express()

applyMiddleware(app)

app.get('/', getRoot)
app.use('/api', apiRouter)

app.use(notFound)
app.use(errorHandler)

export default app
