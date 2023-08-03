import { Server as TCPServer, createServer } from 'node:net'
import { createHash } from 'node:crypto'

import { generate } from 'randomstring'

import { Level } from '../levels'
import { PluginManager } from '../plugins'
import { Player } from '../players'

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

    private constructor() {
        this.tcp = createServer()
        this.salt = generate(16)
    }

    authenticatePlayer(player: Player) {
        return player.key === createHash('md5').update(this.salt + player.name).digest('hex')
    }

    async start() {
        // TODO: Do other setup (load/create config, load main level, connect to db, etc.)
        return new Promise<void>((resolve, reject) => {
            this.tcp.on('connection', socket => {
                new Player(socket)
            })

            this.tcp.on('error', (e: Error & { code?: string }) => {
                if (e.code === 'EADDRINUSE') {
                    this.tcp.close(err => {
                        reject(err ?? e)
                    })
                }
            });
            this.tcp.listen(25565, () => {
                console.log('Server listening on', this.tcp.address())
                resolve()
            })
        })
    }

    async stop() {
        // TODO: other cleanup
        // Kick all players
        await Promise.allSettled([...Player.connected].map(player => player.kick()))
        // Unload all levels
        await Promise.allSettled([...Level.loaded].map(level => level.unload()))
        // Unload all plugins
        await Promise.allSettled([...PluginManager.loaded].map(plugin => plugin.unload()))
        // Close server
        return new Promise<void>((resolve, reject) => {
            this.tcp.close(err => {
                if (err) {
                    return reject(err)
                }
                console.log('Server closed')
                resolve()
            })
        })
    }
}


