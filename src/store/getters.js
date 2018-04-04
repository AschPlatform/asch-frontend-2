// import { getCache } from '../utils/util'

const getters = {
  userInfo: state => {
    return state.userInfo
  },
  loginFlag: state => {
    return state.isLogin
  },
  latestBlock: state => {
    return state.latestBlock
  },

  version: state => {
    return state.version
  },
  balances: state => {
    let balances = state.balances
    return balances
  },
  balancesMap: state => {
    let balances = state.balances
    let balancesMap = {}
    balances.map(balance => {
      balancesMap[balance.currency] = balance
    })
    return balancesMap
  },
  issuer: state => {
    return state.issuer
  }
}

export default getters
