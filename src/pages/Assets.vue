<template>
    <q-page padding>
      <big>
        {{$t('ASSET_PROFILE')}}
      </big>
      <q-card  >
          <q-card-title>
            {{$t('X_ASSETS')}}
          </q-card-title>
           <q-card-main class="row gutter-xs">
             <assets-panel v-for="(balance ,idx) in innerBalance" :key="idx" type='inner' :asset="balance" @transfer="innerTransfer"/>
           </q-card-main>
        </q-card>
      <q-card  >
          <q-card-title>
            {{$t('CROSS_ASSETS')}}
          </q-card-title>
           <q-card-main class="row gutter-xs">
            <assets-panel v-for="(balance ,idx) in innerBalance" :key="idx" type='outer' :asset="balance" @transfer="innerTransfer"  @deposit="deposit"  @withdraw="withdraw"/>
           </q-card-main>
        </q-card>
    </q-page>
</template>

<script>
import { QPage, QCard, QCardMain, QCardTitle } from 'quasar'
import AssetsPanel from '../components/AssetsPanel'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['userObj'],
  components: {
    AssetsPanel,
    QPage,
    QCard,
    QCardMain,
    QCardTitle
  },
  data() {
    return {
      innerBalance: [],
      outerBalance: [],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      filter: '',
      loading: false
    }
  },
  methods: {
    ...mapActions(['myBalances']),
    // TODO
    async getBalances(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await this.myBalances({
        address: this.user.account.address,
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      if (res.success) {
        this.innerBalance = res.balances
        // set max
        this.pagination.rowsNumber = res.count
        this.loading = false
      }
      return res
    },
    innerTransfer(asset) {
      this.$root.$emit('openTransactionDialog', asset)
    },
    deposit(asset) {
      console.log('deposit', asset)
    },
    withdraw(asset) {
      console.log('withdraw', asset)
    }
  },
  mounted() {
    if (this.user) {
      this.getBalances()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    }
  },

  watch: {
    userInfo(val) {
      if (val) {
        this.getBalances()
      }
    },
    pageNo(val) {
      this.getBalances()
    }
  }
  // register event
}
</script>

<style>

</style>
