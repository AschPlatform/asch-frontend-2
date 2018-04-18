<template>
  <q-card inline class="gateway-item-container col-3">
    <q-card-title align="left">
      <i class="material-icons vertical-align-sub font-24 text-secondary">opacity</i>
      <span class="text-black font-24">
        {{item.name}}{{$t('GATEWAY')}}
        </span>
    </q-card-title>
    <q-card-main inline class="row justify-between">
      <!-- {{$t('COUNCIL_PAGE.MODAL_TITLE', {number: item.members.length})}} -->
      <!-- <br> -->
      <div>
        <div class="text-left">
          <i class="material-icons font-24 vertical-align-middle text-secondary">fiber_manual_record</i>
          <!-- <span class="font-18 text-five">{{item.desc}}</span> -->
          <span class="font-18 text-five">成员：7人</span>
        </div>
        <div class="text-left">
          <i class="material-icons font-24 vertical-align-middle text-secondary">fiber_manual_record</i>
          <span class="font-18 text-five"> {{$t('CREATE_TIME')}} : TODO</span>
        </div>
      </div>
      <q-btn small icon="arrow forward" inverted color="secondary" @click="$emit('open',item)">
      </q-btn>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCardMain, QPage, QCard, QCardTitle, QBtn, QCardActions } from 'quasar'

export default {
  name: 'GatewayItem',
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
  methods: {}
}
</script>

<style lang="stylus" scoped>
.gateway-item-container {
  padding-bottom: 10px;
  min-width: 300px;
}
</style>

