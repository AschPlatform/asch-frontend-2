<template>
  <q-page class="postContract-container">
    <div class="postContract-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
          <i class="material-icons vertical-align-sub font-20 text-black">border_color</i>
          <h5 class="q-px-md inline-block font-18 q-my-none">{{$t('SMART_CONTRACT_DETAIL')}}</h5>
        </span>
      </div>
      <span class="transfer-title-line"></span>
      <div class="row inner-container">
        <div class="col-5">
          <q-field class="block col-6 font-16" label-width="3" :label="$t('SMART_CONTRACT_NAME')">
            <q-input class="" readonly hide-underline v-model="content.name" value="" />
          </q-field>
        </div>
        <div class="col-5">
          <q-field class="block col-6 font-16" label-width="3" :label="$t('SMART_CONTRACT_OWNER')">
            <q-input class="" readonly hide-underline v-model="content.name" value="" />
          </q-field>
        </div>
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" :label="$t('SMART_CONTRACT_CODE')">
            <!-- <q-input class="textareaInner" type="textarea" readonly hide-underline v-model="content.desc" value=""></q-input> -->
            <!-- <pre v-highlightjs="content.desc"><code class="javascript"></code></pre> -->
            <pre v-highlightjs><code class="javascript">const s = new Date().toString()</code></pre>
          </q-field>
        </div>
        <!-- <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" label="GAS_LIMIT">
            <q-input class="" readonly hide-underline v-model="content.gas" value="" />
          </q-field>
        </div> -->
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
  name: 'contractDetail',
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
        desc: 'function(aca) { do {} while ( true) }',
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
