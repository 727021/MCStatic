/* eslint-disable */
import { Level } from './levels'
import { Server } from './server'

const server = Server.s

process.on('SIGINT', () => {
  server.stop()
})

process.on('SIGTERM', () => {
  server.stop()
})

server.start()
