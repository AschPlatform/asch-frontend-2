<template>
    <q-card inline class="col-3">
      <q-card-title align="center">
        ETH转账处理组
      </q-card-title>
      <q-card-main inline align="center" class="shadow-1 cardSet">
        （正式成员：7 人）
        <br>
        成立时间：2018/03/31
      </q-card-main>
      <q-card-actions align="center">
        <q-btn inverted color="primary" @click="calCouncilDetail">
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
    }
  }
}
</script>

<style lang="stylus" scoped>
  .cardSet{
  }
</style>

