import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load(component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

const router = new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    { path: '/login', component: load('Login'), name: 'login' },
    {
      path: '/',
      component: load('Main'),
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
})

// add hook verify cookie

router.beforeEach((to, from, next) => {
  let user = to.params.user || Vue.prototype.$session.get.item('user')
  if (to.path.indexOf('login') > 0 || user) {
    next({ params: { user: user } })
    return null
  } else {
    next({ path: '/login', replace: true })
    return null
  }
})

export default router
