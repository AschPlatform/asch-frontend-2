<template>
<q-card class="col-4">
  <q-card-main>
    <q-item>
      <q-item-side v-if="asset.url" :avatar="asset.url" />
      <q-item-main>
        <q-item-tile label>{{asset.currency}}</q-item-tile>
      </q-item-main>
      <q-item-side right>
        {{asset.balance | fee(asset.precision)}}
      </q-item-side>
    </q-item>
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
import { QCard, QCardMain, QList, QItem, QItemSide, QItemTile, QCardActions, QBtn } from 'quasar'

export default {
  name: 'AssetPanel',
  props: ['asset', 'type'],
  components: { QCard, QCardMain, QList, QItem, QItemSide, QItemTile, QCardActions, QBtn },
  data() {
    return {}
  },
  methods: {
    transfer(asset) {
      this.$emit('transfer', asset)
    },
    deposit(asset) {
      this.$emit('deposit', asset)
    },
    withdraw(asset) {
      this.$emit('withdraw', asset)
    }
  },
  computed: {}
}
</script>
<style lang="stylus" scoped>
</style>