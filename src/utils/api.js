import axios from './axiosWrap'
import { urls } from './constants'
import { getCurrentSeverUrl } from './util'

// import nodeService from './servers'

const json2url = json => {
  var arr = []
  var str = ''
  for (var i in json) {
    str = i + '=' + json[i]
    arr.push(str)
  }
  return arr.join('&')
}

const fetch = (url, data, method, postHeaders) => {
  // TODO test api
  // url = url.mock
  url = url.url
  for (let k in data) {
    if (url.indexOf(':' + k) !== -1) {
      url = url.replace(':' + k, data[k])
      delete data[k]
    }
  }

  // TODO find server
  // let server = nodeService.getCurrentServer()

  // if (!nodeService.isStaticServer()) {
  //   let retryTimes = 0
  //   while (!server.isServerAvalible(true) && retryTimes++ < 10) {
  //     console.log('current server unavalible')
  //     nodeService.changeServer(true)
  //     server = nodeService.getCurrentServer()
  //   }
  // }
  let selectedServerUrl = getCurrentSeverUrl()
  // let realUrl = urls.server.caos + url
  let realUrl = !selectedServerUrl
    ? urls.server[process.env.NODE_ENV] + url
    : selectedServerUrl + url
  let type = method.toLowerCase()
  let res = {}
  if (type === 'get') {
    res = axios.get(realUrl + '?' + json2url(data))
  } else if (type === 'post') {
    res = axios.post(realUrl, data, postHeaders)
  } else if (type === 'put') {
    res = axios.put(realUrl, data, postHeaders)
  }
  return res
}

const api = {}

api.login = params => {
  return fetch(urls.loginApi, params, 'post')
}
// 账户请求
api.account = params => {
  return fetch(urls.accountApi, params, 'get')
}
// 交易请求
api.transactions = params => {
  return fetch(urls.transactionsApi, params, 'get')
}
// 获取投票列表
api.myvotes = params => {
  return fetch(urls.myvotesApi, params, 'get')
}
// 获取最新区块 params => generatorPublicKey
api.blocks = params => {
  return fetch(urls.blocksApi, params, 'get')
}
// 受托人模块
api.blockforging = params => {
  return fetch(urls.blockforgingApi, params, 'get')
}
// 受托人列表
api.delegates = params => {
  return fetch(urls.delegatesApi, params, 'get')
}
//  投我的票
api.votetome = params => {
  return fetch(urls.votetomeApi, params, 'get')
}
//  节点列表
api.peer = params => {
  return fetch(urls.peerApi, params, 'get')
}
//  区块详情
api.blockDetail = params => {
  return fetch(urls.blocksDetailApi, params, 'get')
}
//  账户详情
api.accountdetail = params => {
  return fetch(urls.accountdetailApi, params, 'get')
}
//  应用列表
api.appList = params => {
  return fetch(urls.appListApi, params, 'get')
}
//  已安装应用列表
api.appInstalled = params => {
  return fetch(urls.appInstalledApi, params, 'get')
}
api.forgingStatus = params => {
  return fetch(urls.forgingStatusApi, params, 'get')
}
//  获取我的余额
api.myBalances = params => {
  return fetch(urls.myBalancesApi, params, 'get')
}
//  获取我的资产
api.myAssets = params => {
  return fetch(urls.myAssetsApi, params, 'get')
}
//  查询发行商
api.issuer = params => {
  return fetch(urls.issuerApi, params, 'get')
}
//  获取资产访问控制列表
api.assetAcl = params => {
  return fetch(urls.assetAclApi, params, 'get')
}
//  获取我的资产操作记录
api.myAssetTransactions = params => {
  return fetch(urls.myTransactionsApi, params, 'get')
}
//  获取应用余额
api.appBalance = params => {
  return fetch(urls.appBalanceApi, params, 'get')
}
//  获取资产
api.uiaAssetApi = params => {
  return fetch(urls.uiaAssetApi, params, 'get')
}

api.uiaAssetListApi = params => {
  return fetch(urls.uiaAssetListApi, params, 'get')
}
// 广播交易
api.broadcastTransaction = trans => {
  return fetch(urls.postApi, { transaction: trans }, 'post', {
    headers: { magic: urls.magics[process.env.NODE_ENV], version: '' }
  })
}
// 执行 DAPP 内部合约
api.dappContract = (trans, appid) => {
  let url = { url: `/api/dapps/${appid}/transactions/signed` }
  return fetch(url, { transaction: trans }, 'put', {
    headers: { magic: urls.magics[process.env.NODE_ENV], version: '' }
  })
}

// 查询 DAPP 内部余额
api.dappMyBalance = ({ appid, address }) => {
  let url = { url: `/api/dapps/${appid}/balances/${address}` }
  return fetch(url, {}, 'get')
}

const api2 = {}

// 账户查询
api2.accounts = params => {
  return fetch(urls.v2.accounts, params, 'get')
}

// 获取交易列表
api2.transactions = params => {
  return fetch(urls.v2.transactions, params, 'get')
}

// 根据 tid 获取交易详情
api2.transaction = params => {
  return fetch(urls.v2.transaction, params, 'get')
}

