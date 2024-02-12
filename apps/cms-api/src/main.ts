import cors from 'cors'
import express from 'express'
import * as path from 'path'
import { routers } from './routers'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/api', routers)

const port = process.env.PORT || 3333
const server = app.listen(port, () => {
    console.log(`Api started at http://localhost:${port}`)
})
server.on('error', console.error)
