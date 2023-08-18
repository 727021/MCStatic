import * as log from "./debug"

export const getPublicIp = async () => {
    try {
        const res = await fetch('https://api.ipify.org')
        if (!res.ok) {
            throw res
        }
        const ip = await res.text()
        return ip
    } catch (error) {
        log.warn(error)
        return ''
    }
}
