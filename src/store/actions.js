/*
export const someAction = (state) => {
}
*/
import { api, api2 } from '../utils/api'
import asch from '../utils/asch-v2'
import { getCache } from '../utils/util'

export default {
  // get user infomation (balances / nick) / update
  getUserInfo: ({ commit }, address) => {
    return api.accounts({ address })
  },
  refreshAccounts: ({ commit, state }, address) => {
    return api2.accounts({ address: address || state.userInfo.account.address }).then(res => {
      if (res.success) {
        commit('updateUserInfo', res)
        commit('setLatestBlock', res.latestBlock)
        commit('setVersion', res.version)
      }
    })
  },
  login: ({ commit }, params) => {
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
  account: ({ commit }, params) => {
    return api.account(params)
  },
  transactions: ({ commit }, params) => {
    return api.transactions(params)
  },
  myvotes: ({ commit }, params) => {
    return api.myvotes(params)
  },
  blocks: ({ commit }, params) => {
    return api.blocks(params)
  },
  blockforging: ({ commit }, params) => {
    return api.blockforging(params)
  },
  delegates: ({ commit }, params) => {
    return api.delegates(params)
  },
  votetome: ({ commit }, params) => {
    return api.votetome(params)
  },
  peer: ({ commit }, params) => {
    return api.peer(params)
  },
  blockDetail: ({ commit }, params) => {
    return api.blockDetail(params)
  },
  accountdetail: ({ commit }, params) => {
    return api.accountdetail(params)
  },
  appList: ({ commit }, params) => {
    return api.appList(params)
  },
  appInstalled: ({ commit }, params) => {
    return api.appInstalled(params)
  },
  forgingStatus: ({ commit }, params) => {
    return api.forgingStatus(params)
  },
  myBalances: ({ commit }, params) => {
    return api.myBalances(params).then(res => {
      if (res.success) {
        commit('setBalances', res.balances)
      }
      return res
    })
  },
  myAssets: ({ commit }, params) => {
    return api.myAssets(params)
  },
  // getIssuer: ({ commit, state }, params) => {
  //   return api.issuer(params).then(res => {
  //     commit('setIssuer', res.issuer)
  //     return res
  //   })
  // },
  assetAcl: ({ commit }, params) => {
    return api.assetAcl(params)
  },
  myAssetTransactions: ({ commit }, params) => {
    return api.myAssetTransactions(params)
  },
  appBalance: ({ commit }, params) => {
    return api.appBalance(params)
  },
  uiaAssetApi: ({ commit }, params) => {
    return api.uiaAssetApi(params)
  },
  uiaAssetListApi: ({ commit }, params) => {
    return api.uiaAssetListApi(params)
  },
  broadcastTransaction: ({ commit }, params) => {
    return api.broadcastTransaction(params)
  },
  dappContract: ({ commit }, params) => {
    return api.dappContract(params)
  },
  dappMyBalance: ({ commit }, params) => {
    return api.dappMyBalance(params)
  },
  getMoreAssets: ({ commit }, params) => {
    return null
  },
  setName: ({ commit }, params) => {
    return null
  },

  // v2 api
  getAccountsInfo: ({ commit }, params) => {
    return api2.accounts(params)
  },
  getTransactions: ({ commit }, params) => {
    return api2.transactions(params)
  },
  getTransaction: ({ commit }, params) => {
    return api2.transaction(params)
  },
  getCouncils: ({ commit }, params) => {
    return api2.councils(params)
  },
  getCouncil: ({ commit }, params) => {
    return api2.council(params)
  },
  getProposals: ({ commit }, params) => {
    return api2.proposals(params)
  },
  getProposal: ({ commit }, params) => {
    return api2.proposal(params)
  },
  getProposalVotes: ({ commit }, params) => {
    return api2.proposalVotes(params)
  },
  getDeposits: ({ commit }, params) => {
    return api2.deposits(params)
  },
  getCurrencyDeposits: ({ commit }, params) => {
    return api2.currencyDeposits(params)
  },
  getMyDeposits: ({ commit }, params) => {
    return api2.getMyDeposits(params)
  },
  getMyCurrencyDeposits: ({ commit }, params) => {
    return api2.myCurrencyDeposits(params)
  },
  getWithdrawals: ({ commit }, params) => {
    return api2.withdrawals(params)
  },
  getCurrencyWithdrawals: ({ commit }, params) => {
    return api2.currencyWithdrawals(params)
  },
  getMyWithdrawals: ({ commit }, params) => {
    return api2.myWithdrawals(params)
  },
  getMyCurrencyWithdrawals: ({ commit }, params) => {
    return api2.myCurrencyWithdrawals(params)
  },
  getCurrencies: ({ commit }, params) => {
    return api2.currencies(params)
  },
  getBalances: ({ commit }, params) => {
    // return api2.balances(params).then(res => {
    //   if (res.success) {
    //     commit('setBalances', res.balances)
    //   }
    //   return res
    // })
    return api2.balances(params)
  },

  getBalance: ({ commit }, params) => {
    return api2.balance(params)
  },
  getIssuers: ({ commit }, params) => {
    return api2.issuers(params)
  },
  getIssuer: ({ commit }, params) => {
    return api2.issuer(params)
  },
  getAssets: ({ commit }, params) => {
    return api2.assets(params)
  },
  getAddressAssets: ({ commit }, params) => {
    return api2.addressAssets(params)
  },
  getAsset: ({ commit }, params) => {
    return api2.asset(params)
  },

  getAgentVotes: ({ commit }, params) => {
    return api.myvotes(params)
  },
  getAgentSupporters: ({ commit }, params) => {
    return api2.agentsSupporter(params)
  },
  getTransfers: ({ commit }, params) => {
    return api2.getTransfers(params)
  },

  // about gateway
  getGateways: ({ commit }, params) => {
    return api2.gateways(params)
  },
  // get all delegates of one gateway
  getGatewayDelegates: ({ commit }, params) => {
    return api2.gatewayDelegates(params)
  },
  // api2 post actions
  postProposal: ({ commit }, params) => {
    const secret = getCache('user').secret
    let trans = asch.createProposal(
      params.title,
      params.desc,
      params.topic,
      params.content,
      params.endHeight,
      secret,
      params.secondPwd || ''
    )
    api.broadcastTransaction(trans)
  }
}
