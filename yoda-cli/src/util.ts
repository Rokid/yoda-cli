import { inspect } from 'util'
import * as signale from 'signale'
// eslint-disable-next-line no-unused-vars
import { PlatformSelector, IDBusConnection, PlatformClient } from 'yoda-platform-lib'

export function omit (object: object, ...keys: string[]) {
  if (object == null) {
    return object
  }
  var ret = {}
  Object.keys(object).forEach(key => {
    if (keys.indexOf(key) >= 0) {
      return
    }
    const desc = Object.getOwnPropertyDescriptor(object, key)
    if (desc == null) {
      return
    }
    Object.defineProperty(ret, key, desc)
  })
  return ret
}

export async function getClient (connection: IDBusConnection, serial?: string) {
  const devices: any[] = await PlatformSelector.listDevices()
  let device: any
  if (serial) {
    device = devices.find(it => {
      return it.id === serial
    })
  } else {
    device = devices[0]
  }
  if (device == null) {
    throw new Error('No requested device connected')
  }
  const client = new PlatformClient(device.id, connection)
  await client.init()
  return client
}

export function printResult (data: any, command?: string) {
  signale.success(command, '\n', inspect(data, false, null, true))
}
