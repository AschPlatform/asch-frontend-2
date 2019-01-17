import axios from './axiosWrap'
import {
  urls
} from './constants'
import {
  getCurrentSeverUrl
} from './util'

// import nodeService from './servers'
// Read me: this file contains all the get API & V1 post APIS

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
  let selectedServerUrl = getCurrentSeverUrl()
  // let realUrl = urls.server.caos + url
  let realUrl = !selectedServerUrl ? urls.serverUrl + url : selectedServerUrl + url
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
  return fetch(urls.v2.blocksApi, params, 'get')
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
  return fetch(urls.postApi, {
    transaction: trans
  }, 'post', {
    headers: {
      magic: urls.magic,
      version: ''
    }
  })
}
// 执行 DAPP 内部合约
api.dappContract = (trans, appid) => {
  let url = {
    url: `/api/dapps/${appid}/transactions/signed`
  }
  return fetch(url, {
    transaction: trans
  }, 'put', {
    headers: {
      magic: urls.magic,
      version: ''
    }
  })
}

// 查询 DAPP 内部余额
api.dappMyBalance = ({
  appid,
  address
}) => {
  let url = {
    url: `/api/dapps/${appid}/balances/${address}`
  }
  return fetch(url, {}, 'get')
}

const api2 = {}

//  区块详情
api2.blockDetail = params => {
  return fetch(urls.v2.blocksDetail, params, 'get')
}
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
// 获取指定网关和账户的信息
api2.gateAccountAddr = params => {
  return fetch(urls.v2.gateAccountAddr, params, 'get')
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
// 获取所有已注册侧链
api2.chains = params => {
  return fetch(urls.v2.chains, params, 'get')
}
// 获取所有已注册侧链
api2.chainsInstalled = params => {
  return fetch(urls.v2.chainsInstalled, params, 'get')
}
// 获取所有侧链资产
api2.chainAssets = params => {
  return fetch(urls.v2.assets, params, 'get')
}
// 获取所有bancor交易对
// TODO
// @params: offset / limit
api2.bancorPair = params => {
  return fetch(urls.v2.bancorPair, params, 'get')
}
// 获取某地址bancor交易信息
// TODO
// @params: offset / limit / address / sort
api2.bancorRecord = params => {
  return fetch(urls.v2.bancorRecord, params, 'get')
}
// 获取所有支持创建bancor的资产
api2.getBancorSupports = params => {
  return fetch(urls.v2.getBancorSupports, params, 'get')
}
// 获取理事会资产余额
// TODO
// @params: offset / limit / address / sort
api2.councilBalance = params => {
  return fetch(urls.v2.councilBalance, params, 'get')
}
// 获取网关储备金信息
// TODO
// @params: name
api2.gateBailHost = params => {
  return fetch(urls.v2.gateBailHost, params, 'get')
}
// 获取用户可补偿的余额 / 保证金状态
// TODO
// @params: name / address
api2.gateBailWithdraw = params => {
  return fetch(urls.v2.gateBailWithdraw, params, 'get')
}
// 获取智能合约列表
// TODO
// @params:
api2.contractList = params => {
  return fetch(urls.v2.contractList, params, 'get')
}

api2.getGatewayReserveInfo = params => {
  return fetch(urls.v2.gatewayReserve, params, 'get')
}

api2.getGatewayRealClaim = params => {
  return fetch(urls.v2.gatewayRealClaim, params, 'get')
}

api2.getGatewayMembers = params => {
  return fetch(urls.v2.gatewayMembers, params, 'get')
}
api2.getGatewayBailStatus = params => {
  return fetch(urls.v2.gatewayBailStatus, params, 'get')
}

api2.getContracts = params => {
  return fetch(urls.v2.getContracts, params, 'get')
}
api2.getContractDetail = params => {
  return fetch(urls.v2.getContractDetail, params, 'get')
}
api2.getCostGas = params => {
  return fetch(urls.v2.getCostGas, params, 'get')
}
api2.getContractInfo = params => {
  return fetch(urls.v2.getContractInfo, params, 'get')
}

// 获取用户抵押详情
api2.getPledgeDetail = params => {
  return fetch(urls.v2.getPledgeDetail, params, 'get')
}

export {
  api,
  api2
}
