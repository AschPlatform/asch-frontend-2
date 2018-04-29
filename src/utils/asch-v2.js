import AschJS from 'asch-js-v2'
// TODO 替换为更新后的 asch-js 库
// const exFunc = (conf)=>{
//   let {type,fee=10000000,args=[],secondSecret=''}
//   return AschJS.transaction.createTransactionEx(convertFee({
//     type,
//     fee,
//     args,
//     secret,
//     secondSecret
//   })
// }

const convertSecondPwd = pwd => {
  let key = pwd
  let keyPair = AschJS.crypto.getKeys(key)
  return keyPair.publicKey
}

const convertFee = trans => {
  let { type } = trans
  let fee = feeFuncMap[type](trans)
  fee = fee * Math.pow(10, 8)
  trans.fee = fee
  return trans
}

const asch = {
  // 转账 XAS  TODO
  transferXAS: (amount, recipientId, message, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertFee({
        type: 1,
        fee: 10000000,
        args: [amount, recipientId],
        secret,
        secondSecret: secondPwd,
        message
      })
    )
  },
  // 设置昵称
  setName: (name, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertFee({
        type: 2,
        fee: 10000000,
        args: [name],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 设置二级密码
  setsecondPassword: (secondPwd, secret) => {
    return AschJS.transaction.createTransactionEx(
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
        type: 102,
        fee: 10000000,
        args: [symbol, amount],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 资产转账
  transferAsset: (symbol, amount, recipientId, message, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertFee({
        type: 103,
        fee: 10000000,
        args: [symbol, amount, recipientId],
        secret,
        secondSecret: secondPwd,
        message
      })
    )
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
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
      convertFee({
        type: 402,
        fee: 10000000,
        args: [address, currency, amount],
        secret,
        secondSecret: secondPwd
      })
    )
  },
  // 网关提现
  withdrawGateway: (address, gateway, currency, amount, secret, secondPwd = '') => {
    return AschJS.transaction.createTransactionEx(
      convertFee({
        type: 403,
        fee: 10000000,
        args: [address, gateway, currency, amount],
        secret,
        secondSecret: secondPwd
      })
    )
  }
}

const feeFuncMap = {
  1: trs => {
    return 0.1
  },
  2: trs => {
    let len = trs.args[0].length
    if (len === 3) {
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
    return 0.1
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
    return 0.1
  },
  404: trs => {
    return 0.01
  }
}

export default asch
