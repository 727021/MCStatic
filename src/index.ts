import { Level } from "./levels";

Level.create({
    name: 'My Level',
    width: 2,
    height: 2,
    depth: 2,
    spawn: {
        x: 0,
        y: 0,
        z: 0,
        rotx: 0,
        roty: 0
    }
}).then(lvl => {
    console.log('done')
    Level.load('My Level').then(loaded => {
        console.log(Level.loaded)
        loaded?.unload()
        console.log(Level.loaded)
    })
})
