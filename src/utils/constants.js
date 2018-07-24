const langsOpts = [
  {
    label: '中文简体',
    value: 'zh'
  },
  {
    label: 'English',
    value: 'en'
  }
  // {
  //   label: 'Deutsch',
  //   value: 'de'
  // }
]

const fees = {
  'ETH': 150000,
  'BCH': 1000,
  'BTC': 10000
}

const officialPeers = [
  // {
  //   ip: '107.191.41.208',
  //   port: 80,
  //   local: 'US1'
  // },
  // {
  //   ip: '45.76.98.139',
  //   port: 80,
  //   local: 'JP1'
  // },
  // {
  //   ip: '45.63.27.97',
  //   port: 80,
  //   local: 'US2'
  // },
  // {
  //   ip: '45.76.99.134',
  //   port: 80,
  //   local: 'JP2'
  // },
  // {
  //   ip: '104.238.180.37',
  //   port: 80,
  //   local: 'US3'
  // },
  // {
  //   ip: '45.32.254.236',
  //   port: 80,
  //   local: 'JP3'
  // },
  // {
  //   ip: '108.61.181.76',
  //   port: 80,
  //   local: 'JP4'
  // },
  // {
  //   ip: '222.161.26.230',
  //   port: 9999,
  //   local: 'CN1'
  // },
  // {
  //   ip: '222.161.26.231',
  //   port: 9999,
  //   local: 'CN2'
  // }
  {
    ip: '47.75.26.122',
    port: 4096,
    local: 'test1'
  },
  {
    ip: '47.75.26.122',
    port: 4097,
    local: 'test2'
  },
  {
    ip: '47.75.26.122',
    port: 4098,
    local: 'test3'
  }
]

