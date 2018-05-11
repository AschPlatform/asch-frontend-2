<template>
  <q-card class="transfer-container no-shadow q-p-lg">
    <div :class="transferContentCSS">
      <q-card-title>
        <span class="text-tertiary font-22">
            <i class="material-icons">border_color</i>
            </span>
        <span class="text-tertiary font-22">
            {{$t('TRS_TYPE_TRANSFER')}}
            </span>
        <span class="text-secondary font-12">
         {{$t('PAY_TIP')}}
           </span>
      </q-card-title>
      <span class="transfer-title-line"></span>
      <q-card-main class="row justify-left">
        <div class="row col-md-10 col-xs-12">
          <trans-panel class="col-12" :asset="asset" :user="user">
            <div :class="transferBtnCSS" slot="btns" slot-scope="props">
              <q-btn big class="col-6" :disable="btnDisable" color="secondary" @click="sender(props.send)" :label="$t('TRS_TYPE_TRANSFER')" />
            </div>
          </trans-panel>
        </div>
      </q-card-main>
    </div>
  
  </q-card>
</template>

<script>
import TransPanel from '../components/TransPanel'
import { mapGetters, mapActions } from 'vuex'
import { QCardMain, QCard, QCardTitle, QSelect, QBtn } from 'quasar'

export default {
  props: ['userObj'],
  components: { QCardMain, QCard, QCardTitle, QSelect, QBtn, TransPanel },
  data() {
    return {
      btnDisable: false
    }
  },
  methods: {
    ...mapActions(['getBalance']),
    async sender(send) {
      let flag = await send()
      if (flag) {
        this.transShow = false
      } else {
        this.disableBtn('btnDisable')
      }
    },
    disableBtn(model) {
      this[model] = true
      this._.delay(() => {
        this[model] = false
      }, 3000)
    }
  },
  async mounted() {},
  computed: {
    ...mapGetters(['userInfo', 'balances']),
    transferContentCSS(){
      return this.$q.platform.is.desktop ? "shadow-2 transfer-content padding-20" : "transfer-content shadow-2"
    },
    transferBtnCSS(){
      return this.$q.platform.is.desktop ? "row justify-left col-12" : "row justify-center col-12"
    },
    user() {
      return this.userInfo
    },
    asset() {
      if (this.user) {
        return {
          currency: 'XAS',
          precision: 8,
          balance: this.user.account.xas
        }
      } else {
        return null
      }
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
.transfer-container {
  padding: 20px;
}

.transfer-content {
  border-radius: 6px;
  background: #ffffff;
}

.transfer-description {
  display: inline-block;
}

.transfer-title-line {
  display: block;
  width: calc(100% - 40px);
  height: 1px;
  background: #dddddd;
  margin-left: 10px;
}
</style>
