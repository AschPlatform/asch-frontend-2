<template>
  <q-modal class="deposit-modal-container" content-classes="row justify-center" v-model="isModalShow" @hide="close" :no-esc-dismiss="false" minimized>
    <span class="text-center bg-secondary text-white col-12 trader-header">{{action}}</span>
    <div class="trader-body">
      <div class="trader-upper">
        <q-field :label="$t('AMOUNTS') + ' :'" label-width='2' class="font-16">
          <div class="input-box row">
            <input type="number" v-model="amount" class="col-9 text-secondary"/>
            <div class="col-3">{{sell}}</div>
          </div>
        </q-field>
      </div>
      <div class="trader-bottom">
        <table>
          <tr>
            <th>{{$t('FEES')}} :</th>
            <td>0.01%</td>
          </tr>
          <tr>
            <th>{{$t('MY_BALANCE')}} :</th>
            <td>{{balance}} {{sell}}</td>
          </tr>
          <tr>
            <th>{{$t('CURRENT_PRICE')}} :</th>
            <td>{{price}}</td>
          </tr>
        </table>
        <q-btn color="secondary" class="full-width modal-btn" @click="switchAction">{{action}} （{{sell}} => {{buy}}）</q-btn>
      </div>
    </div>
  </q-modal>
</template>

<script>
/* eslint-disable */
import {
  QModal,
  QField,
  QInput,
  QBtn
} from 'quasar'

export default {
  name: 'BancorTradeModal',
  components: {
    QModal,
    QField,
    QInput,
    QBtn
  },
  props: ['type', 'buy', 'sell', 'balance', 'price', 'show'],
  data () {
    return {
      amount: 0
      // show: true
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    callBuy(amount) {
      this.$emit('buy', amount)
    },
    callSell(amount) {
      this.$emit('sell', amount)
    },
    switchAction() {
      if (this.type === 0) {
        this.callBuy(this.amount)
      } else {
        this.callSell(this.amount)
      }
    }
  },
  computed: {
    action() {
      if (this.type === 0) {
        return this.$t('BANCOR_BUTTON_BUY')
      }
      return this.$t('BANCOR_BUTTON_SELL')
    },
    isModalShow: {
      get: function() {
        return this.show
      },
      set: function(val) {
        return null
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.trader-header
  height 65px;
  min-width 560px;
  line-height 65px;
  border-radius 2px 2px 0px 0px
  font-size 22px;
.trader-body
  font-size 16px;
  background-color white;
  padding: 45px 30px;
  width 100%;
.trader-upper
  padding 15px 0px 30px 0;
  border-bottom 1px dashed #DDDDDD;
  line-height 40px;
  .input-box
    border 1px solid #dddddd;
    height 40px;
    line-height 40px;
    input
      border none;
      outline none;
      padding-left 10px;
      font-size 18px;
    div
      font-size 18px;
      font-weight bold;
      border-left 1px solid #dddddd;
      background-color #f9f9f9;
      line-height inherit;
      text-align center;
.trader-bottom
  padding 12px 0px 5px 0px;
  table
    text-align left;
    font-size 16px;
    line-height 36px;
  .modal-btn
    margin-top 45px;
    height 40px;
    font-size 18px;
</style>
