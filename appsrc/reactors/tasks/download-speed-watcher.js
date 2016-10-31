
import delay from '../delay'

import {opts} from './log'
import mklog from '../../util/log'
const log = mklog('download-speed-watcher')

import * as actions from '../../actions'

const DOWNLOAD_SPEED_DELAY = 2000

export async function downloadSpeedWatcher (store) {
  while (true) {
    try {
      await updateDownloadSpeed(store)
    } catch (e) {
      log(opts, `While updating download speed: ${e.stack || e}`)
    }
  }
}

async function updateDownloadSpeed (store) {
  await delay(DOWNLOAD_SPEED_DELAY)

  const downloadsState = store.getState().downloads
  const activeDownload = downloadsState.activeDownload

  let bps = 0

  if (!downloadsState.downloadsPaused && activeDownload) {
    bps = activeDownload.bps || 0
  }

  store.dispatch(actions.downloadSpeedDatapoint({bps}))
}
