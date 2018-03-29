<template>
<q-card class="col-4">
  <q-card-main>
    <div @click="open">
      <q-item>
        <q-item-side v-if="asset.url" :avatar="asset.url" />
        <q-item-main>
          <q-item-tile label>{{asset.currency}}</q-item-tile>
        </q-item-main>
        <q-item-side right>
          {{asset.balance | fee(asset.precision)}}
        </q-item-side>
      </q-item>
    </div>
    
      <q-card-actions v-if="type=='inner'">
      <q-btn flat  :label="$t('TRS_TYPE_TRANSFER')" @click="transfer(asset)" />
    </q-card-actions>
    <q-card-actions v-if="type=='outer'">
      <q-btn flat dense :label="$t('DEPOSIT')" @click="deposit(asset)"/>
      <q-btn flat :label="$t('TRS_TYPE_TRANSFER')"  @click="transfer(asset)"/>
      <q-btn flat :label="$t('WITHDRAW')"  @click="withdraw(asset)"/>
    </q-card-actions>
  </q-card-main>
</q-card>
  
</template>
<script>
import { QCard, QCardMain, QItem, QItemSide, QItemTile, QCardActions, QBtn } from 'quasar'

export default {
  name: 'AssetPanel',
  props: ['asset', 'type'],
  components: { QCard, QCardMain, QItem, QItemSide, QItemTile, QCardActions, QBtn },
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
</style>