import axios from './axiosWrap'
import { urls } from './constants'
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

  let realUrl = urls.server.caos + url
  let type = method.toLowerCase()
  let res = {}
  if (type === 'get') {
    res = axios.get(realUrl + '?' + json2url(data))
  } else {
    res = axios.post(realUrl, data, postHeaders)
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
// 获取最新区块
api.blocks = params => {
  return fetch(urls.blocksApi, params, 'get')
}
// 受托人模块
api.blockforging = params => {
  return fetch(urls.blockforgingApi, params, 'get')
}
//  入围候选人
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
    headers: { magic: urls.magic, version: '' }
  })
}

export { api }
