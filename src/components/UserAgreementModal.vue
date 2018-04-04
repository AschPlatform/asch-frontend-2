<template>
  <q-modal content-classes="layout-padding" v-model="show" maximized>
    <q-card class="col-12" >
      <q-card-title>
        {{title}}
      </q-card-title>
      <q-card-separator />
      <q-card-main class="q-px-lg">
        <q-scroll-area style="height: 400px" class="shadow-1 q-px-sm q-py-lg">
            <div>{{content}}</div>
        </q-scroll-area>
        <q-checkbox class="q-mt-sm" v-model="checked" :label="$t('I_AGREE')" />
        <div class="text-center">
         {{tips}}
        </div>
      </q-card-main>
      <q-card-main>
        <div class="justify-around row">
          <q-btn size="md" :label="$t('label.cancel')" @click="cancel"/>
          <q-btn color="primary" :disable="!checked" :label="$t('label.ok')" @click="confirm"/>
        </div>
      </q-card-main>
    </q-card>
  </q-modal>
</template>

<script>
import {
  QModal,
  QCard,
  QCardTitle,
  QCardMain,
  QCardSeparator,
  QScrollArea,
  QBtn,
  QCheckbox
} from 'quasar'

export default {
  data() {
    return {
      checked: false
    }
  },
  props: ['show', 'title', 'content', 'tips'],
  components: {
    QModal,
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QScrollArea,
    QBtn,
    QCheckbox
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
