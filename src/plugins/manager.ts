import type { Plugin } from '.'

export class PluginManager {
    static #loaded: Map<string, Plugin> = new Map()
    static get loaded(): ReadonlySet<Plugin> {
        return new Set(this.#loaded.values())
    }
}
