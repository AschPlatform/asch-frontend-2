<template>
  <q-card >
    <q-card-title>
      {{$t('TRS_TYPE_TRANSFER')}}
      <div slot="subtitle">{{$t('PAY_TIP')}}</div>
    </q-card-title>
    <q-card-main class="row justify-center" >
      <div class="col-10">
         <trans-panel :assets="assets"  :asset="asset" :user="user" >
          <div slot="btns" slot-scope="props">
          <q-btn big  color="primary" @click="props.send" :label="$t('SEND')" />
          </div>
        </trans-panel>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import TransPanel from '../components/TransPanel'
import { mapGetters } from 'vuex'

export default {
  props: ['userObj'],
  components: {
    TransPanel
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  computed: {
    ...mapGetters(['userInfo', 'balances']),
    user() {
      return this.userInfo
    },
    assets() {
      if (this.userInfo) {
        let balances = this.balances
        let assets = [this.asset].concat(balances)
        return assets
      } else {
        return []
      }
    },
    asset() {
      return {
        currency: 'XAS',
        precision: 8,
        balance: this.user && this.user.account ? this.user.account.xas : 0
      }
    }
  },
  watch: {}
}
</script>

<style>

</style>