const urls = {
  server: {
    development: 'http://47.75.26.122:4096',
    // development: 'http://47.94.37.201:4006',
    // development: 'http://39.106.250.196:4096',
    // development: 'http://39.106.182.193:8192',
    // production: 'http://47.75.26.122:4096'
    // production: 'http://192.168.1.38:4096'
    production: 'http://localhost:4096'
  },
  // 登录接口
  loginApi: {
    mock: '/data/home/accounts.json',
    url: '/api/accounts/open2'
  },
  // 余额账单Apiget /api/accounts?address=4205898691220223329L
  accountApi: {
    mock: '/data/home/accounts.json',
    url: '/api/accounts'
  },
  // 余额账单Apiget /api/transactions
  transactionsApi: {
    mock: '/data/home/transactions.json',
    url: '/api/transactions'
  },
  //  获取受托人接口
  delegatesApi: {
    mock: '/data/vote/delegates.json',
    url: '/api/delegates'
  },
  //  获取我的投票列表借口
  myvotesApi: {
    mock: '/data/vote/delegates.json',
    url: '/api/accounts/delegates'
  },
  //  获取区块数据接口
  blocksApi: {
    mock: '/data/blockchain/blocks.json',
    url: '/api/blocks'
  },
  // 受托人的基本信息 include myself params => publicKey
  blockforgingApi: {
    mock: '/data/blockforging/delegates.json',
    url: '/api/delegates/get'
  },
  // 详情基本信息
  blocksDetailApi: {
    mock: '/data/blockDetail/getblocks.json',
    url: '/api/blocks/get'
  },
  // 账户基本信息
  accountdetailApi: {
    mock: '/data/accountdetail/accounts.json',
    url: '/api/accounts'
  },
  // 谁投我的票接口
  votetomeApi: {
    mock: '/data/vote/voter.json',
    url: '/api/delegates/voters'
  },
  // 节点列表
  peerApi: {
    mock: '/data/peer/peers.json',
    url: '/api/peers'
  },
  postApi: {
    mock: '/data/vote/delegates.json',
    url: '/peer/transactions'
  },
  appListApi: {
    mock: '/data/application/applist.json',
    url: '/api/dapps'
  },
  appInstalledApi: {
    mock: '/data/application/applist.json',
    url: '/api/dapps/installed'
  },
  forgingStatusApi: {
    mock: '/data/blockforging/status.json',
    url: '/api/delegates/forging/status'
  },
  //  获取我的余额
  myBalancesApi: {
    mock: '/data/assets/my-balances.json',
    url: '/api/uia/balances/:address'
  },
  //  查询发行商
  issuerApi: {
    mock: '/data/assets/issuer.json',
    url: '/api/uia/issuers/:address'
  },
  //  获取某个发行商的资产
  myAssetsApi: {
    mock: '/data/assets/my-assets.json',
    url: '/api/uia/issuers/:name/assets'
  },
  //  获取资产活动记录
  myTransactionsApi: {
    mock: '/data/assets/my-transactions.json',
    url: '/api/uia/transactions/my/:address'
  },
  //  获取资产访问控制列表
  assetAclApi: {
    mock: '/data/assets/acl.json',
    url: '/api/uia/assets/:name/acl/:flag'
  },
  //  获取应用余额
  appBalanceApi: {
    mock: '',
    url: '/api/uia/balances/:address'
  },
  //  获取特定资产
  uiaAssetApi: {
    mock: '',
    url: '/api/uia/assets/:name'
  },
  //  获取所有资产
  uiaAssetListApi: {
    mock: '',
    url: '/api/uia/assets'
  },
  // ===== 1.4  v2 api ======
  v2: {
    // 账户查询 ps: name params is avaliable now
    accounts: {
      url: '/api/v2/accounts/:address'
    },
    // 获取交易列表
    transactions: {
      url: '/api/v2/transactions'
    },
    // 根据 tid 获取交易详情
    transaction: {
      url: '/api/v2/transactions/:tid'
    },
    // 获取理事会列表
    councils: {
      url: '/api/v2/groups'
    },
    // 根据名称获取理事会详情
    council: {
      url: '/api/v2/groups/:address'
    },
    // 获取提案列表
    proposals: {
      url: '/api/v2/proposals'
    },
    // 根据 tid 获取提案详情
    proposal: {
      url: '/api/v2/proposals/:tid'
    },
    // 根据 tid 获取提案投票情况
    proposalVotes: {
      url: '/api/v2/proposals/:tid/votes'
    },
    // 获取所有跨链充值记录
    deposits: {
      url: '/api/v2/gateways/deposits'
    },
    // 获取指定币种的跨链充值记录
    currencyDeposits: {
      url: '/api/v2/gateways/deposits/:currency'
    },
    // 获取指定地址的跨链充值记录
    myDeposits: {
      url: '/api/v2/gateways/deposits/my/:address'
    },
    // 获取指定地址指定币种的跨链充值记录
    myCurrencyDeposits: {
      url: '/api/v2/gateways/deposits/my/:address/:currency'
    },
    // 获取所有跨链提现记录
    withdrawals: {
      url: '/api/v2/gateways/withdrawals'
    },
    // 获取指定币种的跨链提现记录
    currencyWithdrawals: {
      url: '/api/v2/gateways/withdrawals/:currency'
    },
    // 获取指定地址的跨链提现记录 ?
    myWithdrawals: {
      url: '/api/v2/gateways/withdrawals/my/:address'
    },
    // 获取指定地址指定币种的跨链提现记录
    myCurrencyWithdrawals: {
      url: '/api/v2/gateways/withdrawals/:address/:currency'
    },
    // 获取所有网关
    gateways: {
      url: '/api/v2/gateways/'
    },
    // 获取指定网关的验证者
    gateValidators: {
      url: '/api/v2/gateways/:name/validators'
    },
    // 获取指定网关的支持币种
    gateCurrencies: {
      url: '/api/v2/gateways/:name/currencies'
    },
    // 获取指定用户地址的所有网关账户
    gateAccountAddr: {
      url: '/api/v2/gateways/:name/accounts/:address'
    },
    // 获取指定用户地址指定币种的所有充值记录
    gateAccountDeposits: {
      url: '/api/v2/gateways/deposits/:address/:currency'
    },
    // 获取指定用户地址指定币种的所有提现记录
    gateAccountWithdrawals: {
      url: '/api/v2/gateways/withdrawals/:address/:currency'
    },
    // 获取支持的所有跨链资产列表
    currencies: {
      url: '/api/v2/gateways/currencies'
    },
    // 获取指定名称的跨链资产详情
    currency: {
      url: '/api/v2/gateways/currencies/:name'
    },
    // 获取指定跨链币种的充值地址
    address: {
      url: '/api/v2/gateways/address/:sender/:currency'
    },
    // 获取账户余额
    balances: {
      url: '/api/v2/balances/:address'
    },
    // 获取指定币种账户余额
    balance: {
      url: '/api/v2/balances/:address/:currency'
    },
    // 获取所有发行商
    issuers: {
      url: '/api/v2/uia/issuers'
    },
    // 获取指定发行商
    issuer: {
      url: '/api/v2/uia/issuers/:address'
    },
    // 获取所有资产
    assets: {
      url: '/api/v2/uia/assets'
    },
    // 获取指定账户发行的资产
    addressAssets: {
      url: '/api/v2/uia/issuers/:address/assets'
    },
    // 获取指定资产详情
    asset: {
      url: '/api/v2/uia/assets/:name'
    },
    // 获取指定资产详情
    agents: {
      url: '/api/v2/agents'
    },
    // 获取代理人代理列表
    agentsSupporter: {
      url: '/api/v2/agents/:name/clienteles'
    },
    // 获取转账记录
    transfers: {
      url: '/api/v2/transfers'
    },
    // 获取所有已注册侧链
    chains: {
      url: '/api/v2/chains'
    },
    chainsInstalled: {
      url: '/api/v2/chains/installed'
    }
  },

  // 区分 local 与 mainnet 的请求头参数
  magics: {
    development: '594fe0f3',
    production: '594fe0f3'
    // production: '5f5b3cf5'
  }
}

