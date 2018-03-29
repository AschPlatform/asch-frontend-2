<template>
  <q-dialog
    v-model="show"
    prevent-close
  >
    <span v-if="title" slot="title">{{title}}</span>

    <span v-if="message" slot="message">{{message}}</span>

    <div slot="body">
      <div class="row justify-center"> 
        <vue-qr :text="text || ''" />
      </div>
    </div>

    <template slot="buttons" slot-scope="props">
            <q-btn flat :label="$t('label.close')" @click="close" />
    </template>
  </q-dialog>
</template>

<script>
import VueQr from 'vue-qr'
import { QDialog } from 'quasar'

export default {
  props: ['show', 'text', 'title', 'message'],
  components: {
    VueQr,
    QDialog
  },
  data() {
    return {}
  },
  methods: {
    close(data) {
      this.$emit('close')
    },
    onCancel() {}
  }
}
</script>