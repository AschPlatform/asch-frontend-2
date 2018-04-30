<template>
  <q-card v-if="item !== {}" inline class="col-3">
    <q-card-title align="center">
      {{item.name}}
    </q-card-title>
    <q-card-main inline align="center" class="layout-padding shadow-1 cardSet">
      {{$t('COUNCIL_PAGE.MODAL_TITLE', {number: item.members.length})}}
      <br>
      {{$t('STARTTIME')}}
    </q-card-main>
    <q-card-actions align="center">
      <q-btn inverted color="secondary" @click="calCouncilDetail">
        {{$t('CHECK')}}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { QCardMain, QPage, QCard, QCardTitle, QBtn, QCardActions } from 'quasar'

export default {
  name: 'CouncilSnippet',
  data() {
    return {
      isModalShow: false
    }
  },
  props: ['item'],
  components: {
    QCardMain,
    QPage,
    QCard,
    QCardTitle,
    QBtn,
    QCardActions
  },
  methods: {
    calCouncilDetail() {
      this.$emit('callModal', {
        status: true,
        item: this.item
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .cardSet{
  }
</style>

