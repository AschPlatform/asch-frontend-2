<template>
  <q-card class="q-p-lg">
    <q-card-title>
      {{$t('TRS_TYPE_TRANSFER')}}
      <div slot="subtitle">{{$t('PAY_TIP')}}</div>
    </q-card-title>
    <q-card-main class="row justify-center" >
      <div class="col-10">
         <trans-panel  :asset="asset" :user="user" >
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
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['userObj'],
  components: {
    TransPanel
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(['getBalance'])
  },
  async mounted() {},
  computed: {
    ...mapGetters(['userInfo', 'balances']),
    user() {
      return this.userInfo
    },
    asset() {
      if (this.user) {
        return {
          currency: 'XAS',
          precision: 8,
          balance: this.user.account.xas
        }
      } else {
        return null
      }
    }
  },
  watch: {}
}
</script>

<style>

</style>
