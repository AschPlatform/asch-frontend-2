<template>
  <q-page class="postContract-container">
    <div class="postContract-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
          <i class="material-icons vertical-align-sub font-20 text-black">border_color</i>
          <h5 class="q-px-md inline-block font-18 q-my-none">{{$t('SMART_CONTRACT_POST')}}</h5>
        </span>
      </div>
      <span class="transfer-title-line"></span>
      <div class="col-12 inner-container">
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" :label="$t('SMART_CONTRACT_NAME')">
            <q-input class="border-1" readonly hide-underline v-model="content.name" value="" />
          </q-field>
        </div>
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" :label="$t('SMART_CONTRACT_CODE')">
            <q-input class="border-1 textareaInner" type="textarea" readonly hide-underline v-model="content.desc" value=""></q-input>
          </q-field>
        </div>
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" label="GAS_LIMIT">
            <q-input class="border-1" readonly hide-underline v-model="content.gas" value="" />
          </q-field>
        </div>
        <q-btn big class="col-6 q-mt-md" :disable="btnDisable" color="secondary" :label="$t('SMART_CONTRACT_COMMIT')" />
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  QPage,
  QField,
  QInput,
  QBtn
} from 'quasar'

export default {
  name: 'PostContract',
  components: {
    QPage,
    QField,
    QInput,
    QBtn
  },
  data() {
    return {
      content: {
        name: 'CCTIEMFIXED',
        desc: 'function(aca) { do while ( true) }',
        gas: 0.1
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.postContract-container
  padding: 20px;
  .postContract-content
    background: #ffffff !important;
    padding-bottom: 20px;
    border-radius: 6px;
.transfer-title-line {
  display: block;
  width: calc(100% - 40px);
  height: 1px;
  background: #dddddd;
  margin-left: 10px;
}
.border-1
  border 1px solid #999
  padding-left 10px
  min-height 50px
.textareaInner
  padding-top 15px
.inner-container
  padding 16px
</style>
