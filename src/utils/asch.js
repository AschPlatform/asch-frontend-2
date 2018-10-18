import AschJS from 'asch-js'
import Bip39 from 'bip39'
import {
  BigNumber
} from 'bignumber.js'

export const getPub = secret => AschJS.crypto.getKeys(secret).publicKey

export const getAddr = publicKey => AschJS.crypto.getAddress(publicKey)

export const createVote = (voteContent, secret, secondpassword) =>
  AschJS.vote.createVote(voteContent, secret, secondpassword)

export const createDelegate = (userName, secret, secondpassword = '') =>
  AschJS.delegate.createDelegate(userName, secret, secondpassword)

export const createInnerTransaction = (options, secret) =>
  AschJS.dapp.createInnerTransaction(options, secret)

export const createTrans = (currency, amount, fromto, message, secret, secondPassword = '') => {
  if (currency === 'XAS') {
    return AschJS.transaction.createTransaction(fromto, Number(amount), message, secret, secondPassword)
  } else {
    return AschJS.uia.createTransfer(currency, amount, fromto, message, secret, secondPassword)
  }
}

export const createTransaction = (fromto, amount, message, secret, secondPassword = '') =>
  AschJS.transaction.createTransaction(fromto, amount, message, secret, secondPassword)

export const createTransfer = (currency, amount, fromto, message, secret, secondPassword = '') =>
  AschJS.uia.createTransfer(currency, amount, fromto, message, secret, secondPassword)

export const createInTransfer = (transactionId, currency, amount, secret, secondPassword = '') =>
  AschJS.transfer.createInTransfer(transactionId, currency, amount, secret, secondPassword)

export const createLock = (lockHeight, secret, secondpassword) =>
  AschJS.transaction.createLock(lockHeight, secret, secondpassword)

export const signature = (secret, secondpassword = '') =>
  AschJS.signature.createSignature(secret, secondpassword)

export const createFlags = (currency, flagType, flag, secret, secondPassword = '') =>
  AschJS.uia.createFlags(currency, flagType, flag, secret, secondPassword)

export const createIssuer = (name, desc, secret, secondPassword = '') =>
  AschJS.uia.createIssuer(name, desc, secret, secondPassword)

export const createIssue = (name, realAmount, secret, secondPassword = '') =>
  AschJS.uia.createIssue(name, String(realAmount), secret, secondPassword)

export const createAcl = (currency, operator, flag, list, secret, secondPassword = '') =>
  AschJS.uia.createAcl(currency, operator, flag, list, secret, secondPassword)

export const createAsset = (
  name,
  desc,
  realMaximum,
  precision,
  strategy,
  allowWriteoff,
  allowWhitelist,
  allowBlacklist,
  secret,
  secondPassword = ''
) =>
  AschJS.uia.createAsset(
    String(name),
    String(desc),
    String(realMaximum),
    precision,
    strategy,
    allowWriteoff,
    allowWhitelist,
    allowBlacklist,
    secret,
    secondPassword
  )

export const generateM = () => Bip39.generateMnemonic()
export const fullTimestamp = timestamp => AschJS.utils.format.fullTimestamp(timestamp)
// export const beginTimestamp = () => AschJS.utils.slots.beginEpochTime()
export const convertFee = (fee, precision = 8) => {
  if (!fee) {
    return 0
  }
  fee = fee.toString()
  var clearView = false
  while (fee.length < (precision + 1)) {
    fee = '0'.concat(fee)
  }
  if (precision !== 0) {
    fee = fee.slice(0, -precision).concat('.', fee.slice(-precision))
    while (!clearView) {
      if (fee[fee.length - 1] === '0') {
        fee = fee.slice(0, fee.length - 1)
      } else {
        clearView = true
      }
    }
  }

  if (fee[fee.length - 1] === '.') {
    fee = fee.slice(0, fee.length - 1)
  }
  return fee
}
export const dealBigNumber = num => {
  let dealNumB = new BigNumber(num)
  let dealNum = dealNumB.toFormat(0).toString()
  return dealNum.replace(/,/g, '')
}
export const dealGiantNumber = (num, precision) => {
  let bunch = ''
  let tail = (function () {
    for (let i = 0; i < precision; i++) {
      bunch = bunch + '0'
    }
    return bunch
  })()
  return num + tail
}

