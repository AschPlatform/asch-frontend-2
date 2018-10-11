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
            <q-input class="" readonly hide-underline v-model="contract.name" />
          </q-field>
        </div>
        <div class="col-5">
          <q-field class="block col-6 font-16" label-width="3" :label="$t('SMART_CONTRACT_OWNER')">
            <q-input class="" readonly hide-underline v-model="contract.owner"  />
          </q-field>
        </div>
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" :label="$t('SMART_CONTRACT_CODE')">
            <codemirror :value.sync="getCode" :options="getCodeOption" />
          </q-field>
        </div>
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" label="DESC">
            <q-input class="" readonly hide-underline v-model="contract.desc"  />
          </q-field>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { QPage, QField, QInput, QBtn } from 'quasar'
import { codemirror } from 'vue-codemirror-lite'
import { mapActions } from 'vuex'
import { toastError } from '../utils/util'
export default {
  name: 'contractDetail',
  components: {
    QPage,
    QField,
    QInput,
    QBtn,
    codemirror
  },
  data() {
    return {
      contract: null
    }
  },
  async mounted() {
    let { name } = this.$route.params
    if (name) {
      let res = await this.getContractDetail({ name })
      if (res.success) {
        this.contract = res.contract
      } else {
        toastError(this.$t('ERR_CONTRACT_NOT_EXIST'))
      }
    } else {
      this.$router.push('/contracts')
    }
  },
  methods: {
    ...mapActions(['getContractDetail'])
  },
  computed: {
    getCode() {
      return this.contract.code
    },
    getCodeOption() {
      return {
        mode: 'javascript',
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: Infinity,
        readOnly: true,
        height: 'auto'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.postContract-container {
  padding: 20px;

  .postContract-content {
    background: #ffffff !important;
    padding-bottom: 20px;
    border-radius: 6px;
  }
}

.transfer-title-line {
  display: block;
  width: calc(100% - 40px);
  height: 1px;
  background: #dddddd;
  margin-left: 10px;
}

.border-1 {
  border: 1px solid #999;
  padding-left: 10px;
  min-height: 50px;
}

.textareaInner {
  padding-top: 15px;
}

.inner-container {
  padding: 16px;
}

</style>
