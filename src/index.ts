import { Level } from "./levels";
import { Server } from './server'

const server = Server.s

process.on('SIGINT', () => {
    server.stop()
})

server.start()
