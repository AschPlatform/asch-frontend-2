<template>
  <q-layout ref="layout" view="lHh Lpr fff">
    <q-layout-header>
  
      <q-toolbar>
        <q-btn flat @click="showLeft=!showLeft">
          <q-icon name="menu" />
        </q-btn>
  
        <q-toolbar-title>
          Asch
          <div slot="subtitle"></div>
        </q-toolbar-title>
        <q-btn flat @click="logout">
          <q-icon name="power settings new" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>
  
  
    <q-layout-drawer v-model="showLeft" side="left">
      <!--
                  Use <q-item> component
                  instead of <q-item> for
                  internal vue-router navigation
                -->
      <q-list no-border link inset-delimiter>
        <q-list-header> <img :src="logo" /> </q-list-header>
        <q-item item :to="getRouterConf('home')">
          <q-item-side icon="home" />
          <q-item-main :label="$t('HOME')" />
        </q-item>
        <q-item item :to="getRouterConf('account')">
          <q-item-side icon="attach money" />
          <q-item-main :label="$t('ASSET')"  />
        </q-item>
        <q-item item :to="getRouterConf('personal')">
          <q-item-side icon="person" />
          <q-item-main :label="$t('PERSONAL')" />
        </q-item>
        <q-item item :to="getRouterConf('applications')">
          <q-item-side icon="apps" />
          <q-item-main :label="$t('APPLICATIONS')" />
        </q-item>
        <q-item item :to="getRouterConf('forging')">
          <q-item-side icon="gavel" />
          <q-item-main :label="$t('FORGING')" />
        </q-item>
        <q-item item :to="getRouterConf('blocks')">
          <q-item-side icon="public" />
          <q-item-main :label="$t('BLOCKS')" />
        </q-item>
        <q-item item :to="getRouterConf('vote')">
          <q-item-side icon="format list numbered" />
          <q-item-main :label="$t('VOTE')" />
        </q-item>
        <q-item item :to="getRouterConf('transfer')">
          <q-item-side icon="compare arrows" />
          <q-item-main :label="$t('TRANSFER')" />
        </q-item>
        <q-item item :to="getRouterConf('peers')">
          <q-item-side icon="blur on" />
          <q-item-main :label="$t('PEERS')" />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="500">
        <router-view :userObj="user" />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from '../utils/api'
import { setCache, getCache, removeCache } from '../utils/util'
import logo from '../assets/icon.png'
const func = () => {}

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      user: null,
      showLeft: true,
      logo: logo
    }
  },
  computed: {},
  methods: {
    logout() {
      removeCache('user')
      this.$router.push('/login')
    },
    getRouterConf(name) {
      const conf = {
        name: name,
        params: {
          user: this.user
        }
      }
      return conf
    },
    async refreshAccount(cb = func) {
      // refresh user balance
      console.log('event refreshAccount...')
      let res = await api.account({
        address: this.user.account.address
      })
      let user = this._.merge({}, this.user, res)
      this.user = user
      setCache('user', user)
      this._.delay(() => cb(), 1500) // delay refresh
    },
    async getIssuer(cbOk = func, cbErr = func) {
      // get user issuer info
      let res = await api.issuer({
        address: this.user.account.address
      })
      if (res.success) {
        this.user.issuer = res.issuer
        let user = this._.merge({}, this.user, res)
        this.user = user
        setCache('user', user)
        cbOk(res)
        // TODO
      } else {
        cbErr()
      }
    },
    async getAssetsList(cbOk = func, cbErr = func) {
      // get user issuer info
      let res = await api.uiaAssetListApi({})
      if (res.success) {
        let assets = [{ key: 0, value: 'XAS', label: 'XAS' }].concat(
          res.assets.map((item, idx) => {
            return { key: idx + 1, label: item.name, value: item.name }
          })
        )

        let user = this._.merge({}, this.user, { assets })
        this.user = user
        setCache('user', user)
        cbOk(res)
      } else {
        cbErr()
      }
    }
  },
  async mounted() {
    let user = this.$route.params.user || getCache('user') || null
    if (!user) {
      console.log('no session data, please login...')
      this.$router.push('/login')
    } else {
      let res = await api.login({
        publicKey: user.account.publicKey
      })
      this.user = {
        ...user,
        ...res
      }
      console.log(user)
    }
  },
  created() {
    // register event
    this.$root.$on('refreshAccount', this.refreshAccount)
    this.$root.$on('getAssetsList', this.getAssetsList)
    this.$root.$on('getIssuer', () => {
      this.user && this.user.account ? this.getIssuer() : console.log('not init yet..')
    })
  },
  beforeDestroy() {
    this.$root.$off('refreshAccount', this.refreshAccount)
    this.$root.$off('refreshAccount', this.getAssetsList)
    this.$root.$off('getIssuer', this.getIssuer)
  }
}
</script>

<style lang="stylus">
.logo-container {
  width: 255px;
  height: 242px;
  perspective: 800px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.logo {
  position: absolute;
  transform-style: preserve-3d;
}

.q-field {
  margin-top: 15px;
}

.card-table-container {
  overflow-x: scroll;
}
</style>
