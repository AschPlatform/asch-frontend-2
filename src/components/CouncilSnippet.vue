<template>
  <q-card inline class="council-item-container col-4 no-shadow">
    <div class="shadow-1 bg-white">
      <q-card-title align="left">
        <i class="material-icons vertical-align-sub font-24 text-secondary">opacity</i>
        <span class="text-black font-24">
          {{item.name}}
        </span>
      </q-card-title>
      <q-card-main inline class="row justify-between">
        <div>
          <div class="text-left">
            <i class="material-icons font-24 vertical-align-middle text-secondary">fiber_manual_record</i>
            <span class="font-16 text-five vertical-align-middle">{{$t('COUNCIL_PAGE.MODAL_TITLE')}}:{{item.members.length}}</span>
          </div>
          <div class="text-left">
            <i class="material-icons font-24 vertical-align-middle text-secondary">fiber_manual_record</i>
            <span class="font-16 text-five vertical-align-middle"> {{$t('STARTTIME')}} {{fullTimestamp(item.createTime)}}</span>
          </div>
        </div>
        <q-btn small icon="arrow forward" inverted color="secondary" @click="$emit('callModal',item)">
        </q-btn>
      </q-card-main>
    </div>
  </q-card>
</template>

<script>
import { QCardMain, QPage, QCard, QCardTitle, QBtn, QCardActions } from 'quasar'
import { fullTimestamp } from '../utils/asch'

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
    },
    fullTimestamp(val) {
      if (val) return fullTimestamp(val).split(' ')[0]
    }
  }
}
</script>

<style lang="stylus" scoped>
.council-item-container {
  padding-bottom: 10px;
  min-width: 300px;
}
</style>

