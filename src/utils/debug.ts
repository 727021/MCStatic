import debug from 'debug'

export const log = debug('mcs')

export const packet = log.extend('packet')
export const raw = packet.extend('raw')
export const warn = log.extend('warn')
export const error = log.extend('error')
export const info = log.extend('info')
export const command = log.extend('command')
export const chat = log.extend('chat')

log.enabled = true
