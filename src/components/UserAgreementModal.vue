<template>
  <q-modal class="user-agreement-container" v-model="show" minimized>
    <q-card class="col-12 no-shadow" >
      <div class="bg-secondary height-62 padding-l-20">
      <span class="text-white font-24 font-weight">{{$t('REGISTER_AGENT')}}</span>
      </div>
      <q-card-separator />
      <q-card-main class="q-px-lg margin-t-20">
        <q-scroll-area style="height: 400px" class="shadow-1 q-px-sm q-py-lg">
            <!-- <div>{{content}}</div> -->
            <div>{{$t('USER_AGREEMENT_MODAL_CONTENT')}}</div>
        </q-scroll-area>
        <div class="row justify-between user-agree-content">
        <q-checkbox v-model="checked" :label="$t('I_AGREE')" />
        <span class="text-right text-secondary">
         {{$t('USER_AGREEMENT_MODAL_TIPS')}}
        </span>
        </div>
      </q-card-main>
      <q-card-main>
        <div class="justify-between row padding-40">
          <q-btn class="col-3" big outline color="secondary" size="md" :label="$t('label.cancel')" @click="cancel"/>
          <q-btn big class="bg-secondary text-white col-3" :disable="!checked" :label="$t('label.ok')" @click="confirm"/>
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
.user-agreement-container {
}

.agreement-btn-2 {
  margin-left: 20px;
}

.user-agree-content {
  height: 30px;
  line-height: 30px;
}
</style>
