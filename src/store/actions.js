/*
export const someAction = (state) => {
}
*/
import {
  api,
  api2
} from '../utils/api'
import asch from '../utils/asch'

export default {
  // get user infomation (balances / nick) / update
  getUserInfo: ({
    commit
  }, address) => {
    return api.accounts({
      address
    })
  },
  refreshAccounts: ({
    commit,
    state
  }, address) => {
    return api2.accounts({
      address: address || state.userInfo.account.address
    }).then(res => {
      if (res.success) {
        commit('updateUserInfo', res)
        commit('setLatestBlock', res.latestBlock)
        commit('setVersion', res.version)
      }
    })
  },
  login: ({
    commit
  }, params) => {
    return api.login(params).then(res => {
      if (res.success) {
        commit('updateUserInfo', res)
        commit('setLatestBlock', res.latestBlock)
        commit('setVersion', res.version)
        commit('setUserIsLogin', true)
        return res
      }
    })
  },
  account: ({
    commit
  }, params) => {
    return api.account(params)
  },
  transactions: ({
    commit
  }, params) => {
    return api.transactions(params)
  },
  myvotes: ({
    commit
  }, params) => {
    return api.myvotes(params)
  },
  blocks: ({
    commit
  }, params) => {
    return api.blocks(params)
  },
  blockforging: ({
    commit
  }, params) => {
    return api.blockforging(params)
  },
  delegates: ({
    commit
  }, params) => {
    return api.delegates(params)
  },
  votetome: ({
    commit
  }, params) => {
    return api.votetome(params)
  },
  peer: ({
    commit
  }, params) => {
    return api.peer(params)
  },
  blockDetail: ({
    commit
  }, params) => {
    return api.blockDetail(params)
  },
  accountdetail: ({
    commit
  }, params) => {
    return api.accountdetail(params)
  },
  appList: ({
    commit
  }, params) => {
    return api.appList(params)
  },
  appInstalled: ({
    commit
  }, params) => {
    return api.appInstalled(params)
  },
  forgingStatus: ({
    commit
  }, params) => {
    return api.forgingStatus(params)
  },
  myBalances: ({
    commit
  }, params) => {
    return api.myBalances(params).then(res => {
      if (res.success) {
        commit('setBalances', res.balances)
      }
      return res
    })
  },
  myAssets: ({
    commit
  }, params) => {
    return api.myAssets(params)
  },
  assetAcl: ({
    commit
  }, params) => {
    return api.assetAcl(params)
  },
  myAssetTransactions: ({
    commit
  }, params) => {
    return api.myAssetTransactions(params)
  },
  appBalance: ({
    commit
  }, params) => {
    return api.appBalance(params)
  },
  uiaAssetApi: ({
    commit
  }, params) => {
    return api.uiaAssetApi(params)
  },
  uiaAssetListApi: ({
    commit
  }, params) => {
    return api.uiaAssetListApi(params)
  },
  broadcastTransaction: ({
    commit
  }, params) => {
    return api.broadcastTransaction(params)
  },
  dappContract: ({
    commit
  }, params) => {
    return api.dappContract(params)
  },
  dappMyBalance: ({
    commit
  }, params) => {
    return api.dappMyBalance(params)
  },
  getMoreAssets: ({
    commit
  }, params) => {
    return null
  },
  setName: ({
    commit
  }, params) => {
    return null
  },

  // v2 api
  getAccountsInfo: ({
    commit
  }, params) => {
    return api2.accounts(params)
  },
  getTransactions: ({
    commit
  }, params) => {
    return api2.transactions(params)
  },
  getTransaction: ({
    commit
  }, params) => {
    return api2.transaction(params)
  },
  getCouncils: ({
    commit
  }, params) => {
    return api2.councils(params)
  },
  getCouncil: ({
    commit
  }, params) => {
    return api2.council(params)
  },
  getProposals: ({
    commit
  }, params) => {
    return api2.proposals(params)
  },
  getProposal: ({
    commit
  }, params) => {
    return api2.proposal(params)
  },
  getProposalVotes: ({
    commit
  }, params) => {
    return api2.proposalVotes(params)
  },
  getDeposits: ({
    commit
  }, params) => {
    return api2.deposits(params)
  },
  getCurrencyDeposits: ({
    commit
  }, params) => {
    return api2.currencyDeposits(params)
  },
  getMyDeposits: ({
    commit
  }, params) => {
    return api2.getMyDeposits(params)
  },
  getMyCurrencyDeposits: ({
    commit
  }, params) => {
    return api2.myCurrencyDeposits(params)
  },
  getWithdrawals: ({
    commit
  }, params) => {
    return api2.withdrawals(params)
  },
  getCurrencyWithdrawals: ({
    commit
  }, params) => {
    return api2.currencyWithdrawals(params)
  },
  getMyWithdrawals: ({
    commit
  }, params) => {
    return api2.myWithdrawals(params)
  },
  getMyCurrencyWithdrawals: ({
    commit
  }, params) => {
    return api2.myCurrencyWithdrawals(params)
  },
  // get cross chain assets
  getCurrencies: ({
    commit
  }, params) => {
    return api2.currencies(params).then(res => {
      let outAssetMap = {}
      res.currencies.forEach(currency => {
        outAssetMap[currency.symbol] = currency
      })
      commit('setOutAssetsMap', outAssetMap)
      return res
    })
  },
  getBalances: ({
    commit
  }, params) => {
    // return api2.balances(params).then(res => {
    //   if (res.success) {
    //     commit('setBalances', res.balances)
    //   }
    //   return res
    // })
    return api2.balances(params)
  },

  getBlockDetail: ({
    commit
  }, params) => {
    return api2.blockDetail(params)
  },

  getBalance: ({
    commit
  }, params) => {
    return api2.balance(params)
  },
  getIssuers: ({
    commit
  }, params) => {
    return api2.issuers(params)
  },
  getIssuer: ({
    commit
  }, params) => {
    return api2.issuer(params).then(res => {
      if (res.success) {
        commit('setIssuer', res.issuer)
      }
      return res
    })
  },
  getAssets: ({
    commit
  }, params) => {
    return api2.assets(params)
  },
  getAddressAssets: ({
    commit
  }, params) => {
    return api2.addressAssets(params)
  },
  getAsset: ({
    commit
  }, params) => {
    return api2.asset(params)
  },

  getAgentVotes: ({
    commit
  }, params) => {
    return api.myvotes(params)
  },
  getAgentSupporters: ({
    commit
  }, params) => {
    return api2.agentsSupporter(params)
  },
  getTransfers: ({
    commit
  }, params) => {
    return api2.getTransfers(params)
  },

  // about gateway
  gateAccountAddr: ({
    commit
  }, params) => {
    return api2.gateAccountAddr(params)
  },

  getGateways: ({
    commit
  }, params) => {
    return api2.gateways(params)
  },
  // get all delegates of one gateway
  getGatewayDelegates: ({
    commit
  }, params) => {
    return api2.gatewayDelegates(params)
  },
  // get all chains(dapps)
  getAllChains: ({
    commit
  }, params) => {
    return api2.chains(params)
  },
  // get all chain assets
  getAllAssets: ({
    commit
  }, params) => {
    return api2.chainAssets(params)
  },
  // get installed chains
  getInstalledChains: ({
    commit
  }, params) => {
    return api2.chainsInstalled(params)
  },
  // get bancor pairs
  getBancorPairs: ({
    commit
  }, params) => {
    return api2.bancorPair(params)
  },
  // get bancor records
  getBancorRecord: ({
    commit
  }, params) => {
    return api2.bancorRecord(params)
  },
  // get group balance
  getCouncilBalance: ({
    commit
  }, params) => {
    return api2.councilBalance(params)
  },
  // api2 post actions
  postProposal: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.createProposal(
      params.title,
      params.desc,
      params.topic,
      params.content,
      params.endHeight,
      secret,
      params.secondPwd || ''
    )
    return api.broadcastTransaction(trans)
  },
  // vote proposal
  voteProposal: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.voteProposal(
      params.tid,
      secret,
      params.secondPwd || ''
    )
    return api.broadcastTransaction(trans)
  },
  // active proposal
  activeProposal: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.activateProposal(
      params.tid,
      secret,
      params.secondPwd || ''
    )
    return api.broadcastTransaction(trans)
  },
  // deposit
  deposit: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.depositDapp(
      params.name,
      params.currency,
      params.amount,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },
  // regist gateway follower
  registGateway: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.registerGateway(
      params.gateway,
      params.publicKey,
      params.desc,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },
  // bancor buying
  bancorTradeBySource: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.bancorTradeBySource(
      params.source,
      params.target,
      params.sourceAmount,
      params.config,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },
  // bancor selling
  bancorTradeByTarget: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.bancorTradeByTarget(
      params.source,
      params.target,
      params.targetAmount,
      params.config,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },
  // 1.5 api
  getGatewayInfo: ({
    commit,
    state
  }, params) => {
    return api2.getGatewayReserveInfo(params)
  },
  getGatewayBailStatus: ({
    commit,
    state
  }, params) => {
    return api2.getGatewayBailStatus(params)
  },
  getGatewayRealClaim: ({
    commit,
    state
  }, params) => {
    return api2.getGatewayRealClaim(params)
  },
  getGatewayMembers: ({
    commit,
    state
  }, params) => {
    return api2.getGatewayMembers(params)
  },
  getContracts: ({
    commit,
    state
  }, params) => {
    return api2.getContracts(params)
  },
  getContractDetail: ({
    commit,
    state
  }, params) => {
    return api2.getContractDetail(params)
  },
  getBancorSupports: ({
    commit,
    state
  }, params) => {
    return api2.getBancorSupports(params)
  },
  getCostGas: ({
    commit,
    state
  }, params) => {
    return api2.getCostGas(params)
  },
  // 1.5 contract
  addBailAmount: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.gateBailAdd(
      params.name,
      params.amount,
      params.fee || 10000000,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },

  returnBailAmount: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.gateBailReturn(
      params.name,
      params.amount,
      params.fee || 10000000,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },

  getCompensation: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.gateBailCompensate(
      params.name,
      params.fee || 10000000,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },
  postContract: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.postContract(
      params.gasLimit,
      params.name,
      params.version || 'v0.1',
      params.desc,
      params.code,
      params.fee || 0,
      secret,
      params.consumeOwnerEnergy,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },
  payContract: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.payContract(
      params.gasLimit,
      params.enablePayGasInXAS,
      params.name,
      params.method || '',
      params.amount,
      params.currency,
      params.fee || 0,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },
  redeem: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.redeem(
      params.bandwidth,
      params.energy,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },
  pledge: ({
    commit,
    state
  }, params) => {
    let secret = state.userInfo.secret
    let trans = asch.pledge(
      params.bandwidth,
      params.energy,
      secret,
      params.secondSecret || ''
    )
    return api.broadcastTransaction(trans)
  },
  getPledgeDetail: ({
    commit,
    state
  }, params) => {
    return api2.getPledgeDetail(params)
      .then(res => {
        if (res.success && Object.keys(res).length > 1) {
          commit('updatePledgeDetail', res)
        }
      })
  },
  getContractInfo: ({
    commit,
    state
  }, params) => {
    return api2.getContractInfo(params)
  }
}
