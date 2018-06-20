<template>
  <q-modal :class="userAgreementClass" content-class="modal-content-limit" v-model="show">
    <q-card class="col-12 no-shadow" >
      <div class="bg-secondary height-62 padding-l-20">
      <span class="text-white font-24 font-weight">{{title}}</span>
      </div>
      <q-card-separator />
      <q-card-main class="q-px-lg margin-t-20">
        <q-scroll-area style="height: 300px" class="shadow-1 q-px-sm q-py-lg">
            <!-- <div v-html="content"></div> -->
          <vue-markdown :source="content"></vue-markdown>
        </q-scroll-area>
        <div class="row justify-between user-agree-content">
        <q-checkbox v-model="checked" :label="$t('I_AGREE')" />
        <span class="text-right text-secondary">
         {{tips}}
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
import VueMarkdown from 'vue-markdown'
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
    VueMarkdown,
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
  },
  computed: {
    userAgreementClass() {
      return this.isDesk
        ? 'minimized user-agreement-desktop-container'
        : 'maximized user-agreement-mobile-container'
    }
  }
}
</script>

<style lang="stylus" scoped>
.agreement-btn-2 {
  margin-left: 20px;
}

.user-agree-content {
  height: 30px;
  line-height: 30px;
}
</style>
