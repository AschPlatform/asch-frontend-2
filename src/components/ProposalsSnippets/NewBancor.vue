<template>
  <div class="col-12">
    <div class="row gutter-md">
      <q-field align="left" class="col-md-4 col-xs-12 font-16 text-four" label-width="4" :error-label="$t('MONEY_STOCK_NOT_SAME')" :label="$t('LAUNCH_MODAL.BANCOR_ADD')">
      <q-select align="center" chips filter v-model="BANCOR.pair_pre" @blur="$v.BANCOR.pair_pre.$touch()" :error="$v.BANCOR.pair_pre.$error" :options="supportBalances"></q-select>
      </q-field>
      <q-field class="col-md-4 col-xs-12 font-16 text-four" label-width="2" :error-label="$t('MONEY_STOCK_NOT_SAME')" :label="$t('LAUNCH_MODAL.AND')">
      <q-select align="center" color="secondary" chips filter v-model="BANCOR.pair_post" @blur="$v.BANCOR.pair_post.$touch()" :error="$v.BANCOR.pair_post.$error" :options="supportBalances"></q-select>
      </q-field>
      <q-field class="col-md-3 col-xs-12 font-16 text-four" label-width="3" :label="$t('LAUNCH_MODAL.BANCOR_ADD2')">
      </q-field>
    </div>
    <div class="row gutter-lg">
      <q-field class="col-md-5 col-xs-12 font-16 text-four" label-width="3" :error-label="moneyReason" :label="'money'">
      <q-select color="secondary" v-model="BANCOR.money" @change="checkMoney(val, index)" @blur="$v.BANCOR.money.$touch()" :error="$v.BANCOR.money.$error" :options="moneySelect"></q-select>
      </q-field>
      <q-field class="col-md-6 col-xs-12 font-16 text-four" label-width="3" :error-label="$t('ERR_POSITIONLOCK_EMPTY')" :label="'moneyBalance'">
      <q-input color="secondary" @blur="$v.BANCOR.moneyBalance.$touch()" :error="$v.BANCOR.moneyBalance.$error" v-model="BANCOR.moneyBalance"></q-input>
      </q-field>
    </div>
    <div class="row gutter-md">
      <q-field class="col-md-5 col-xs-12 font-16 text-four" label-width="3" :label="'stock'">
      <q-input disable color="secondary" value="" :placeholder="stockSelect.assetName"></q-input>
      </q-field>
      <q-field class="col-md-6 col-xs-12 font-16 text-four" label-width="3" :error-label="$t('ERR_POSITIONLOCK_EMPTY')" :label="'stockBalance'">
      <q-input color="secondary" type="number" @blur="$v.BANCOR.stockBalance.$touch()" :error="$v.BANCOR.stockBalance.$error" v-model="BANCOR.stockBalance"></q-input>
      </q-field>
    </div>
    <div class="row">
      <q-field class="col-md-3 col-xs-12 font-16 text-four" label-width="5" :error-label="$t('ERR_POSITIONLOCK_EMPTY')" :label="'supply'">
      <q-input v-model="BANCOR.supply" type="number" min="0" @blur="$v.BANCOR.supply.$touch()" :error="$v.BANCOR.supply.$error"></q-input>
      </q-field>
    </div>
    <div class="row">
      <q-field class="col-9 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
      <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
      </q-field>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import {
  QField,
  QInput,
  QSelect
} from 'quasar'

