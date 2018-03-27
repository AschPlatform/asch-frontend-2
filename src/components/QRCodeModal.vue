<template>
  <q-dialog
    v-model="show"
    stack-buttons
    prevent-close
    @ok="onOk"
    @cancel="onCancel"
  >
    <span v-if="title" slot="title">{{title}}</span>

    <span v-if="message" slot="message">{{message}}</span>

    <div slot="body">
      <vue-qr :text="text" />
    </div>

    <template slot="buttons" slot-scope="props">
      <q-btn color="negative" label="Choose Spiderman" @click="choose(props.ok, 'Spiderman')" />
      <q-btn flat label="No thanks" @click="props.cancel" />
    </template>
  </q-dialog>
</template>

<script>
import VueQr from 'vue-qr'

export default {
  props: ['show', 'text', 'title', 'message'],
  components: {
    VueQr
  },
  data() {
    return {
      // model for Dialog example
      customDialogModel: false,
      name: ''
    }
  },
  methods: {
    // when props.ok() gets called
    onOk(data) {},

    // when props.cancel() gets called
    onCancel() {}
  }
}
</script>