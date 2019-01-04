export default {
  // user information / can set null
  setUserIsLogin: (state, bool) => {
    state.isLogin = bool
  },
  setUserInfo: (state, userInfo) => {
    state.userInfo = userInfo
  },
  updateUserInfo: (state, userInfo) => {
    if (!userInfo.account) {
      userInfo.account = {
        address: state.userInfo.address,
        xas: 0,
        isLocked: 0,
        isAgent: 0,
        lockHeight: 0,
        agent: 0,
        weight: 0,
        agentWeight: 0,
        secondPublicKey: state.userInfo.secondPublicKey
      }
    }
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
  },
  setIssuer: (state, issuer) => {
    state.issuer = issuer
  },
  setOutAssetsMap: (state, map) => {
    state.outAssets = map
  },
  updatePledgeDetail: (state, detail) => {
    state.pledgeDetail = detail
  }
}
