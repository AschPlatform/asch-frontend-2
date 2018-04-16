import { SessionStorage, Notify, Dialog } from 'quasar'

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

export const translateErrMsg = (t, input) => {
  // console.log('translateErrInner',language,input);
  // console.log(this)
  if (typeof input === 'string') {
    input = input.split(':')[0]
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
        error: 'Invalid lock height',
        key: 'Invalid lock height'
      },
      {
        error: 'Currency not supported',
        key: 'Currency not supported'
      }
    ]

    for (var idx = 0; idx < translateMap.length; idx++) {
      if (input.indexOf(translateMap[idx].error) > -1) {
        toastError(t(translateMap[idx].key))
        // console.log(translateMap[idx].chinese);
        return
      }
    }
    toastError(input)
  }
}
