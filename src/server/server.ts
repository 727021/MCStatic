import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { Server as TCPServer, createServer } from 'node:net'

import { generate } from 'randomstring'

import { LEVEL_FOLDER } from '../constants'
import { Level } from '../levels'
import { Player } from '../players'
import { PluginManager } from '../plugins'
import * as log from '../utils/debug'
import { getPublicIp } from '../utils/public-ip'

export class Server {
  static #s: Server | undefined
  static get s() {
    if (!this.#s) {
      this.#s = new Server()
    }
    return this.#s
  }

  private readonly tcp: TCPServer
  private readonly salt: string

  // TODO
  name = 'server'
  motd = 'motd'
  level!: Level

  private constructor() {
    this.tcp = createServer()
    this.salt = generate(16)
  }

  authenticatePlayer(player: Player) {
    return (
      player.key ===
      createHash('md5')
        .update(this.salt + player.name)
        .digest('hex')
    )
  }

  async start() {
    // TODO: Do other setup (load/create config, load main level, connect to db, etc.)
    if (!existsSync(LEVEL_FOLDER)) {
      await mkdir(LEVEL_FOLDER, { recursive: true })
    }
    // TODO: Get main level info from settings
    this.level = (await (Level.exists('main')
      ? Level.load('main')
      : Level.create({
          name: 'main',
          width: 16,
          height: 16,
          depth: 16
        }))) as Level
    return new Promise<void>((resolve, reject) => {
      this.tcp.on('connection', socket => {
        try {
          new Player(socket)
        } catch (error) {
          log.error((error as Error)?.message ?? 'Error')
        }
      })

      this.tcp.on('error', (e: Error & { code?: string }) => {
        if (e.code === 'EADDRINUSE') {
          this.tcp.close(err => {
            log.info('Server is already running')
            log.debug(err)
            reject()
          })
        }
      })
      // TODO: Get port from settings
      const PORT = 25565
      this.tcp.listen(PORT, () => {
        ;(async () => {
          const ip = await getPublicIp()
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const address = this.tcp.address()!
          const addressStr =
            typeof address === 'string' ? address : `${address.address}:${PORT}`
          if (ip) {
            log.log(`Server listening on ${ip}:${PORT} (${addressStr})`)
          } else {
            log.log(`Server listening on ${addressStr}`)
          }
          resolve()
        })().catch(reject)
      })
    })
  }

  async stop() {
    // TODO: other cleanup
    // Kick all players
    log.info('Kicking all players')
    await Player.kickAll('Server closed')
    log.info('Kicked all players')
    // Unload all levels
    log.info('Unloading levels')
    await Promise.allSettled([...Level.loaded].map(level => level.unload()))
    log.info('Unloaded levels')
    // Unload all plugins
    await Promise.allSettled(
      [...PluginManager.loaded].map(plugin => plugin.unload())
    )
    // Close server
    return new Promise<void>((resolve, reject) => {
      this.tcp.close(err => {
        if (err) {
          return reject(err)
        }
        log.log('Server closed')
        resolve()
      })
    })
  }
}
