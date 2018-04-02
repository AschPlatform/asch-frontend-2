<template>
  <q-modal v-model="show" maximized>
      <q-card class="layout-padding q-mx-xl q-my-xl">
        <q-field label="发起新提案">
        <q-input suffix="@gmail.com" v-model="model" />
        </q-field>
      </q-card>
  </q-modal>
</template>

<script>
import {
  QField,
  QModal,
  QInput,
  QCard
} from 'quasar'

export default {
  name: 'LaunchProposalModal',
  props: ['show'],
  data: () => {
  },
  components: {
    QField,
    QModal,
    QInput,
    QCard
  }
}
</script>

<style lang="stylus" scoped>

</style>
