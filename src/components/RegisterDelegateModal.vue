<template>
  <q-modal content-classes="row justify-center layout-padding" v-model="show" maximized>
    <q-card inline class="col-8" style="height:600px;">
      <q-card-title>
        {{$t('DELEGATE_TITLE')}}
      </q-card-title>
      <q-card-separator />
      <q-card-main class="q-px-lg">
        <q-scroll-area style="height: 400px" class="shadow-1 q-px-sm q-py-lg">
            <div>
                2. Lorem ipsum dolor sit amet, 
                consectetur adipisicing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div>
                2. Lorem ipsum dolor sit amet, 
                consectetur adipisicing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div>
                2. Lorem ipsum dolor sit amet, 
                consectetur adipisicing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div>
                2. Lorem ipsum dolor sit amet, 
                consectetur adipisicing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div>
                2. Lorem ipsum dolor sit amet, 
                consectetur adipisicing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div>
                2. Lorem ipsum dolor sit amet, 
                consectetur adipisicing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation 
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
        </q-scroll-area>
        <q-checkbox class="q-mt-sm" v-model="checked" :label="$t('I_AGREE')" />
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
import { QModal, QCard, QCardTitle, QCardMain, QCardSeparator, QScrollArea, QBtn, QCheckbox } from 'quasar'

export default {
  data() {
    return {
      checked: false
    }
  },
  props: ['show'],
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
