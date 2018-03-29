<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div v-if="user" class="layout-padding self-center">
    <div class="row gutter-xs col-12">
      <div class="col-12 col-auto  col-xs-12">
        <q-card>
          <q-card-main class="row">
            <div class="col-6">
              <jdenticon  :address="user.account.address" :size="60" />
            </div>
            <div  class="col-6">
              <q-btn size="xs" :label="$t('TRS_TYPE_TRANSFER')" flat   @click="$root.$emit('openTransactionDialog',{currency:'XAS',precision:8})" />
              <q-btn size="xs" :label="$t('RECEIVE')"  flat   @click="receive" />
            </div>
          </q-card-main>
        </q-card>
      </div>
    </div>
  
    <div class="row col shadow-1 trans-table">
      <div class="col-5">
        <q-card class="card-info" color="primary ">
          <q-card-title>
            {{$t('BALANCE')}}
          </q-card-title>
           <q-card-main >
             {{userInfo.account.balance | fee}}
             {{$t('MAIN_ASSET')+'XAS'}}
             <div>  
             {{address}}
              <q-btn v-clipboard="address" @success="info('copy senderId success...')" size="xs"  flat round icon="compare arrows" />
             </div>
             <div class="row justify-center" @click="showAddrQr">
               <vue-qr :size="100" :text="address"></vue-qr>
             </div>
           </q-card-main>
          <q-card-main >
            <q-list highlight>
              <q-item v-for="(balance,idx) in  balances" :key="idx">
                <q-item-side>
                  <q-item-tile avatar>
                    <img :src="null">
                  </q-item-tile>
                </q-item-side>
                <q-item-main :label="balance.currency" />
                <q-item-side right>
                  <q-item-tile >
                    {{balance.balance | fee(balance.precision)}}
                  </q-item-tile>
                </q-item-side>
              </q-item>
            </q-list>
            <q-btn @click="assets" flat :label="$t('SEE_ALL_ASSETS')" icon="compare arrows" />
          </q-card-main>
        </q-card>
      </div>
        <div class="col-7">
          <trans-record-container :userInfo="userInfo" />
        </div>
    </div>
    
  </div>
</template>

<script>
import Jdenticon from '../components/Jdenticon'
import TransRecordContainer from '../components/TransRecordContainer'
import VueQr from 'vue-qr'
import { mapGetters } from 'vuex'
import {
  QCard,
  QCardMain,
  QCardTitle,
  QModal,
  QTable,
  QTd,
  QBtn,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile
} from 'quasar'

export default {
  props: ['userObj'],
  components: {
    VueQr,
    Jdenticon,
    QCard,
    QCardMain,
    QCardTitle,
    QModal,
    QTable,
    QTd,
    QBtn,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    TransRecordContainer
  },
  data() {
    return {
      refreshLoading: false
    }
  },
  methods: {
    refreshBalance(e, done) {
      this.refreshLoading = true
      this.$root.$emit('refreshAccount', () => (this.refreshLoading = false))
    },
    showAddrQr() {
      this.$root.$emit('showQRCodeModal', this.address)
    },
    assets() {
      this.$router.push('assets')
    },
    // get transactions
    receive() {}
  },
  mounted() {
    if (this.user) {
      this.getTrans()
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'balances']),
    user() {
      return this.userInfo
    },
    address() {
      return this.userInfo && this.userInfo.account ? this.userInfo.account.address : 'nothing'
    }
  },
  watch: {}
}
</script>

<style lang="stylus">
.card-info {
  height: 150px;
}

.info-tbody {
  tr {
    cursor: text;
  }
}

.link-cursor {
  cursor: point;
}
</style>
