import { Socket } from "node:net"

export class Player {
    static #connected: Map<string, Player> = new Map()
    static get connected(): ReadonlySet<Player> {
        return new Set(this.#connected.values())
    }

    public key: string = ''
    public name: string = ''

    constructor(socket: Socket) {}

    async kick() {}
}