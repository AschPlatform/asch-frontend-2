export default {
  // user information / can set null
  setUserIsLogin: (state, bool) => {
    state.isLogin = bool
  },
  setUserInfo: (state, userInfo) => {
    state.userInfo = userInfo
  },
  updateUserInfo: (state, userInfo) => {
    state.userInfo = { ...state.userInfo, ...userInfo }
  },
  setLatestBlock: (state, latestBlock) => {
    state.latestBlock = latestBlock
  },
  setVersion: (state, version) => {
    state.version = version
  },
  setBalances: (state, balances) => {
    state.balances = balances
  }
}
