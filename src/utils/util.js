import { SessionStorage, Notify, Dialog, Platform } from 'quasar'
import AschJs from 'asch-js'
// import { platform } from 'os'

export const alertMsg = (content, duration = 500) => {
  this.$q.notify({
    enter: 'bounceInRight',
    leave: 'bounceOutRight',
    color: 'red',
    icon: 'warning',
    html: content,
    duration: duration,
    position: 'top'
  })
}
export const confirm = (conf, cancel = () => {}, confirm = () => {}) => {
  Dialog.create({
    title: conf.title || 'Confirm',
    message: conf.message,
    confirm: conf.confirm || 'Agree',
    cancel: conf.cancel || 'Disagree'
  })
    .then(() => {
      confirm()
    })
    .catch(() => {
      cancel()
    })
}
// todo
export const deCompileContent = value => {
  return JSON.parse(value)
}
export const compileTimeStamp = value => {
  return AschJs.utils.format.fullTimestamp(value)
}
export const toast = message => {
  const type = 'positive'
  const color = 'positive'
  Notify.create({ message, type, color, position: 'top', timeout: 1500 })
}
export const toastError = message => {
  const type = 'negative'
  const color = 'negative'
  Notify.create({ message, type, color, position: 'top', timeout: 1500 })
}
export const toastWarn = message => {
  const type = 'warning'
  const color = 'warning'
  Notify.create({ message, type, color, position: 'top', timeout: 1500 })
}
export const toastInfo = message => {
  const type = 'info'
  const color = 'info'
  Notify.create({ message, type, color, position: 'top', timeout: 1500 })
}
export const prompt = (config, cb = () => {}, cbCancel = () => {}) => {
  Dialog.create({
    title: config.title || 'Prompt',
    message: config.message || '',
    prompt: config.prompt,
    cancel: config.cancel || true,
    color: config.color || 'primary'
  })
    .then(data => {
      cb(data)
    })
    .catch(e => {
      cbCancel(e)
    })
}

export const setCache = (key, value) => {
  return SessionStorage.set(key, value)
}
export const getCache = key => {
  return SessionStorage.get.item(key)
}
export const removeCache = key => {
  return SessionStorage.remove(key)
}
export const getCurrentSeverUrl = () => {
  let currentServer = getCache('currentServer')
  if (currentServer) {
    let { ip, port } = currentServer
    return 'http://' + ip + ':' + port
  } else {
    return false
  }
}

export const isDesktop = () => {
  return Platform.is.desktop
}

// TODO: untest
export const getTimeFromHight = (block, currentHight) => {
  let { height, timestamp } = block
  let time = (height - currentHight) * 10 + timestamp
  return AschJs.utils.format.fullTimestamp(time)
}

export const getTimeFromTrade = obj => {
  let { tTimestamp, tHeight, endHeight } = obj
  let d = new Date(AschJs.utils.format.fullTimestamp(tTimestamp))
  let start = d.getTime()
  let end = (endHeight - tHeight) * 10000
  let total = new Date(start + end)
  let month = total.getMonth() + 1
  let day = total.getDate()
  if (day < 10) {
    day = '0' + day
  }
  let h = total.getHours()
  let m = total.getMinutes()
  let s = total.getSeconds()
  if (h < 10) {
    h = '0' + h
  }

  if (m < 10) {
    m = '0' + m
  }

  if (s < 10) {
    s = '0' + s
  }
  return total.getFullYear() + '/' + month + '/' + day + ' ' + h + ':' + m + ':' + s
}

export const getTimeFromEndHeight = ({endHeight, currentHeight}) => {
  let now = new Date().getTime()
  let gap = (endHeight - currentHeight) * 10000
  return getFormedTime(now + gap)
}

export const getFormedTime = (timestamp) => {
  let time = new Date(timestamp)
  let month = time.getMonth() + 1
  let day = time.getDate()
  if (day < 10) {
    day = '0' + day
  }
  let h = time.getHours()
  let m = time.getMinutes()
  let s = time.getSeconds()
  if (h < 10) {
    h = '0' + h
  }

  if (m < 10) {
    m = '0' + m
  }

  if (s < 10) {
    s = '0' + s
  }
  return time.getFullYear() + '/' + month + '/' + day + ' ' + h + ':' + m + ':' + s
}

export const translateErrMsg = (t, input) => {
  if (typeof input === 'string') {
    input = input.split(':')[1]
    var translateMap = [
      {
        error: 'Failed to verify second signature',
        key: 'ERR_TOAST_SECONDKEY_WRONG'
      },
      {
        error: 'Invalid transaction amount',
        key: 'ERR_TOAST_SECONDKEY_WRONG'
      },
      { error: 'Asset not exists', key: 'ERR_TOAST_ASSET_NOTEXIST' },
      {
        error: 'Insufficient balance',
        key: 'ERR_TOAST_ASSET_INSUFFICIENT'
      },
      {
        error: 'Voting limit exceeded. Maximum is 33 votes per transaction',
        key: 'ERR_TOAST_VOTE_LIMIT'
      },
      {
        error: 'Account is locked',
        key: 'ERR_TOAST_ACCOUNT_ALREADY_LOCKED'
      },
      {
        error: 'Invalid recipient',
        key: 'ERR_TOAST_ACCOUNT_INVALID_RECIPIENT'
      },
      {
        error: 'timestamp',
        key: 'ERR_TOAST_ACCOUNT_INVALID_TIMESTAMP'
      },
      {
        error: 'Currency not supported',
        key: 'Currency not supported'
      },
      {
        error: 'Invalid lock height',
        key: 'ERR.INVALID_LOCK_HEIGHT'
      },
      {
        error: 'Agent cannot set agent',
        key: 'AGENT_CAN_NOT_SET_AGENT'
      }
    ]
    for (var idx = 0; idx < translateMap.length; idx++) {
      if (input.indexOf(translateMap[idx].error) > -1) {
        toastError(t(translateMap[idx].key))
        return
      }
    }
    toastError(input)
  }
}
