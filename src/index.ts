/* eslint-disable */
import { Server } from './server'
import * as log from './utils/debug'

const server = Server.s

const exit = async () => {
  log.info('Shutting down...')
  await server.stop()
  process.exit()
}

process.once('SIGINT', exit)
process.once('SIGTERM', exit)

process.on('unhandledRejection', e => log.error(e))

server.start()
