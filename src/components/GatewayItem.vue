<template>
  <q-card inline class="col-3">
    <q-card-title align="center">
      {{item.name}}
    </q-card-title>
    <q-card-main inline >
      <!-- {{$t('COUNCIL_PAGE.MODAL_TITLE', {number: item.members.length})}} -->
      <br>
      <div class="text-center">
        {{item.desc}}
      </div>
      <div>
        {{$t('CREATE_TIME')}} : TODO
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
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
  .cardSet{
  }
</style>