// 获取理事会列表
api2.councils = params => {
  return fetch(urls.v2.councils, params, 'get')
}

// 根据名称获取理事会详情
api2.council = params => {
  return fetch(urls.v2.council, params, 'get')
}

// 获取提案列表
api2.proposals = params => {
  return fetch(urls.v2.proposals, params, 'get')
}

// 根据 tid 获取提案详情
api2.proposal = params => {
  return fetch(urls.v2.proposal, params, 'get')
}

// 根据 tid 获取提案投票情况
api2.proposalVotes = params => {
  return fetch(urls.v2.proposalVotes, params, 'get')
}

// 获取所有跨链充值记录
api2.deposits = params => {
  return fetch(urls.v2.deposits, params, 'get')
}

// 获取指定币种的跨链充值记录
api2.currencyDeposits = params => {
  return fetch(urls.v2.currencyDeposits, params, 'get')
}

// 获取指定地址的跨链充值记录
api2.myDeposits = params => {
  return fetch(urls.v2.myDeposits, params, 'get')
}

// 获取指定地址指定币种的跨链充值记录 +
api2.myCurrencyDeposits = params => {
  return fetch(urls.v2.gateAccountDeposits, params, 'get')
}

// 获取所有跨链提现记录
api2.withdrawals = params => {
  return fetch(urls.v2.withdrawals, params, 'get')
}

// 获取指定币种的跨链提现记录
api2.currencyWithdrawals = params => {
  return fetch(urls.v2.currencyWithdrawals, params, 'get')
}

// 获取指定地址的跨链提现记录
api2.myWithdrawals = params => {
  return fetch(urls.v2.myWithdrawals, params, 'get')
}

// 获取指定地址指定币种的跨链提现记录 +
api2.myCurrencyWithdrawals = params => {
  return fetch(urls.v2.gateAccountWithdrawals, params, 'get')
}

// 获取支持的所有跨链资产列表
api2.currencies = params => {
  return fetch(urls.v2.currencies, params, 'get')
}

// 获取指定名称的跨链资产详情
api2.currency = params => {
  return fetch(urls.v2.currency, params, 'get')
}

// 获取指定跨链币种的充值地址
api2.address = params => {
  return fetch(urls.v2.address, params, 'get')
}
// 获取账户余额
api2.balances = params => {
  return fetch(urls.v2.balances, params, 'get')
}
// 获取指定币种账户余额
api2.balance = params => {
  return fetch(urls.v2.balance, params, 'get')
}
// 获取所有发行商
api2.issuers = params => {
  return fetch(urls.v2.issuers, params, 'get')
}
// 获取指定发行商
api2.issuer = params => {
  return fetch(urls.v2.issuer, params, 'get')
}
// 获取用户发行资产
api2.addressAssets = params => {
  return fetch(urls.v2.addressAssets, params, 'get')
}

// 获取所有资产
api2.issuer = params => {
  return fetch(urls.v2.issuer, params, 'get')
}
// 获取代理人委托人列表
api2.agentsSupporter = params => {
  return fetch(urls.v2.agentsSupporter, params, 'get')
}
// 获取转账记录
api2.getTransfers = params => {
  return fetch(urls.v2.transfers, params, 'get')
}
// 获取指定账户发行的资产
api2.addressAsset = params => {
  return fetch(urls.v2.addressAsset, params, 'get')
}
// 获取所有网关
api2.gateways = params => {
  return fetch(urls.v2.gateways, params, 'get')
}
// 获取某网关所有候选人
api2.gatewayDelegates = params => {
  return fetch(urls.v2.gateValidators, params, 'get')
}

// const canRetry = ret => {
//   // return ret.error && /blockchain/.test(ret.error.toLowerCase()) && !nodeService.isStaticServer()
//   return false
// }

/**
const postService = {
  postWithRetry: (trans, countDown, cb) => {
    let retryOrCallbak = data => {
      if (countDown <= 0) {
        let error = 1
        cb(error, data)
        return
      }

      console.log('change server and retry broadcast transaction')
      // nodeService.changeServer(true)
      postService.postWithRetry(trans, countDown - 1, cb)
    }

    api
      .broadcastTransaction(trans)
      .success((data, status, headers, config) => {
        if (data.success) {
          cb(null, data)
          // console.log('broadcastTransaction-success',data);
          return
        } else if (canRetry(data)) {
          retryOrCallbak(data)
          return
        }
        // 失败返回
        // console.log('broadcastTransaction-fail',data);
        // 统一管理错误信息
        translateErrMsg(null, data.error)
        cb(null, data)
      })
      .error((data, status, headers, config) => {
        retryOrCallbak(data)
      })
  },
  retryPost: (createTransFunc, callback, retryTimes) => {
    let trans = createTransFunc()
    let maxRetry = retryTimes | 5
    this.postWithRetry(trans, maxRetry, callback)
  },
  post: trans => {
    return api.broadcastTransaction(trans)
  },
  writeoff: trans => {
    return api.broadcastTransaction(trans)
  }
}
*/

export { api, api2 }
