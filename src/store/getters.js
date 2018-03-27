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
    return state.balances
  }
}

export default getters
