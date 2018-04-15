const lang = {
  // common
  PREV_PAGE: '上一页',
  NEXT_PAGE: '下一页',

  TOTAL: '总',
  HEIGHT: '高度',
  DATE: '日期',
  PRODUCER: '生产者',
  TRANSACTIONS: '交易',
  AMOUNTS: '金额',
  FEES: '费用',
  REWARDS: '奖励',
  TYPE: '类型',
  SENDER: '发送者',
  RECIPIENT: '接受者',
  SECOND_PASSWORD: '二级密码',
  REMARK: '备注',
  REMARK_TIP: '长度范围：',

  // transaction type filter
  TRS_TYPE_TRANSFER: '转账',
  TRS_TYPE_TRANSFER_RECORD: '转账记录',
  TRS_TYPE_SECOND_PASSWORD: '二级密码',
  TRS_TYPE_DELEGATE: '受托人',
  TRS_TYPE_VOTE: '投票',
  TRS_TYPE_MULTISIGNATURE: '多重签名',
  TRS_TYPE_DAPP: '注册应用',
  TRS_TYPE_DEPOSIT: '应用充值',
  TRS_TYPE_WITHDRAWAL: '应用提现',
  TRS_TYPE_STORAGE: '存储',
  TRS_TYPE_UIA_ISSUER: '注册发行商',
  TRS_TYPE_UIA_ASSET: '注册资产',
  TRS_TYPE_UIA_FLAGS: '资产设置',
  TRS_TYPE_UIA_ACL: '资产访问控制',
  TRS_TYPE_UIA_ISSUE: '资产发行',
  TRS_TYPE_UIA_TRANSFER: '资产转账',
  TRS_TYPE_LOCK: '锁仓',
  // application
  DAPP_ICON: '图标',
  DAPP_NAME: '名称',
  DAPP_DESCRIPTION: '描述',
  DAPP_CATEGORY: '类型',
  DAPP_SOURCE_CODE: '源码',
  DAPP_DOWNLOAD: '点击下载',
  DAPP_LIST: '应用列表',
  DAPP_INSTALL_LIST: '已安装应用列表',
  DAPP_TRANSACTION_RECORD: '交易记录',
  DAPP_DEPOSIT: '充值',
  DAPP_BANLANCE_DETAIL: '余额详情',
  DAPP_DETAIL: '详情',
  DAPP_BILLION: '亿',
  DAPP_MILLION: '万',
  // dapp category filter
  DAPP_CATEGORY_COMMON: '通用',
  DAPP_CATEGORY_BUSINESS: '商业',
  DAPP_CATEGORY_SOCIAL: '社交',
  DAPP_CATEGORY_EDUCATION: '教育',
  DAPP_CATEGORY_ENTERTAINMENT: '娱乐',
  DAPP_CATEGORY_NEWS: '新闻',
  DAPP_CATEGORY_LIFE: '生活',
  DAPP_CATEGORY_UTILITIES: '工具',
  DAPP_CATEGORY_GAMES: '游戏',

  // blockchain browser
  LATEST_BLOCK: '最新区块',
  INPUT_SEARCH_CONTENT: '输入搜索内容',

  // block forging
  DELEGATE_INFO: '受托人基本信息',
  DELEGATE_REGISTER: '注册受托人',
  FORGING_ENABLE: '已开启',
  FORGING_DISABLE: '未开启',
  TOTAL_EARNINGS: '总收益',
  RANKING: '排名',
  PRODUCTIVITY: '生产率',
  APPROVAL: '得票率',
  PRODUCED_BLOCKS: '生产的区块',

  // header
  HOME: '首页',
  PERSONAL: '个人中心',
  APPLICATIONS: '应用中心',
  FORGING: '区块生产',
  BLOCKS: '区块浏览',
  VOTE: '投票',
  TRANSFER: '转账',
  PEERS: '节点',
  ASSET: '资产',
  ABOUT: '关于',

  // home
  BALANCE: '余额',
  LATEST_BLOCK_HEIGHT: '最后区块高度',
  VERSION_INFO: '版本信息',
  MY_TRSACTIONS: '我的交易',

  // login
  INPUT_PASSWORD: '输入主密码',
  KEEP_SESSION: '保持登录状态',
  LOGIN: '登录',
  NEW_ACCOUNT: '新账户',
  STEP: '步骤',
  CREATE_MASTER_PASSWORD: '创建钱包',
  NEW_PASSWORD: '新的主密码',
  NEW_PWD_TIP_1: '系统为您生成了足够安全的新密码，下一步将会要求您重复输入以确认密码',
  NEXT_STEP: '下一步',
  SAVE_PASSWORD: '保存主密码',
  CONFIRM_PASSWORD: '确认主密码',
  INPUT_PASSWORD_AGAIN: '请重新输入您的主密码',
  NEW_PWD_TIP_2:
    '请确保您已安全保存主密码，如果您失去您的主密码，您的帐户将永远无法再打开，您将失去您所有的XAS',
  CONFIRM: '确认',
  CANCEL: '返回',
  CREATE: '创建',
  CREATE_TIP1: '(密码由浏览器本地生成，请妥善备份保存)',
  CREATE_TIP2: '(复制或输入上面的主密码)',
  READ_TIP1: '我理解如果我丢失了密码，我将永远无法访问我的资产',
  READ_TIP2: '我理解如果我忘记或丢失了密码，将没有任何人能够帮助我恢复',
  READ_TIP3: '我已经写下了或者用其它方式保存了我的密码',
  CHOSE_SERVER: '选择服务器',
  COPY_SUCCESS: '复制成功',

  // transfer/pay
  SEND: '发送',
  ALREADY_LOCKED: '您已经锁仓，此行为被拒绝',
  PAY_TIP: '请确保您发送到正确的地址，本操作无法撤消',

  // peers
  PEER_LIST: '节点列表',
  OPERATING_SYSTEM: '操作系统',
  VERSION: '版本',
  // ASSET: '资产'
  REGISTERED_PUBLISHER: '注册发行商',
  REGISTERED_ASSETS: '注册资产',
  VALUE: '值',
  MY_ASSETS: '我发行的资产',
  OPERATION_RECORD: '操作记录',
  ISSUE_NUMBER: '本次发行量',
  ASSET_NAME: '资产名称',
  ACCESS_CONTROL: '权限控制',
  ASSET_PROFILE: '资产概况',
  MAXIMUM: '最大发行量',
  PRECISION: '精度',
  QUANTITY: '当前存量',
  CANCELLATION: '注销状态',
  OPERATION: '操作',
  DESCRIBE: '描述',
  TOPLIMIT: '上限',
  ACCURACY: '精度',
  STRATEGY: '策略',
  CURRENT_MODE: '当前模式',
  ADD_LIST: '新增名单',
  CURRENT_LIST: '当前名单',
  UPDATE_ACL: '更新ACL',
  PUBLISHER_ALREADY_REGISTERED: '你已经注册了发行商',
  NO_ASSET_RELATED_INFORMATION: '没有资产相关信息',
  STRATEGY_WARNING: '如果不懂如何使用，不要随意设置该字段',
  CHANGE_ACL_MODAL: '切换权限模式',
  CHANGE_TO: '切换为',
  // personal
  ACCOUNT_INFO: '账户信息',
  ACCOUNT_LOCK_TIP: '在到达此高度后解锁',
  LOCK_POSITION: '锁仓',
  ACCOUNT_TYPE_HINT: '请输入高度',
  ACCOUNT_TYPE2_HINT: '请输入二级密码',
  LOCK_POSITION_TITLE: '设置锁仓信息',
  QUIT: '退出系统',
  BASIC_INFO: '基本信息',
  ADDRESS: '地址',
  PUBLIC_KEY: '公钥',
  ALREADY_SET_TPI: '您已经设置过二级密码',
  ALREADY_SET_POSITIONLOCK: '您已经进行过锁仓设置',
  SET_SECOND_PASSWORD: '设置二级密码',
  PASSWORD_RULE_TIP: '输入8到16位数字和字母组合',
  INPUT_AGAIN: '再次输入',
  PASSWORD: '密码',
  SUBMIT_SECOND_PASSWORD_TIP:
    '请确定您已经安全保存了二级密码，一旦丢失，您在Asch系统中的财产将无法找回，设置二级密码需要5XAS手续费',
  SUBMIT: '提交',
  ALREADY_SET: '已设置',
  NOT_SET: '未设置',
  NOT_SET_BLOCKHEIGHT: '未锁仓',
  NOT_SET_ALREADYUNBLOCK: '已解锁',
  POSITIONLOCK_INFO: '锁仓状态',

  // vote
  DELETE: '删除',
  DELEGATE_LIST: '受托人列表',
  VOTE_RECORD: '投票记录',
  MY_VOTERS: '谁投了我',
  DELEGATE: '受托人',
  PRODUCED_NUMBER: '生产块数',
  USERNAME: '用户名',
  TOTAL_PEOPLES: '共%{count}人',

  // model - account detail
  ACCOUNT_DETAIL: '账户详情',

  // model - delegate register
  REGISTER_DELEGATE: '注册为受托人',
  DELEGATE_NAME: '受托人名称',
  INPUT_DELEGATE_NAME: '请输入受托人名称',
  DELEGATE_NAME_RULE_TIP: '至少8为数字和字母组合',
  REGISTER: '注册',
  NEED_PAY: '需要支付',

  // model - block detail
  BLOCK_DETAIL: '区块详情',
  TIME: '时间',
  PREVIOUS_BLOCK: '上一块',
  TRANSACTIONS_COUNT: '交易数',
  TOTAL_AMOUNTS: '交易总额',
  PAYLOAD_HASH: '摘要',
  PRODUCER_PUBKEY: '生产者公钥',

  // model - transaction detail/dealinfo
  TRANSACTION_INFO: '交易信息',
  CONFIRMATIONS: '确认数',

  // model - delete vote
  DELETE_VOTE_TITLE: '取消给受托人的投票',
  DELETE_VOTE_TIP: '每次可最多同时删除对33人的投票',

  // model - vote
  VOTE_TITLE: '投票给受托人',
  VOTE_TIP: '请确认您的选择与投票，每张票最多可以同时投33人',

  // toast errors
  ERR_INPUT_PASSWORD: '请输入密码',
  ERR_VIOLATE_BIP39: '密码格式不符合BIP39安全规范',
  ERR_SERVER_ERROR: '服务器错误,请检查您填写的信息是否正确',
  ERR_PASSWORD_NOT_EQUAL: '您输入的主密码不一致',
  ERR_DELEGATE_NAME_EMPTY: '受托人名称不能为空',
  ERR_DELEGATE_NAME_ADDRESS: '受托人名称不能为账户地址',
  ERR_DELEGATE_NAME_FORMAT: '受托人名称格式不正确',
  ERR_SECOND_PASSWORD_FORMAT: '二级密码输入格式不正确',
  ERR_NO_RECIPIENT_ADDRESS: '必须输入接收地址',
  ERR_RECIPIENT_ADDRESS_FORMAT: '接收地址格式不正确',
  ERR_RECIPIENT_EQUAL_SENDER: '接受地址与发送地址不能相同',
  ERR_AMOUNT_INVALID: '发送金额输入不正确',
  ERR_BALANCE_NOT_ENOUGH: '余额不足',
  ERR_NO_SECND_PASSWORD: '必须输入二级密码',
  ERR_TWO_INPUTS_NOT_EQUAL: '两次输入不一致',
  ERR_PASSWORD_INVALID_FORMAT: '密码格式不正确',
  ERR_AT_LEAST_SELECT_ONE_DELEGATE: '请选择一位受托人',
  ERR_DELETE_NO_MORE_THAN_33: '一次删除至多33位候选人',
  ERR_VOTE_NO_MORE_THAN_33: '一次投票至多33位候选人',
  ERR_POSITIONLOCK_EMPTY: '请输入内容',
  ERR_POSITIONLOCK_NOT_NUM: '请确认输入的是否为数字，并且范围在(1~ 10 000 000)之间',
  ERR_INVALID_REMARK: '备注输入内容不正确',
  ERR_NO_BALANCE: '余额不足，请先充值',
  ERR_NO_DEPOSIT_COIN: '请选择充值的币种',
  ERR_PUBLISHER_NOT_EMPTY: '必须输入发行商名称以及描述',
  ERR_NO_PUBLISHER_REGISTERED_YET: '你还没有注册发行商',
  ERR_ASSET_NAME_3_TO_6_CAPITAL_LETTERS: '请输入3-6位大写字母',
  ERR_MISSING_ASSET_DESCRIPTION: '请输入资产描述',
  ERR_ASSET_TOPLIMIT_NOT_CORRECT: '您输入的发行上限不正确',
  ERR_ASSET_PRECISION_NOT_CORRECT: '您输入的资产精度不正确',
  ERR_ASSET_PRECISION_MUST_BE_INTEGER_BETWEEN_0_16: '精度必须为0-16的整数',
  // toast error was bound here
  ERR_TOAST_SECONDKEY_WRONG: '您输入的二级密码有误',
  ERR_TOAST_TRANSACTION_AMOUNT_WRONG: '交易数额有误',
  ERR_TOAST_ASSET_NOTEXIST: '资产不存在',
  ERR_TOAST_ASSET_INSUFFICIENT: '资产余额不足',
  ERR_TOAST_VOTE_LIMIT: '只能选择小于或等于33人',
  ERR_TOAST_ACCOUNT_ALREADY_LOCKED: '已经锁仓',
  ERR_TOAST_ACCOUNT_INVALID_RECIPIENT: '接受地址错误',
  ERR_TOAST_ACCOUNT_INVALID_TIMESTAMP: '时间戳错误',
  ERR_READ_ALL: '请仔细阅读并勾选须知',
  // toast info
  INF_REGISTER_SUCCESS: '注册成功',
  INF_DELETE_SUCCESS: '删除成功',
  INF_TRANSFER_SUCCESS: '转账成功',
  INF_OPERATION_SUCCEEDED: '操作成功',
  INF_VOTE_SUCCESS: '投票成功',
  INF_SECND_PASSWORD_SET_SUCCESS: '二级密码设置成功',
  INF_POSITIONLOCK_SET_SUCCESS: '锁仓成功',

  ALLOW_WWB: '是否允许注销/白名单/黑名单',
  ALLOW_WRITEOFF: '是否允许注销',
  ALLOW_WHITELIST: '是否允许白名单',
  ALLOW_BLACKLIST: '是否允许黑名单',
  ALLOW: '允许',
  NOT_ALLOW: '不允许',
  WRITEOFF: '注销',
  CANT_ROLLBACK: '该操作不可逆',
  WHITELIST: '白名单',
  BLACKLIST: '黑名单',
  // dialog
  OPERATION_REQUIRES_FEE: '该操作需要消耗手续费',
  REQUIRES_FEE: '需要消耗手续费',

  // FRAGIL SET
  FRAGIL_PRE: '账户将在区块高度大于 ',
  FRAGIL_LAT: ' 后解锁',
  FRAGIL_ABOUT: '大约在',
  FRAGIL_DAY: '天',
  FRAGIL_HOUR: '时',
  FRAGIL_MIN: '分',
  FRAGIL_SEC: '秒',
  FRAGIL_RANGE: '锁仓高度应大于当前区块高度，并且锁仓周期少于10000000个区块间隔',
  FRAGIL_UNLOCK: '后解锁',

  // deposit
  DEPOSIT_COIN_TYPE: '选择充值所使用的币种',
  DEPOSIT_AMOUNT: '填写充值数量',
  DEPOSIT_SUCCESS: '充值成功',

  DAPP_SUPPORT_COIN: '支持的币种',
  DAPP_COIN_TOTAL_AMOUNT: '总量',
  DAPP_COIN_CURRENT_QUANTITY: '当前流通量',
  DAPP_COIN_BALANCE: 'DAPP余额',
  DAPP_COIN_FEE: '本次充值手续费: 0.1 xas',

  // 调教时间
  ADJUST_TIME_YOURSELF: '您本地时间与系统时间差别过大，请手动调校时间',
  ADJUST_TIME: '正在调校时间，请勿进行其他操作',

  // qrcode
  QRCODE: '主密钥二维码',
  QRCODE_ADDRESS: '您的地址二维码',
  CLICK_TO_SHOW: '点击获取',
  QRCODE_CLOSE: '点击二维码关闭',

  // ============== new add =================

  RECORD: '记录',
  MAIN_ASSET: '主资产',
  SEE_ALL_ASSETS: '查看全部资产',
  TRANSFER_TIP: '钱包转账为不可逆，请务必核对收款地址',
  RECEIVE: '收款',
  X_ASSETS: '链内资产',
  CROSS_ASSETS: '跨链资产',
  WITHDRAW: '提现',
  DEPOSIT: '充值',
  AVAILABLE_BALANCE: '可用转账余额',
  PROPOSAL: '提案',
  COUNCIL: '理事会',
  DEPOSIT_NO_ADDR_TIP: '你尚未开通 {currency} 钱包收款地址',
  DEPOSIT_TIP:
    '请将 {currency}充值到上述地址，该地址仅支持接收 {currency}，如果需要转入其他 token，请切换到相对应的 token 获取转入地址 钱包收款地址',
  OPEN_ADDR: '开通',
  VOTE_DELEGATE: '票权代理人',
  VOTE_DELEGATE_DETAIL: '代理人详情',
  VOTE_CANCEL: '撤销代理人',
  VOTE_SET: '设置代理人',
  VOTE_DELEGATE_TIP: '请输入用户昵称或钱包地址',
  ALL_BLOCKS: '全部区块',
  NOT_DELEGATE: '您还不是受托人',
  CHECK: '查看',
  MY_FORGING: '区块生产概况',
  // DELEGATE_REGISTER: '注册成为受托人',
  // DELEGATE_INFO: '',
  MORE_ASSETS: '获取更多资产',
  ASSET_DETAIL: '{currency} 详情',
  OVER_VIEW: '概括',
  ISSUER: '发行商',
  DELEGATE_POLLRATE: '得票率',
  DELEGATE_RANK: '当前排名',
  DELEGATE_TITLE: '注册成为受托人',
  I_AGREE: '我同意',
  DELEGATE_VOTERATE: '生产率',
  APP_CENTER: '应用中心',
  CREATE_MY_DAPP: '创建我的应用',
  LOAD_MORE: '加载更多',
  MY_BLOCKS: '我生产的区块',
  HELLO: '您好',
  SET_NICKNAME: '设置昵称',
  NICKNAME: '昵称',
  INPUT_NICKNAME: '请输入你想设置的昵称',
  ERR_NICKNAME: '昵称输入有误',
  NICKNAME_TIP: '昵称可用于转账，请慎重填写，最多3-20个字符',
  CHAR_NUM: '字符数',
  PRICE: '价格',
  NICKNAME_PRICE: '昵称价格对应表',
  SET_NOW: '立刻设置',
  LOCK_POSITION_CONF: '锁仓设置',
  HIGHEST_LOCK: '最高可锁仓',
  LOCK_DETAIL: '已锁仓额度：{amount} XAS 锁仓截止时间: {date}',
  AGENT_INFO: '代理人身份',
  IS_AGENT: '已经是代理人',
  REGISTER_AGENT: '注册成为代理人',
  EDIT: '修改',
  UNLOCK: '解锁',
  NUM: '额度',
  UNLOCK_TIME_TIPS: '到达高度(时间)后，可以手动解锁额度',
  UNLOCK_TIPS:
    '锁仓后，该部分额度将无法用于投票/转账在内的日常消耗，请根据实际情况预留出投票/转账等需要用到的额度',
  SET_UNLOCK_TIME: '选择时间',
  HEIGHT_NOT_ARRIVE: '未到解锁时间',
  NO_ISSUER_INFO: '您还不是发行商',
  COST_FEE: '将消耗 {num} XAS',
  GATEWAY_CANDIDATE: '网关候选人',
  HOW_TO_BE: '如何成为',
  PLEASE_LOCK: '请先锁仓',
  AGENT_DETAIL: '代理详情',
  AUTHOR_AMOUNT: '授权代理额度 {amunt} XAS',
  AGENT_VOTE_DETAIL: '票权代理情况',
  AGENT_VOTE_RECORDS: '投票记录',
  AUTHORIZOR: '授权人',
  AUTHORIZED_AMOUNT: '授权额度',
  WEIGHT: '权重比例(总)',
  LOCK_TIME: '锁仓时间',
  AUTHOR_TIME: '授权时间',
  VOTED_DELEGATE: '投票对象',
  VOTE_WEIGHT: '票权',
  VOTE_TIME: '投票时间',
  AGENT_WEIGHT: '代理权重',
  PLEASE_SET_NAME: '请先设置昵称',
  PROCESSED: '完成情况',
  DONE: '完成',
  PROCESS: '进行中',
  proposal: {
    No: '提案编号',
    INITIATOR: '发起人',
    TYPE: '类型',
    PERIOD: '公投周期',
    DETAIL: '提案描述',
    APPROVE: '赞成票数',
    OPERATION: '操作',
    TIP_VOTE: '投票',
    TIP_PASS: '投票已通过',
    TIP_REJECT: '投票未通过',
    TITLE_ALL: '全部提案',
    TITLE_PROCESS: '进行中的提案',
    TITLE_DONE: '已结束的提案',
    LAUNCH: '发起新提案',
    SHOW: '提案详情',
    SELECT_P_TITLE: '提案标题',
    SELECT_P_TYPE: '提案类型',
    SELECT_P_COUNCIL: '选择理事会',
    SELECT_P_NET: '选择网关',
    SELECT_NEWCOUNCIL: '新增理事会',
    SELECT_CHANGECOUNCIL: '更改理事会',
    SELECT_REMOVECOUNCIL: '撤销理事会',
    SELECT_CHANGEPERIOD: '更改周期',
    SELECT_CHANGEMEMBER: '更改成员',
    SELECT_P_PERIOD: '公投周期',
    BTN_LAUNCH: '发起',
    BTN_VOTE: '投票',
    SELECT_MEMBER_ACTION: '理事会成员操作',
    SELECT_MEMBER_ADD: '添加成员',
    SELECT_MEMBER_DELETE: '移除成员',
    SELECT_MEMBER_INSTEAD: '替换成员',
    SELECT_NEWNET: '新增网关',
    SELECT_CHANGENET: '更改网关',
    SELECT_INITNET: '网关初始化',
    SELECT_NETPERIOD: '更新最低更新频率',
    SELECT_NETMEMBER: '更新成员'
  },
  LAUNCH_MODAL: {
    MEMBER_NUMBER: '成员数量',
    MEMBER_MEMBER: '成员信息',
    NET_NAME: '网关名字',
    NET_CURRENCY: '默认币种',
    NET_CURRENCY_TIP: '至少填写一种默认币种，且必须是全部大写字母，多个币种用","隔开',
    PERIOD: '任职周期',
    PERIOD_NET: '最低更新频率',
    NET_NEW_LABEL: '(至少填写一种默认币种，且必须是全部大写字母)',
    PERSON: '名',
    BRIEF: '简要描述',
    BRIEF_TIP: '请输入简要描述',
    DAY: '天',
    REMOVE_COUNCIL: '我提议撤销理事会',
    REMOVE_REASON: '撤销原因',
    PERIOD_REASON: '任职周期更改原因',
    READ_TIP1: '自觉遵守《社区自治用户协议书》',
    READ_TIP2: '发布提案将消耗 100 XAS',
    INSTEAD_PRE: '由',
    INSTEAD_POST: '替换为',
    NET_PERIOD: '网关最低更新频率参数'
  },
  DETAIL_MODAL: {
    MEMBER_CHIPS_PRE: '投票成员名单',
    MEMBER_NUMBER: '成员数量',
    MEMBER_MEMBER: '成员信息',
    PERIOD: '任职周期',
    PERSON: '名',
    BRIEF: '简要描述',
    BRIEF_TIP: '请输入简要描述',
    DAY: '天',
    REMOVE_COUNCIL: '我提议撤销理事会',
    REMOVE_REASON: '撤销原因',
    PERIOD_REASON: '任职周期更改原因',
    INSTEAD_PRE: '由',
    INSTEAD_POST: '替换为',
    PERIOD_TITLE: '我提议修改当前理事会成员任职周期由{pre}替换为{post}',
    ADD_TITLE: '我提议增加如下受托人成为新的理事会成员',
    REMOVE_TITLE: '我提议撤销如下理事会成员',
    INSTEAD_TITLE_PRE: '我提议撤销如下理事会成员',
    INSTEAD_TITLE_POST: '增加如下受托人成为新的理事会成员'
  },
  COUNCIL_PAGE: {
    MODAL_TITLE: '共{number}人',
    MEMBER: '成员',
    ADDRESS: '地址',
    OPERATION: '操作',
    STARTTIME: '成立时间'
  },
  ERR: {
    ERR_5_30: '请输入5-30个字符',
    ERR_3_15: '请输入3-15个字符',
    ERR_1_30: '请输入1-30之间的数字',
    ERR_50_1000: '请输入50-1000个字符',
    ERR_REQUIRE_TYPE: '请选择提案类型',
    ERR_REQUIRE_CONTENT: '请选择内容',
    ERR_REQUIRE_TIME: '请选择时间',
    ERR_REQUIRE_DETAIL: '请选择提案详情',
    ERR_REQUIRE_NUMBER: '成员应在7-33人之间',
    ERR_REQUIRE_MEMBER: '请提名候选人'
  },

  // ==============  quasar i18n  =================

  lang: 'zh-hans',
  label: {
    clear: '清空',
    ok: '确定',
    cancel: '取消',
    close: '关闭',
    set: '设置',
    select: '选择',
    reset: '重置',
    remove: '移除',
    update: '更新',
    create: '创建',
    search: '搜索',
    filter: '过滤',
    refresh: '刷新'
  },
  date: {
    days: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    daysShort: '日_一_二_三_四_五_六'.split('_'),
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '一_二_三_四_五_六_七_八_九_十_十一_十二'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false
  },
  pullToRefresh: {
    pull: '下拉刷新',
    release: '释放刷新',
    refresh: '正在刷新...'
  },
  table: {
    noData: '没有可用数据',
    noResults: '找不到匹配的数据',
    loading: '正在加载...',
    selectedRows: rows =>
      rows > 1 ? `${rows} selected row(s).` : `${rows === 0 ? 'No' : '1'} selected rows.`,
    rowsPerPage: '每页的行数:',
    allRows: '全部',
    pagination: (start, end, total) => `${start}-${end} of ${total}`,
    columns: '列'
  },
  editor: {
    url: '地址',
    bold: '粗体',
    italic: '斜体',
    strikethrough: '删除线',
    underline: '下划线',
    unorderedList: '无序列表',
    orderedList: '有序列表',
    subscript: '子脚本',
    superscript: '超级脚本',
    hyperlink: '超链接',
    toggleFullscreen: '全屏切换',
    quote: '引号',
    left: '左对齐',
    center: '居中对齐',
    right: '右对齐',
    justify: '两端对齐',
    print: '打印',
    outdent: '减少缩进',
    indent: '增加缩进',
    removeFormat: '清除样式',
    formatting: '格式化',
    fontSize: '字体大小',
    align: '对齐',
    hr: '插入水平线',
    undo: '撤消',
    redo: '重做',
    header1: '标题一',
    header2: '标题二',
    header3: '标题三',
    header4: '标题四',
    header5: '标题五',
    header6: '标题六',
    paragraph: '段落',
    code: '代码',
    size1: '非常小',
    size2: '比较小',
    size3: '正常',
    size4: '中等偏大',
    size5: '大',
    size6: '非常大',
    size7: '超级大',
    defaultFont: '默认字体'
  },

  // agreement
  AGREEMENT_ASSET_CONTENT: '',
  AGREEMENT_ISSUER_CONTENT: ''
}

export default lang
