<template>
  <div class="prompt-message-container">
    <div class="prompt-message relative-position text-five shadow-1 custom-prompt-message">
        <vue-markdown :source="message"></vue-markdown>
      <div class="arrow-border" />
      <div class="arrow" />
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'PromptMessage',
  props: ['message'],
  components: { VueMarkdown },
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
  width: 400px;
  // height: 300px;
  right: -400px;
  bottom: -150px;
  border: 1px solid #ddd;
  background: #ffffff;
  z-index: 9999;

  .prompt-message {
    height: 100%;
    padding: 30px 20px;

    p {
      font-size: 16px;
      color: #999999;
    }

    .arrow {
      width: 0px;
      height: 0px;
      border-top: 10px solid transparent;
      border-right: 10px solid;
      border-bottom: 10px solid transparent;
      position: absolute;
      margin-left: -30px;
      margin-top: -140px;
      border-right-color: white;
    }

    .arrow-border {
      width: 0px;
      height: 0px;
      border-top: 10px solid transparent;
      border-right: 10px solid;
      border-bottom: 10px solid transparent;
      position: absolute;
      margin-left: -30px;
      margin-top: -140px;
      border-right-color: black;
    }
  }
}
</style>