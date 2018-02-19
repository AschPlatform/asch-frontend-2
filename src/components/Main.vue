<template>
  <q-layout ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header">
      <q-btn flat @click="$refs.layout.toggleLeft()">
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
  
    <div slot="left">
      <!--
              Use <q-side-link> component
              instead of <q-item> for
              internal vue-router navigation
            -->
      <q-list no-border link inset-delimiter>
        <q-list-header>Essential Links</q-list-header>
        <q-side-link item :to="getRouterConf('home')">
          <q-item-side icon="home" />
          <q-item-main :label="$t('HOME')" />
        </q-side-link>
        <q-side-link item :to="getRouterConf('assets')">
          <q-item-side icon="attach money" />
          <q-item-main :label="$t('ASSET')" to="/assets" />
        </q-side-link>
        <q-side-link item :to="getRouterConf('personal')">
          <q-item-side icon="person" />
          <q-item-main :label="$t('PERSONAL')" />
        </q-side-link>
        <q-side-link item :to="getRouterConf('applications')">
          <q-item-side icon="apps" />
          <q-item-main :label="$t('APPLICATIONS')" />
        </q-side-link>
        <q-side-link item :to="getRouterConf('forging')">
          <q-item-side icon="gavel" />
          <q-item-main :label="$t('FORGING')" />
        </q-side-link>
        <q-side-link item :to="getRouterConf('blocks')">
          <q-item-side icon="public" />
          <q-item-main :label="$t('BLOCKS')" />
        </q-side-link>
        <q-side-link item :to="getRouterConf('vote')">
          <q-item-side icon="format list numbered" />
          <q-item-main :label="$t('VOTE')" />
        </q-side-link>
        <q-side-link item :to="getRouterConf('transfer')">
          <q-item-side icon="compare arrows" />
          <q-item-main :label="$t('TRANSFER')" />
        </q-side-link>
        <q-side-link item :to="getRouterConf('peers')">
          <q-item-side icon="blur on" />
          <q-item-main :label="$t('PEERS')" />
        </q-side-link>
      </q-list>
    </div>
    <q-transition appear enter="fadeIn" leave="fadeOut" mode="out-in" :duration="500">
      <router-view :userObj="user" />
    </q-transition>
  </q-layout>
</template>

<script>
import {
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QSideLink,
  Toast
} from 'quasar'
import { api } from '../utils/api'

export default {
  name: 'Home',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QSideLink,
    Toast
  },
  data() {
    return {
      user: null
    }
  },
  computed: {},
  methods: {
    logout() {
      this.$session.remove('user')
      this.$router.push('/login')
    },
    launch(url) {
      openURL(url)
    },
    getRouterConf(name) {
      const conf = {
        name: name,
        params: {
          user: this.user
        }
      }
      return conf
    }
  },
  async mounted() {
    let user = this.$route.params.user || this.$session.get.item('user') || null
    // TODO
    if (!user) {
      console.log('no session data, please login...')
      this.$router.push('/login')
    } else {
      let res = await api.login({
        publicKey: user.account.publicKey
      })
      this.user = { ...user, ...res }
    }
  },
  beforeDestroy() {}
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
</style>