export const check58 = address => AschJS.crypto.isBase58CheckAddress(address)

const convertSecondPwd = pwd => {
  let key = pwd
  let keyPair = AschJS.crypto.getKeys(key)
  return keyPair.publicKey
}

const convertTransFee = trans => {
  let {
    type
  } = trans
  let fee = feeFuncMap[type](trans)
  fee = fee * Math.pow(10, 8)
  trans.fee = fee
  return trans
}

const asch = {
  // 转账 XAS  TODO
  transferXAS: (amount, recipientId, message, secret, secondPwd = '', fee = 10000000) => {
    return AschJS.transaction.createTransactionEx({
      type: 1,
      fee: fee,
      args: [amount, recipientId],
      secret,
      secondSecret: secondPwd,
      message
    })
  },
  // 设置昵称
  setName: (name, fee, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 2,
        fee: fee,
        args: [name],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 设置二级密码
  setsecondPassword: (secondPwd, secret) => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 3,
        fee: 10000000,
        args: [convertSecondPwd(secondPwd)],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 锁仓
  setLock: (height, amount, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 4,
        fee: 10000000,
        args: [height, amount],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 解锁
  unlock: (secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 5,
        fee: 10000000,
        args: [],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 设置多签账户
  setMultiAccount: (secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 6,
        fee: 10000000,
        args: [],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 注册为代理人
  registerAgent: (secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 7,
        fee: 10000000,
        args: [],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 设置投票代理人
  setAgent: (agent, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 8,
        fee: 10000000,
        args: [agent],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 取消投票代理
  repealAgent: (secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 9,
        fee: 10000000,
        args: [],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 注册为受托人
  registerDelegate: (secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 10,
        fee: 10000000,
        args: [],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 受托人投票
  voteDelegate: (delegates, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 11,
        fee: 10000000,
        args: [delegates],
        secret,
        secondSecret: secondPwd
      })
    )
  },

  // 撤销受托人投票
  cleanVote: (delegates, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 12,
        fee: 10000000,
        args: [delegates],
        secret,
        secondSecret: secondPwd
      })
    )
  },

  // 注册发行商 TODO
  registerIssuer: (name, desc, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 100,
        fee: 10000000,
        args: [name, desc],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 注册资产 TODO
  registerAsset: (symbol, desc, maximum, precision, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 101,
        fee: 10000000,
        args: [symbol, desc, maximum, precision],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 发行资产
  issueAsset: (symbol, amount, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 102,
        fee: 10000000,
        args: [symbol, amount],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 资产转账
  transferAsset: (symbol, amount, recipientId, message, secret, secondPwd = '', fee = 10000000) => {
    return AschJS.transaction.createTransactionEx({
      type: 103,
      fee: fee,
      args: [symbol, amount, recipientId],
      secret,
      secondSecret: secondPwd,
      message
    })
  },
  // 注册 dapp
  registerDapp: (
    name,
    desc,
    tags,
    link,
    icon,
    category,
    delegates,
    nlockNumber,
    secret,
    secondPwd = ''
  ) => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 200,
        fee: 10000000,
        args: [name, desc, tags, link, icon, category, delegates, nlockNumber],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 更新 dapp 记账人
  updateBooker: (dappId, origin, key, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 201,
        fee: 10000000,
        args: [dappId, origin, key],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 添加 dapp 记账人
  addBooker: (dappId, key, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 202,
        fee: 10000000,
        args: [dappId, key],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 删除 dapp 记账人
  deleteBooker: (dappId, key, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 203,
        fee: 10000000,
        args: [dappId, key],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // dapp 充值
  depositDapp: (name, currency, amount, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 204,
        fee: 10000000,
        args: [name, currency, amount],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // dapp 提现 TODO  参数问题
  withdrawDapp: (dappId, recipient, amount, wid, signatures, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 205,
        fee: 10000000,
        args: [dappId, recipient, amount, wid, signatures],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 发起提案
  createProposal: (title, desc, topic, content, endHeight, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 300,
        fee: 10000000,
        args: [title, desc, topic, content, endHeight],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 对提案投票
  voteProposal: (pid, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 301,
        fee: 10000000,
        args: [pid],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 激活提案
  activateProposal: (pid, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 302,
        fee: 10000000,
        args: [pid],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 网关注册候选人
  registerGateway: (gateway, publicKey, desc, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 401,
        fee: 10000000,
        args: [gateway, publicKey, desc],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 网关开户
  openGatewayAccount: (gateway, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 400,
        fee: 10000000,
        args: [gateway],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 网关充值
  depositGateway: (address, currency, amount, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 402,
        fee: 10000000,
        args: [address, currency, amount],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 网关提现
  withdrawGateway: (address, gateway, currency, amount, fee, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 403,
        fee: 10000000,
        args: [address, gateway, currency, amount, fee],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // bancor交易对根据对象
  // TODO
  bancorTradeByTarget: (source, target, targetAmount, config, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 20,
        fee: 10000000,
        args: [source, target, targetAmount, config],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // bancor交易对根据本币
  // TODO
  bancorTradeBySource: (source, target, sourceAmount, config, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 21,
        fee: 10000000,
        args: [source, target, sourceAmount, config],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 网关追加储备金
  // TODO
  gateBailAdd: (name, amount, fee, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 407,
        fee: 10000000,
        args: [name, amount, fee],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 网关退回储备金
  // TODO
  gateBailReturn: (name, amount, fee, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 408,
        fee: 10000000,
        args: [name, amount, fee],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 领取网关补偿
  // TODO
  gateBailCompensate: (name, fee, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 409,
        fee: 10000000,
        args: [name, fee],
        secret,
        secondSecret: secondPwd
      })
    )
  },

  postContract: (gasLimit, name, version, desc, code, fee, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 600,
        fee: 0,
        args: [gasLimit, name, version, desc, code],
        secret,
        secondSecret: secondPwd
      })
    )
  },

  payContract: (gasLimit, name, amount, currency, fee, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertTransFee({
        type: 602,
        fee: fee || 0,
        args: [gasLimit, name, amount, currency],
        secret,
        secondSecret: secondPwd
      })
    )
  }
}

const feeFuncMap = {
  1: trs => {
    return trs.fee ? trs.fee : 0.1
  },
  2: trs => {
    let len = trs.args[0].length
    if (len === 2) {
      return 200
    } else if (len === 3) {
      return 100
    } else if (len === 4) {
      return 80
    } else if (len === 5) {
      return 40
    } else if (len <= 10) {
      return 10
    } else {
      return 1
    }
  },
  3: trs => {
    return 5
  },
  4: trs => {
    return 0.1
  },
  5: trs => {
    return 0
  },
  6: trs => {
    return 5
  },
  7: trs => {
    return 100
  },
  8: trs => {
    return 0.1
  },
  9: trs => {
    return 0
  },
  10: trs => {
    return 100
  },
  11: trs => {
    return 0.1
  },
  12: trs => {
    return 0.1
  },
  20: trs => {
    return 0.1
  },
  21: trs => {
    return 0.1
  },
  100: trs => {
    return 100
  },
  101: trs => {
    return 500
  },
  102: trs => {
    return 0.1
  },
  103: trs => {
    return trs.fee ? trs.fee : 0.1
  },
  200: trs => {
    return 100
  },
  201: trs => {
    return 1
  },
  202: trs => {
    return 1
  },
  203: trs => {
    return 1
  },
  204: trs => {
    return 0.1
  },
  205: trs => {
    return 0.1
  },
  300: trs => {
    return 10
  },
  301: trs => {
    return 0.1
  },
  302: trs => {
    return 0
  },
  400: trs => {
    return 0.1
  },
  401: trs => {
    return 100
  },
  402: trs => {
    return 0.01
  },
  403: trs => {
    return 0
  },
  404: trs => {
    return 0.01
  },
  407: trs => {
    return 0.01
  },
  408: trs => {
    return 0
  },
  409: trs => {
    return 0
  },
  600: trs => {
    return 0
  },
  601: trs => {
    return 0
  },
  602: trs => {
    return 0
  }
}
export default asch
