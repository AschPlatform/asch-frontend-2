<template>
  <q-card class="q-px-sm">
    <q-card-title>
    {{!isGonnaSet ? this.$t('VOTE_DELEGATE') : this.$t('VOTE_SET')}}
    </q-card-title>
    <q-card-separator />
    <q-card-main align="center" v-if="!isGonnaSet">
      <q-input clearable :float-label="$t('VOTE_DELEGATE_TIP')"></q-input>
      <q-btn color="primary" @click="action">{{$t(btnInfo)}}</q-btn>
    </q-card-main>
    <q-card-main align="center" v-else>
      <span>{{isSetDelegate ? delegateName : ''}}</span>
      <q-btn color="primary" @click="action">{{$t(btnInfo)}}</q-btn>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QCardSeparator, QBtn, QInput } from 'quasar'

export default {
  data() {
    return {
      isGonnaSet: false
    }
  },
  props: ['isSetDelegate', 'delegateName'],
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QBtn,
    QInput
  },
  methods: {
    action() {
      this.isSetDelegate ? this.cancelDelegate() : this.setDelegate()
      this.isGonnaSet = !this.isGonnaSet
    },
    cancelDelegate() {
      // TODO CANCEL DELEGATE
    },
    // TODO SET DELEGATE
    setDelegate() {}
  },
  computed: {
    // TODO set card state
    btnInfo() {
      if (this.isSetDelegate) {
        return 'VOTE_CANCEL'
      } else {
        return 'VOTE_SET'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
