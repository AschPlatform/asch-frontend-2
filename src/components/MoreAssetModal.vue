<template>
  <q-modal content-classes="modal-content-limit row justify-center" v-model="show" minimized no-backdrop-dismiss	 :no-esc-dismiss="true">
    <div class="bg-secondary padding-40 height-62 col-12">
      <span class="text-white font-22">{{$t('MORE_ASSETS')}}</span>
      <q-btn class="float-right height-62" flat :label="$t('label.close')" @click="close" />
    </div> 
    <!-- <q-toolbar slot="header">
            <q-search class="full-width" inverted v-model="filter" color="none" />
          </q-toolbar> -->
  
    <div :class="moreAssetClass">
      <q-card :class="moreAssetCardClass" v-for="(currency,idx) in currencies" :key="idx">
        <q-card-main>
          <div class="col-12">
          <i class="material-icons font-24 vertical-align-middle text-eight">fiber_manual_record</i>
            <span class="font-18 text-five vertical-align-middle">{{assetsInfo(currency)}}</span>
            <q-btn class="moreAssetModal-btn bg-primary text-white float-right" flat :label="$t('DAPP_DEPOSIT')" @click="deposit(currency)" />
          </div>
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
// import { convertFee } from '../utils/asch'

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
      // let balance = convertFee(asset.balance, asset.precision)
      return `${asset.symbol}  `
    },
    deposit(asset) {
      this.$emit('deposit', asset)
    }
  },
  computed: {
    moreAssetClass() {
      return this.isDesk
        ? 'row assetModal-container col-12 justify-between'
        : 'row col-12 justify-between assetModal-container-mobile'
    },
    moreAssetCardClass() {
      return this.isDesk ? 'col-5' : 'col-12 margin-top-20'
    },
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
.assetModal-container-mobile {
  padding: 20px 20px 40px 20px;
}

.assetModal-container {
  padding: 40px 20px;
}

.moreAssetModal-btn {
  padding: 2px 16px;
  border-radius: 15px;
  min-height: 20px;
}
</style>