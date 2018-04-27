<template>
  <q-card class="col-3 assets-panel-content">
    <q-card-main>
      <div @click="open">
        <q-item v-if="type=='inner'">
          <q-item-side v-if="asset.url" :avatar="asset.url" />
          <q-item-main>
            <span class="assets-panel-content-ball"></span>
            <q-item-tile class="asset-currency font-24 text-five vertical-align-middle" label>
              {{asset.currency}}
            </q-item-tile>
          </q-item-main>
        </q-item>

        <q-item v-if="type=='outer'">
          <q-item-side v-if="asset.url" :avatar="asset.url" />
          <q-item-main>
            <span class="assets-panel-content-ball"></span>
            <q-item-tile class="asset-currency font-24 text-five vertical-align-middle" label>
              {{asset.currency}}
            </q-item-tile>
          </q-item-main>
        </q-item>

        <q-item class="text-primary font-22" v-if="type=='inner'">
        {{asset.balance | fee(asset.precision)}} 
        </q-item>

        <q-item class="text-secondary font-22" v-if="type=='outer'">
        {{asset.balance | fee(asset.precision)}} 
        </q-item>
      </div>
  
      <q-card-actions class="justify-end" v-if="type=='inner'">
        <q-btn flat small class="assets-btn q-hoverable bg-primary text-white q-btn-rounded" :label="$t('TRS_TYPE_TRANSFER')" @click.stop="transfer(asset)" />
      </q-card-actions>
      <q-card-actions class="justify-end" v-if="type=='outer'">
        <q-btn flat outline class="assets-btn q-hoverable bg-secondary text-white q-btn-rounded" color="secondary" :label="$t('DEPOSIT')" @click="deposit(asset)" />
        <q-btn flat class="assets-btn inline rinnerBalanceelative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="secondary" :label="$t('TRS_TYPE_TRANSFER')" @click="transfer(asset)" />
        <q-btn flat class="assets-btn inline relative-position q-btn-item non-selectable q-btn-rectangle q-btn-outline q-focusable q-hoverable q-btn-rounded" color="secondary" :label="$t('WITHDRAW')" @click="withdraw(asset)" />
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

export default {
  name: 'AssetPanel',
  props: ['asset', 'type'],
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
    }
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
.assets-panel-content {
  margin: 15px 30px;
  background: #ffffff;
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
  // display: block;
}

.q-btn:hover {
  color: #ffffff !important;
  background: #43aea8 !important;
}

.q-btn {
  min-height: 0 !important;
}
</style>