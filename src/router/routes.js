function load(component, path = false) {
  let comp = path ? () => import(`src/layouts/${component}.vue`) : () => import(`src/pages/${component}.vue`)
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
        path: 'personal',
        name: 'personal',
        component: load('Personal')
      },
      {
        path: 'forging',
        name: 'forging',
        component: load('Forging')
      },
      {
        path: 'blocks',
        name: 'blocks',
        component: load('Blocks')
      },
      {
        path: 'vote',
        name: 'vote',
        component: load('Vote')
      },
      {
        path: 'transfer',
        name: 'transfer',
        component: load('Transfer')
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
      }
    ]
  },
  // Always leave this last one
  { path: '*', component: load('Error404') } // Not found
]
