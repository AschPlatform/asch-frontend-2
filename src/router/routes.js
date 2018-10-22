function load(component, path = false) {
  let comp = path
    ? () => import(`src/layouts/${component}.vue`)
    : () => import(`src/pages/${component}.vue`)
  return comp
}

export default [
  { path: '/login', component: load('login', true), name: 'login' },
  {
    path: '/',
    component: load('main', true),
    name: 'main',
    children: [
      {
        path: 'home',
        name: 'home',
        component: load('Home')
      },
      {
        path: 'assets',
        name: 'assets',
        component: load('Assets')
      },
      {
        path: '/assetDetail',
        name: 'assetDetail',
        component: load('AssetDetail')
      },
      {
        path: 'addACL',
        name: 'addACL',
        component: load('ACLEdit')
      },
      {
        path: 'reduceACL',
        name: 'reduceACL',
        component: load('ACLEdit')
      },
      {
        path: 'personal',
        name: 'personal',
        component: load('Personal')
      },
      {
        path: 'bancor',
        name: 'bancor',
        component: load('Bancor')
      },
      // {
      //   path: 'forging',
      //   name: 'forging',
      //   component: load('Forging')
      // },
      {
        path: 'blocks',
        name: 'blocks',
        component: load('Blocks')
      },
      {
        path: 'contract',
        name: 'contract',
        component: load('Contract')
      },
      {
        path: 'postContract',
        name: 'postContract',
        component: load('PostContract')
      },
      {
        path: 'postApplyGateway',
        name: 'postApplyGateway',
        component: load('PostApplyGateway')
      },
      {
        path: 'contractDetail/:name',
        name: 'contractDetail',
        component: load('ContractDetail')
      },
      {
        path: 'vote',
        name: 'vote',
        component: load('Vote'),
        children: [
          {
            path: 'delegates',
            name: 'delegates',
            component: load('Delegates')
          },
          {
            path: 'voteRecords',
            name: 'voteRecords',
            component: load('VotesRecords')
          },
          {
            path: 'supporters',
            name: 'supporters',
            component: load('Supporters')
          }
        ]
      },
      {
        path: 'agentDetail',
        name: 'agentDetail',
        component: load('AgentDetail')
      },
      {
        path: 'transfer',
        name: 'transfer',
        component: load('Transfer')
      },
      {
        path: 'proposal',
        name: 'proposal',
        component: load('Proposal')
      },
      {
        path: 'launchProposal',
        name: 'launchProposal',
        component: load('ProposalLaunch')
      },
      {
        path: 'proposalDetail/:tid',
        name: 'proposalDetail',
        component: load('ProposalDetail')
      },
      {
        path: 'councilDetail',
        name: 'councilDetail',
        component: load('councilDetail')
      },
      {
        path: 'gateway',
        name: 'gateway',
        component: load('Gateway')
      },
      {
        path: 'gatewayDetail',
        name: 'gatewayDetail',
        component: load('GatewayDetaill')
      },
      {
        path: 'peers',
        name: 'peers',
        component: load('Peers')
      },
      {
        path: 'applications',
        name: 'applications',
        component: load('Applications')
      },
      {
        path: 'issuer',
        name: 'issuer',
        component: load('Issuer')
      },
      {
        path: 'bancor',
        name: 'bancor',
        component: load('Bancor')
      },
      {
        path: 'contract',
        name: 'contract',
        component: load('Contract')
      },
      {
        path: 'newContract',
        name: 'newContract',
        component: load('NewContract')
      },
      {
        path: 'contractDetail/:name',
        name: 'contractDetail',
        component: load('ContractDetail')
      }
    ]
  },
  // Always leave this last one
  { path: '*', component: load('Error404') } // Not found
]
