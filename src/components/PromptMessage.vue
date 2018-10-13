<template>
  <div class="prompt-message-container">
    <div class="prompt-message relative-position text-five shadow-1 custom-prompt-message">
      <q-scroll-area style="height: 100%" class="">
        <vue-markdown :source="message"></vue-markdown>
      </q-scroll-area>
      <div class="arrow-border" />
      <div class="arrow" />
    </div>
  </div>
</template>

<script>
import { QScrollArea } from 'quasar'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'PromptMessage',
  props: ['message'],
  components: { QScrollArea, VueMarkdown },
  mounted() {},
  data() {
    return {
      data: {}
    }
  },
  methods: {},
  computed: {}
}
</script>

<style lang="stylus" scoped>


.prompt-message-container {
  position: absolute;
  width: 300px;
  height: 300px;
  right: -295px;
  bottom: -15px;
  border: 1px solid #ddd;
  background: #ffffff;
  z-index: 99;

  .prompt-message {
    height: 100%;
    padding: 30px 20px;

    p {
      font-size: 16px;
      color: #ffffff;
    }

    .arrow {
      width: 0px;
      height: 0px;
      border-top: 10px solid transparent;
      border-right: 10px solid;
      border-bottom: 10px solid transparent;
      position: absolute;
      margin-left: -29px;
      margin-top: -5px;
      border-right-color: white;
    }

    .arrow-border {
      width: 0px;
      height: 0px;
      border-top: 10px solid transparent;
      border-right: 10px solid;
      border-bottom: 10px solid transparent;
      position: absolute;
      margin-left: -29px;
      margin-top: -5px;
      border-right-color: black;
    }
  }
}
</style>