export default {
  name: 'snippet-newBancor',
  props: ['reset', 'supportBalances', 'userInfo', 'balanceSheet'],
  components: {
    QField,
    QInput,
    QSelect
  },
  data() {
    return {
      BANCOR: {
        // form lists
        allCurrency: [],
        activedList: [],
        pair_pre: '',
        pair_post: '',
        // hidden stuff
        supportBalances: [],
        moneyAble: ['XAS', 'BCH'],
        // content
        money: '',
        stock: '',
        moneyBalance: '',
        stockBalance: '',
        supply: '',
        stockCw: null,
        moneyCw: null,
        moneyPrecision: null,
        stockPrecision: null,
        name: '',
        owner: ''
      },
      brief: '',
      pack: {}
    }
  },
  validations: {
    BANCOR: {
      pair_pre: {
        required,
        isSame(val) {
          return val !== this.BANCOR.pair_post
        }
      },
      pair_post: {
        required,
        isSame(val) {
          return val !== this.BANCOR.pair_pre
        }
      },
      money: {
        required,
        moneyAbleTest(symbol) {
          return this.BANCOR.moneyAble.indexOf(symbol.assetName) > -1
        }
      },
      moneyBalance: {
        required,
        isBalanceEnough(val) {
          let bet = Number(val) * Math.pow(10, this.BANCOR.money.precision)
          let obj = this.balanceSheet[this.BANCOR.money.assetName]
          if (obj !== undefined) {
            if (bet > obj.balance) {
              return false
            }
            return true
          }
          return false
        }
      },
      // stock: {
      //   required
      // },
      // stockCw: {
      //   required
      // },
      stockBalance: {
        required,
        isBalanceEnough(val) {
          let bet = Number(val) * Math.pow(10, this.stockSelect.precision)
          let obj = this.balanceSheet[this.stockSelect.assetName]
          if (obj !== undefined) {
            if (bet > obj.balance) {
              return false
            }
            return true
          }
          return false
        }
      },
      supply: {
        required
      }
    },
    brief: {
      required,
      minLength: minLength(50),
      maxLength: maxLength(1000)
    }
  },
  methods: {
    compilePackage() {
      this.pack = {
        pack: {
          money: this.BANCOR.money.assetName,
          stock: this.stockSelect.assetName,
          moneyBalance: (this.BANCOR.moneyBalance * Math.pow(10, this.BANCOR.money.precision)).toString(),
          stockBalance: (this.BANCOR.stockBalance * Math.pow(10, this.stockSelect.precision)).toString(),
          supply: this.BANCOR.supply.toString(),
          stockCw: 1,
          moneyCw: 1,
          moneyPrecision: this.BANCOR.money.precision,
          stockPrecision: this.stockSelect.precision,
          name: this.BANCOR.money.assetName + '-' + this.stockSelect.assetName,
          owner: this.userInfo.address
        },
        brief: this.brief
      }
    },
    send(stuff) {
      this.$emit('send', stuff)
    },
    checkMoney(val) {
      if (val) {
        if (this.BANCOR.moneyAble.indexOf(val.assetName) > 0) {
          // pass the test
          // this.BANCOR.stock =
        }
      }
    }
  },
  computed: {
    avaliable() {
      if (this.$v.$invalid === false) {
        this.compilePackage()
        this.send(this.pack)
        return true
      }
      return false
    },
    moneySelect() {
      if (this.BANCOR.pair_pre && this.BANCOR.pair_post) {
        // moneyAble filter
        return [
          {
            label: this.BANCOR.pair_pre.assetName,
            value: this.BANCOR.pair_pre
          },
          {
            label: this.BANCOR.pair_post.assetName,
            value: this.BANCOR.pair_post
          }
        ]
      }
      return []
    },
    stockSelect() {
      if (this.moneySelect.length > 0 && this.BANCOR.money) {
        let idx
        idx = this.moneySelect.findIndex(e => {
          return e.value.assetName === this.BANCOR.money.assetName
        })
        if (idx === 1) {
          return this.moneySelect[0].value
        } else {
          return this.moneySelect[1].value
        }
      }
      return {}
    },
    moneyReason() {
      if (this.BANCOR.money === '') {
        return this.$t('ERR_POSITIONLOCK_EMPTY')
      } else {
        if (this.BANCOR.moneyAble.indexOf(this.BANCOR.money.assetName) > -1) {
          return this.$t('ERR_POSITIONLOCK_EMPTY')
        }
        return this.$t('ERR_INCORRECT_MONEY')
      }
    }
  },
  watch: {
    avaliable(val) {
      if (val) {
        this.compilePackage()
        this.send(this.pack)
      }
    }
  }
}
</script>