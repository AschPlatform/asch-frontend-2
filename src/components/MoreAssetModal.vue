<template>
  <q-modal content-classes="row justify-center" v-model="show" maximized>
    <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
           {{$t('MORE_ASSETS')}}
          </q-toolbar-title>
        </q-toolbar>

        <q-toolbar slot="header">
          <q-search class="full-width" inverted v-model="filter" color="none" />
        </q-toolbar>

        <q-toolbar slot="footer">
          <q-btn flat :label="$t('label.close')" @click="close"/>
        </q-toolbar>
        <div class="row layout-padding">
          <q-card class="col-4" v-for="(asset,idx) in assets" :key="idx">
            <q-card-main>
              <q-item>
                <q-item-side>
                  <q-item-tile avatar>
                    <img :src="asset.url">
                  </q-item-tile>
                </q-item-side>
                <q-item-main :label="assetsInfo(asset)" />
                <q-item-side right>
                  <q-btn flat :label="$t('DAPP_DEPOSIT')" @click="deposit(asset)" />
                </q-item-side>
              </q-item>
            </q-card-main>
          </q-card>
        </div>
   </q-modal-layout>
  </q-modal>
</template>
<script>
import { mapActions } from 'vuex'
import {
  QModal,
  QModalLayout,
  QToolbar,
  QToolbarTitle,
  QSearch,
  QCard,
  QCardTitle,
  QCardMain,
  QItem,
  QItemSide,
  QItemTile,
  QCardActions,
  QBtn
} from 'quasar'
import { secondPwd } from '../utils/validators'
import { required, minValue } from 'vuelidate/lib/validators'
import { toast } from '../utils/util'
import { convertFee } from '../utils/asch'

export default {
  name: 'DepositModal',
  props: ['assets', 'show'],
  components: {
    QModal,
    QModalLayout,
    QToolbar,
    QToolbarTitle,
    QSearch,
    QCard,
    QCardTitle,
    QCardMain,
    QItem,
    QItemSide,
    QItemTile,
    QCardActions,
    QBtn
  },
  data() {
    return {
      filter: ''
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
  mounted() {},
  methods: {
    ...mapActions(['getMoreAssets']),
    async getData() {
      // TODO
      let res = await this.getMoreAssets()
      this.close()
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
      return `${asset.currency}   ${balance}   `
    },
    deposit(asset) {
      this.$emit('deposit', asset)
    }
  },
  computed: {},
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
</style>