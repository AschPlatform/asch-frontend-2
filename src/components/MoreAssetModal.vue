<template>
  <q-modal :content-classes="contentClass" v-model="show" no-backdrop-dismiss	 :no-esc-dismiss="true">
    <div class="bg-secondary title height-62 col-12">
      <span class="text-white font-18">{{$t('MORE_ASSETS')}}</span>
    </div> 
    <div :class="moreAssetClass">
      <q-card :class="moreAssetCardClass" v-for="(currency,idx) in currencies" :key="idx">
        <q-card-main>
          <div class="col-12">
          <asset-icon :iconKey="currency.symbol" class="font-24 vertical-align-middle text-eight"></asset-icon>
            <span class="font-14 text-five vertical-align-middle">{{assetsInfo(currency)}}</span>
            <q-btn class="moreAssetModal-btn bg-primary text-white q-ml-lg" flat :label="$t('DAPP_DEPOSIT')" @click="deposit(currency)" />
          </div>
        </q-card-main>
      </q-card>
    </div>
    <div class="row justify-center q-px-md">
      <q-btn :class="btnClass" flat :label="$t('label.close')" @click="close" />
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
import AssetIcon from '../components/AssetIcon'

export default {
  name: 'MoreAssetModal',
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
    QBtn,
    AssetIcon
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
      return this.isDesk ? 'col-6' : 'col-12 margin-top-20'
    },
    assetMap() {
      let assetMap = {}
      if (this.assets && this.asset.length) {
        this.assets.forEach(asset => {
          assetMap[asset.symbol] = asset
        })
      }
      return assetMap
    },
    contentClass() {
      return this.isDesk ? 'row justify-center' : ''
    },
    btnClass() {
      return this.isDesk ? 'bg-secondary text-white q-my-md' : 'full-width bg-secondary text-white q-my-md q-px-md'
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
.title
  padding 0 20px
</style>