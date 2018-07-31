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
    return currentServer
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
        error: 'Invalid issuer name',
        key: 'ERR.INVALID_ISSUER_NAME'
      },
      {
        error: 'Sender account not found',
        key: 'ERR.ACCOUNT_NOT_FOUND'
      },
      {
        error: 'Agent cannot set agent',
        key: 'AGENT_CAN_NOT_SET_AGENT'
      },
      {
        error: 'Recipient name not exist',
        key: 'ERR.RECIPIENT_NAME_NOT_EXIST'
      },
      {
        error: 'Invalid name',
        key: 'ERR.INVALID_NAME'
      },
      {
        error: 'Name already registered',
        key: 'ERR.NAME_ALREADY_EXIST'
      },
      {
        error: 'Name already setName',
        key: 'ERR.NAME_ALREADY_SET'
      },
      {
        error: 'Password already set',
        key: 'ERR.PASSWORD_ALREADY_SET'
      },
      {
        error: 'Agent account cannot lock',
        key: 'ERR.AGENT_CANNOT_LOCK'
      },
      {
        error: 'Invalid height or amount',
        key: 'ERR.LOCK_HEIGHT_AMOUNT_ERROR'
      },
      {
        error: 'Invalid height or amount',
        key: 'ERR.LOCK_HEIGHT_AMOUNT_ERROR'
      },
      {
        error: 'Invalid amount',
        key: 'ERR.LOCK_AMOUNT_ERROR'
      },
      {
        error: 'Agent account not found',
        key: 'ERR.AGENT_ACCOUNT_NOT_ENOUGH'
      },
      {
        error: 'Account not found',
        key: 'ERR.ACCOUNT_NOT_ENOUGH'
      },
      {
        error: 'Account is not locked',
        key: 'ERR.ACCOUNT_NOT_LOCK'
      },
      {
        error: 'Account cannot unlock',
        key: 'ERR.ACCOUNT_CAN_NOT_UNLOCK'
      },
      {
        error: 'Agent already have a role',
        key: 'ERR.AGENT_ALREADY_ROLED'
      },
      {
        error: 'Agent must have a name',
        key: 'PLEASE_SET_NAME'
      },
      {
        error: 'Locked account cannot be agent',
        key: 'ERR.AGENT_CAN_NOT_LOCK'
      },
      {
        error: 'Account already voted',
        key: 'ERR.ALREADY_VOTE'
      },
      {
        error: 'Agent cannot set agent',
        key: 'ERR.AGENT_CAN_NOT_SET_AGENT'
      },
      {
        error: 'Agent already set',
        key: 'ERR.AGENT_ALREADY_SET'
      },
      {
        error: 'Agent already set',
        key: 'ERR.AGENT_ALREADY_SET'
      },
      {
        error: 'Not an agent',
        key: 'ERR.AGENT_INVALID'
      },
      {
        error: 'Agent is not set',
        key: 'ERR.AGENT_NOT_SET'
      },
      {
        error: 'Account has not a name',
        key: 'PLEASE_SET_NAME'
      },
      {
        error: 'Account already have a role',
        key: 'ERR.ALREADY_ROLED'
      },
      {
        error: 'Account already set agent',
        key: 'ERR.AGENT_ALREADY_SET'
      },
      {
        error: 'Invalid delegates',
        key: 'ERR.INVALID_DELEGATE'
      },
      {
        error: 'Duplicated vote item',
        key: 'ERR.DUP_VOTE'
      },
      {
        error: 'Delegates already voted',
        key: 'ERR.DUP_VOTE'
      },
      {
        error: 'Voted delegates not exists',
        key: 'ERR.VOTED_DELEGATE_NOT_EXIST'
      },
      {
        error: 'Voted delegates not exists',
        key: 'ERR.VOTED_DELEGATE_NOT_EXIST'
      },
      {
        error: 'Delegate not voted yet',
        key: 'ERR.DELEGATE_NOT_VOTED'
      },
      {
        error: 'Chain name already registered',
        key: 'ERR.CHAIN_EXISTED'
      },
      {
        error: 'Chain link already registered',
        key: 'ERR.CHAIN_LINK_EXISTED'
      },
      {
        error: 'Chain not found',
        key: 'ERR.CHAIN_NOT_EXISTED'
      },
      {
        error: 'Chain withdrawal already processed',
        key: 'ERR.ALREADY_PROCESSED'
      },
      {
        error: 'Chain delegates not found',
        key: 'ERR.CHAIN_DELEGATE_NOT_FOUND'
      },
      {
        error: 'Signature not enough',
        key: 'ERR.SIGS_NOT_ENOUGH'
      },
      {
        error: 'Account already opened',
        key: 'ERR.ACCOUNT_ALREADY_OPENED'
      },
      {
        error: 'Gateway validators not found',
        key: 'ERR.VALIDATOR_NOT_FOUND'
      },
      {
        error: 'Gateway not found',
        key: 'ERR.GATEWAY_NOT_FOUND'
      },
      {
        error: 'Gateway not activated',
        key: 'ERR.GATEWAY_NOT_ACTIVATED'
      },
      {
        error: 'Gateway already revoked',
        key: 'ERR.GATEWAY_NOT_REVOKED'
      },
      {
        error: 'Account have not a name',
        key: 'PLEASE_SET_NAME'
      },
      {
        error: 'Account already is a gateway member',
        key: 'ERR.ALREADY_ROLED'
      },
      {
        error: 'Currency not supported',
        key: 'ERR.CURRENCY_NOT_SUPPORTED'
      },
      {
        error: 'Permission denied',
        key: 'ERR.PEMISSION_DENIED'
      },
      {
        error: 'Gateway account not exist',
        key: 'ERR.GATEWAY_ACCOUNT_NOT_EXIST'
      },
      {
        error: 'Already submitted',
        key: 'ERR.ALREADY_PROCESSED'
      },
      {
        error: 'Gateway withdrawal not exist',
        key: 'ERR.TRANSACTION_NOT_EXIST'
      },
      {
        error: 'Out transaction not exist',
        key: 'ERR.TRANSACTION_NOT_EXIST'
      },
      {
        error: 'Permission denied',
        key: 'ERR.PEMISSION_DENIED'
      },
      {
        error: 'Duplicated withdrawal signature',
        key: 'ERR.DUP_WITHDRAW_SIG'
      },
      {
        error: 'Invalid proposal title',
        key: 'ERR.INVALID_PROPOSAL_TITLE'
      },
      {
        error: 'Invalid proposal description',
        key: 'ERR.INVALID_PROPOSAL_DESC'
      },
      {
        error: 'Invalid proposal topic',
        key: 'ERR.INVALID_PROPOSAL_TOPIC'
      },
      {
        error: 'Invalid proposal finish date',
        key: 'ERR.INVALID_PROPOSAL_FIN'
      },
      {
        error: 'Proposal not found',
        key: 'ERR.PROPOSAL_NOT_FOUND'
      },
      {
        error: 'Proposal expired',
        key: 'ERR.PROPOSAL_EXPIRED'
      },
      {
        error: 'Already activated',
        key: 'ERR.ALREADY_ACTIVATED'
      },
      {
        error: 'Vote not enough',
        key: 'ERR.VOTE_NOT_ENOUGH'
      },
      {
        error: 'Invalid issuer description',
        key: 'ERR.INVALID_ISSUER_DESC'
      },
      {
        error: 'Issuer name already exists',
        key: 'ERR.NEED_ISSUER_NAME'
      },
      {
        error: 'Account is already an issuer',
        key: 'ERR.ACCOUNT_ALREADY_ISSUER'
      },
      {
        error: 'Invalid symbol',
        key: 'ERR.INVALID_SYMBOL'
      },
      {
        error: 'Invalid asset description',
        key: 'ERR.INVALID_DESC'
      },
      {
        error: 'Invalid asset precision',
        key: 'ERR.INVALID_PRECISION'
      },
      {
        error: 'Account is not an issuer',
        key: 'ERR.ACCOUNT_NOT_ISSUER'
      },
      {
        error: 'Asset already exists',
        key: 'ERR.ASSET_ALREADY_EXIST'
      },
      {
        error: 'No balance',
        key: 'ERR.NO_BALANCE'
      },
      {
        error: 'Gateway account not found',
        key: 'ERR.GATEWAY_ACCOUNT_NOT_EXIST'
      },
      {
        error: 'Gateway currency not found',
        key: 'ERR.GATEWAY_CURRENCY_NOT_EXIST'
      },
      {
        error: 'Issuer not found',
        key: 'ERR.ISSUER_NOT_FOUND'
      },
      {
        error: 'Asset not found',
        key: 'ERR.ASSET_NOT_FOUND'
      },
      {
        error: 'Blockchain is not ready',
        key: 'ERR.BLOCK_NOT_READY'
      },
      {
        error: 'Request is made on the wrong network',
        key: 'ERR.BAD_NET_WORK'
      },
      {
        error: 'Invalid transaction body',
        key: 'ERR.INVALID_TRANSACTION_BODY'
      },
      {
        error: 'Already processed transactoin',
        key: 'ERR.ALREADY_PROCESSED'
      },
      {
        error: 'Transaction already processed',
        key: 'ERR.ALREADY_PROCESSED'
      },
      {
        error: 'Sender account not found',
        key: 'ERR_TOAST_ASSET_INSUFFICIENT'
      },
      {
        error: 'Transaction already confirmed',
        key: 'ERR.TRANSACTION_ALREADY_CONFIRMED'
      },
      {
        error: 'Invalid transaction timestamp',
        key: 'ERR.INVALID_TRANSACTION_TIMESTAMP'
      },
      {
        error: 'Invalid function',
        key: 'ERR.INVALID_FUNCTION'
      },
      {
        error: 'Fee not enough',
        key: 'ERR.FEE_NOT_ENOUGH'
      },
      {
        error: 'Invalid transaction id',
        key: 'ERR.INVALID_TRANSACTION_ID'
      },
      {
        error: 'Unknown address type',
        key: 'ERR.UNKNOWN_ADDRESS_TYPE'
      },
      {
        error: 'Failed to verify signature',
        key: 'ERR.VERIFY_SIG_FAILED'
      },
      {
        error: 'Invalid transaction function',
        key: 'ERR.INVALID_TRANSACTION_FUNC'
      },
      {
        error: 'Contract not found',
        key: 'ERR.CONTRACT_NOT_EXIST'
      },
      {
        error: 'Invalid second signature',
        key: 'ERR_TOAST_SECONDKEY_WRONG'
      },
      {
        error: 'Maximum number of votes exceeded',
        key: 'ERR_TOAST_VOTE_OVERDOSE'
      },
      {
        error: 'Unsupported transaction type',
        key: 'ERR.UNSUPPORTED_TRANS_TYPE'
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
