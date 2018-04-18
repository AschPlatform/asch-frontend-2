<template>
  <q-card inline class="col-4">
    <q-card-title align="center">
      {{item.name}}
        <span slot="subtitle">{{$t('GATEWAY_MEMBER')}}:{{item.validatorNumber}}</span>
    </q-card-title>
    <q-card-main inline >
      <!-- {{$t('COUNCIL_PAGE.MODAL_TITLE', {number: item.members.length})}} -->
      <br>
      <div class="text-center">
        {{item.desc}}
      </div>
      <div class="text-center">
        {{$t('CREATE_TIME')}} : {{item.createTime | time}}
      </div>
    </q-card-main>
    <q-card-actions align="center">
      <q-btn inverted color="primary" @click="$emit('open',item)">
        {{$t('CHECK')}}
      </q-btn>
    </q-card-actions>
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
.cardSet {
}
</style>