// TODO
const transTypes = {
  1: 'TRS_TYPE_TRANSFER',
  2: 'TRS_TYPE_NICKNAME',
  3: 'TRS_TYPE_SECOND_PASSWORD',
  4: 'TRS_TYPE_LOCK',
  5: 'TRS_TYPE_UNLOCK',
  6: 'TRS_TYPE_MULTI_ACCOUNT',
  7: 'TRS_TYPE_REGISTER_AGENT',
  8: 'TRS_TYPE_SET_AGENT',
  9: 'TRS_TYPE_REPEAL_AGENT',
  10: 'TRS_TYPE_DELEGATE',
  11: 'TRS_TYPE_VOTE',
  12: 'TRS_TYPE_REPEAL_VOTE',

  100: 'TRS_TYPE_UIA_ISSUER',
  101: 'TRS_TYPE_UIA_ASSET',
  102: 'TRS_TYPE_UIA_ISSUE',
  103: 'TRS_TYPE_UIA_TRANSFER',
  200: 'TRS_TYPE_DAPP',
  201: 'TRS_TYPE_UPDATE_DAPP_DELEGATE',
  202: 'TRS_TYPE_ADD_DAPP_DELEGATE',
  203: 'TRS_TYPE_DEL_DAPP_DELEGATE',
  204: 'TRS_TYPE_DEPOSIT',
  205: 'TRS_TYPE_WITHDRAWAL',

  300: 'TRS_TYPE_LAUNCH_PROPOSAL',
  301: 'TRS_TYPE_VOTE_PROPOSAL',
  302: 'TRS_TYPE_ACTIVATE_PROPOSAL',

  400: 'TRS_TYPE_REGISTER_GATEWAY',
  401: 'TRS_TYPE_OPEN_GATEWAY_ACCOUNT',
  402: 'TRS_TYPE_GATEWAY_DEPOSIT',
  403: 'TRS_TYPE_GATEWAY_WITHDRAW',
  404: 'TRS_TYPE_GATEWAY_WITHDRAW_CONFIRM'
}

export { urls, langsOpts, transTypes, officialPeers, fees }
