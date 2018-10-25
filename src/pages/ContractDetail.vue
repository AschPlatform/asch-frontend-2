<template>
  <q-page class="postContract-container">
    <div class="postContract-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
          <i class="material-icons vertical-align-sub font-20 text-black">border_color</i>
          <h5 class="q-px-md inline-block font-22 q-my-none">{{$t('SMART_CONTRACT_DETAIL')}}</h5>
        </span>
      </div>
      <div class="" :class="isDesk?'title-line':'padding-10'">
        <boundary-line />
      </div>
      <div v-if="contract" class="row inner-container">
        <div class="row col-12" :class="isDesk?'padding-l-15':''">
          <div class="margin-right-60" :class="isDesk?'':'margin-bottom-10'">
            <span class="font-16 text-tertiary font-bold padding-right-20">{{$t('SMART_CONTRACT_NAME')}} : </span>
            <span class="font-16 text-five">{{contract.name}}</span>
          </div>
          <div class="row justify-between" >
            <span class="font-16 text-tertiary font-bold" :class="isDesk?'padding-right-20':'col-4'">{{$t('SMART_CONTRACT_OWNER')}} : </span>
            <span class="row items-center text-secondary cursor-pointer" :class="isDesk?'font-16':'font-14 col-8 break-word'"  @click="viewAccountInfo(contract.owner)">{{contract.owner}}</span>
          </div>
        </div>
        <div class="row col-12 " :class="isDesk?'padding-l-15 margin-top-30':'margin-top-10'">
          <div class="row justify-start" style="width:100%">
            <span class="font-16 text-tertiary font-bold padding-right-20">{{$t('SMART_CONTRACT_CODE')}} : </span>
            <div class="code-container col-md-10 col-xs-12" :class="isDesk?'':'margin-top-10'">
              <codemirror class="" :value.sync="getCode" :options="getCodeOption" />
            </div>
          </div>
        </div>
        <div class="row col-12" :class="isDesk?'padding-l-15 margin-top-30':'margin-top-10'">
          <div class="row justify-start">
            <span class="font-16 text-tertiary font-bold padding-right-20">{{$t('SMART_CONTRACT_DESC')}} : </span>
            <span class="font-16 text-five break-word">{{contract.desc}}</span>
          </div>
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
import BoundaryLine from '../components/BoundaryLine'

export default {
  name: 'contractDetail',
  components: {
    QPage,
    QField,
    QInput,
    QBtn,
    codemirror,
    BoundaryLine
  },
  data() {
    return {
      contract: null
    }
  },
  async mounted() {
    let { name } = this.$route.params
    if (name) {
      let res = await this.getContractDetail({
        name
      })
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
    ...mapActions(['getContractDetail']),
    viewAccountInfo(address) {
      this.$root.$emit('openAccountModal', address)
    }
  },
  computed: {
    getCode() {
      let code = this.contract.code
      return Buffer.from(code, 'hex').toString('utf-8')
      // return Buffer.from(code, 'hex').toString('utf8')
    },
    getCodeOption() {
      return {
        mode: 'javascript',
        extraKeys: {
          'Ctrl-Space': 'autocomplete'
        },
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

    .title-line {
      padding: 12px 16px 31px;
    }

    .code-container {
      border: 1px solid #dddddd;
      // width: 100%;
    }
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

.margin-right-60 {
  margin-right: 60px;
}

.break-word {
  display: block;
  word-break: break-word!important;
  word-break: normal;
}
</style>
