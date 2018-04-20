<template>
  <q-modal content-classes="row justify-center" v-model="show" minimized :no-esc-dismiss="true">
    <div class="bg-secondary padding-40 height-62 col-12">
      <span class="text-white font-22">{{$t('MORE_ASSETS')}}</span>
      <q-btn class="float-right height-62" flat :label="$t('label.close')" @click="close" />
    </div> 
    <!-- <q-toolbar slot="header">
            <q-search class="full-width" inverted v-model="filter" color="none" />
          </q-toolbar> -->
  
    <div class="row moreAssetModal-container col-12">
      <q-card class="col-4" v-for="(currency,idx) in currencies" :key="idx">
        <q-card-main>
          <div class="col-12">
            <span><img :src="currency.url"></span>
            <span>{{assetsInfo(currency)}}</span>
            <q-btn class="bg-primary text-white" flat :label="$t('DAPP_DEPOSIT')" @click="deposit(currency)" />
          </div>
          <!-- <q-item>
            <q-item-side>
              <q-item-tile avatar>
                <img :src="currency.url">
              </q-item-tile>
            </q-item-side>
            <q-item-main :label="assetsInfo(currency)" />
            <q-item-side right>
            <q-btn class="bg-primary text-white" flat :label="$t('DAPP_DEPOSIT')" @click="deposit(currency)" />
            </q-item-side>
          </q-item> -->
        </q-card-main>
      </q-card>
    </div>
  </q-modal>
</template>

<script>
import { mapActions } from 'vuex'
import {
  QModal,
  QToolbar,
  QToolbarTitle,
  QSearch,
  QCard,
  QCardTitle,
  QCardMain,
  QItem,
  QItemSide,
  QItemTile,
  QItemMain,
  QCardActions,
  QBtn
} from 'quasar'
import { secondPwd } from '../utils/validators'
import { required, minValue } from 'vuelidate/lib/validators'
import { toast } from '../utils/util'
import { convertFee } from '../utils/asch'

export default {
  name: 'DepositModal',
  props: ['show', ''],
  components: {
    QModal,
    QToolbar,
    QToolbarTitle,
    QSearch,
    QCard,
    QCardTitle,
    QCardMain,
    QItem,
    QItemSide,
    QItemTile,
    QItemMain,
    QCardActions,
    QBtn
  },
  data() {
    return {
      filter: '',
      currencies: [],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      }
    }
  },
  validations: {
    form: {
      address: {
        required
      },
      amount: {
        required,
        minValue: minValue(1)
      },
      receiver: {
        required
      }
    },
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    ...mapActions(['getCurrencies']),
    async getData() {
      // TODO
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await this.getCurrencies({
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      if (res.success === true) {
        this.currencies = res.currencies.filter(asset => !this.assetMap[asset.symbol])
        this.pagination.rowsNumber = res.count
      }
      return res
    },
    close() {
      this.$emit('close')
    },
    info(msg) {
      toast(msg)
    },
    assetsInfo(asset) {
      let balance = convertFee(asset.balance, asset.precision)
      return `${asset.symbol}  ${balance}   `
    },
    deposit(asset) {
      this.$emit('deposit', asset)
    }
  },
  computed: {
    assetMap() {
      let assetMap = {}
      if (this.assets && this.asset.length) {
        this.assets.forEach(asset => {
          assetMap[asset.symbol] = asset
        })
      }
      return assetMap
    }
  },
  watch: {
    filter(val) {
      if (val) {
        this.getData()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.moreAssetModal-container {
  padding: 40px;
}
</style>