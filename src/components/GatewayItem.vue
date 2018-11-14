<template>
  <q-card inline class="gateway-item-container col-4 no-shadow">
    <div class="shadow-1 bg-white">
      <q-card-title align="left">
        <i class="material-icons vertical-align-sub font-24 text-secondary">opacity</i>
        <span class="text-five font-24 font-bold">
          {{item.name}}{{$t('GATEWAY')}}
        </span>
      </q-card-title>
      <q-card-main inline class="row justify-between">
        <div class="col-10">
          <div class="text-left">
            <i class="material-icons font-24 vertical-align-middle text-orange">fiber_manual_record</i>
            <span class="font-18 text-five vertical-align-middle">{{$t('GATEWAY_STATUS')}} : </span>
            <span class="font-18 vertical-align-middle" :class="getGatewayState(item)==2 ? 'text-secondary':'text-red'">{{getGatewayState(item)==2?'online':'offline'}}</span>
          </div>
          <div class="text-left margin-top-20">
            <i class="material-icons font-24 vertical-align-middle text-secondary">fiber_manual_record</i>
            <span class="font-18 text-five vertical-align-middle">{{$t('GATEWAY_MEMBER')}} : {{item.validatorNumber}}</span>
          </div>
          <div class="text-left margin-top-20">
            <i class="material-icons font-24 vertical-align-middle text-blue">fiber_manual_record</i>
            <span class="font-18 text-five vertical-align-middle">{{$t('CREATE_TIME')}} : {{fullTimestamp(item.createTime)}}</span>
          </div>
        </div>
        <q-btn small icon="arrow forward" class="no-shadow col-2" inverted color="white" @click="$emit('open',item)">
          <i class="material-icons font-36 text-eight">arrow_forward</i>
        </q-btn>
      </q-card-main>
    </div>
  
  </q-card>
</template>

<script>
import { QCardMain, QPage, QCard, QCardTitle, QBtn, QCardActions } from 'quasar'
import { fullTimestamp } from '../utils/asch'
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
  methods: {
    fullTimestamp(val) {
      if (val) return fullTimestamp(val).split(' ')[0]
    },
    getGatewayState(gateway) {
      /**
       * -1 no gateway data
       * 0 not activated
       * 1 activated
       * 2 online
       * 3 offline
       * 4 freeze
       */
      if (gateway) {
        let { activated, revoked } = gateway
        if (activated === 0) {
          return 0
        }
        if (activated === 1) {
          if (revoked > 0) {
            return revoked + 2
          } else {
            return 2
          }
        }
      }
      return -1
    }
  }
}
</script>

<style lang="stylus" scoped>
.gateway-item-container {
  padding-bottom: 10px;
  min-width: 300px;
}
</style>

