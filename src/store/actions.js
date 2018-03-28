/*
export const someAction = (state) => {
}
*/
import { api } from '../utils/api'

export default {
  // get user infomation (balances / nick) / update
  getUserInfo: ({ commit }, address) => {
    return api.account({ address })
  },
  refreshAccounts: ({ commit, state }) => {
    return api.account({ address: state.userInfo.account.address }).then(res => {
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
    })
  },
  myAssets: ({ commit }, params) => {
    return api.myAssets(params)
  },
  issuer: ({ commit }, params) => {
    return api.issuer(params)
  },
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
  }
}
