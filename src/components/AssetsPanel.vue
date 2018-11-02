<template>
  <q-card class="col-auto assets-panel-content no-shadow">
    <q-card-main class="shadow-1 bg-white">
      <div @click="open">
        <q-item v-if="type=='inner'">
          <q-item-side v-if="asset.url" :avatar="asset.url" />
          <q-item-main>
            <q-item-tile class="asset-currency font-18 text-five vertical-align-middle" label>
              {{asset.currency}}
            </q-item-tile>
          </q-item-main>
        </q-item>

        <q-item v-if="type=='outer' || type=='outer-simple' || type=='outer-compensate' || type=='outer-constrated'">
          <q-item-side v-if="asset.url" :avatar="asset.url" />
          <q-item-main>
            <q-item-tile class="asset-currency font-18 text-five vertical-align-middle" label>
              {{asset.currency}}
            </q-item-tile>
          </q-item-main>
        </q-item>

        <q-item class="text-primary font-22" v-if="type=='inner'">
        {{asset.balance | fee(asset.asset ? asset.asset.precision : 8)}} 
        </q-item>

        <q-item class="text-secondary font-22" v-if="type=='outer' || type=='outer-simple' || type=='outer-compensate' || type=='outer-constrated'">
        {{asset.balance | fee(asset.precision)}} 
        </q-item>
      </div>
  
      <q-card-actions class="justify-end" v-if="type=='inner'">
        <q-btn flat small class="assets-btn q-hoverable bg-primary text-white q-btn-rounded" :label="$t('TRS_TYPE_TRANSFER')" @click.stop="transfer(asset)" />
      </q-card-actions>
      <q-card-actions class="justify-end" v-if="type=='outer' && revoked === 0">
        <q-btn flat outline class="assets-btn q-hoverable bg-secondary text-white q-btn-rounded" color="secondary" :label="$t('DEPOSIT')" @click="deposit(asset)" />
        <q-btn flat class="assets-btn inline rinnerBalanceelative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="secondary" :label="$t('TRS_TYPE_TRANSFER')" @click="transfer(asset)" />
        <q-btn flat class="assets-btn inline relative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="secondary" :label="$t('WITHDRAW')" @click="withdraw(asset)" />
      </q-card-actions>
      <q-card-actions class="justify-end" v-if="type=='outer-constrated'">
        <!-- <q-btn flat outline class="assets-btn q-hoverable bg-secondary text-white q-btn-rounded" color="secondary" :label="$t('DEPOSIT')" @click="deposit(asset)" /> -->
        <q-btn flat class="assets-btn inline rinnerBalanceelative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="secondary" :label="$t('TRS_TYPE_TRANSFER')" @click="transfer(asset)" />
        <q-btn flat class="assets-btn inline relative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="secondary" :label="$t('WITHDRAW')" @click="withdraw(asset)" />
      </q-card-actions>
      <q-card-actions class="justify-end" v-if="type=='outer' && revoked === 2">
        <!-- <q-btn flat outline class="assets-btn q-hoverable bg-secondary text-white q-btn-rounded" color="secondary" :label="$t('DEPOSIT')" @click="deposit(asset)" />
        <q-btn flat class="assets-btn inline rinnerBalanceelative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="secondary" :label="$t('TRS_TYPE_TRANSFER')" @click="transfer(asset)" />
        <q-btn flat class="assets-btn inline relative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="secondary" :label="$t('WITHDRAW')" @click="withdraw(asset)" /> -->
        <q-btn flat outline class="assets-btn q-hoverable bg-negative text-white q-btn-rounded" color="negative" :label="$t('COMPENSATE')" @click="compensate(asset)" />
      </q-card-actions>
      <q-card-actions class="justify-end" v-if="type=='outer-simple'">
        <q-btn flat outline class="assets-btn q-hoverable bg-secondary inline rinnerBalanceelative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="white" :label="$t('TRS_TYPE_TRANSFER')" @click="transfer(asset)" />
        <q-btn flat class="assets-btn inline relative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="secondary" :label="$t('WITHDRAW')" @click="withdraw(asset)" />
      </q-card-actions>
      <q-card-actions class="justify-end" v-if="type=='outer-compensate'">
        <q-btn flat outline class="assets-btn q-hoverable bg-negative text-white q-btn-rounded" color="negative" :label="$t('COMPENSATE')" @click="compensate(asset)" />
      </q-card-actions>
    </q-card-main>
  </q-card>
</template>

<script>
import {
  QCard,
  QListHeader,
  QCardMain,
  QItem,
  QItemSide,
  QItemTile,
  QCardActions,
  QBtn,
  QItemMain
} from 'quasar'
import { convertFee } from '../utils/asch'

export default {
  name: 'AssetPanel',
  props: ['asset', 'type', 'claim', 'revoked'],
  components: {
    QListHeader,
    QCard,
    QCardMain,
    QItem,
    QItemSide,
    QItemTile,
    QCardActions,
    QBtn,
    QItemMain
  },
  data() {
    return {}
  },
  methods: {
    transfer() {
      this.$emit('transfer', this.asset)
    },
    deposit() {
      this.$emit('deposit', this.asset)
    },
    withdraw() {
      this.$emit('withdraw', this.asset)
    },
    open() {
      this.$emit('open', this.asset)
    },
    compensate() {
      this.$emit('compensate', this.asset)
    },
    convertFee(num, pre) {
      return convertFee(num, pre)
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
.assets-panel-content {
  cursor: pointer;
  min-width: 300px;
}

.assets-panel-content-ball {
  display: inline-block;
  width: 44px;
  height: 44px;
  background: #d7d7d7;
  border-radius: 50%;
  vertical-align: middle;
}

.assets-btn {
  min-height: 0;
  padding: 2px 16px;
}

.asset-currency {
  display: inline-block;
}

.asset-balance {
}

.q-btn:hover {
  color: #ffffff !important;
  background: #43aea8 !important;
}

.q-btn {
  min-height: 0 !important;
}
</style>