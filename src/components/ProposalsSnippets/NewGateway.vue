<template>
  <div class="col-md-12" id="new">
    <div class="row col-md-12">
      <q-field class="block col-md-6 col-xs-12 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_3_16')" :label="$t('LAUNCH_MODAL.NET_NAME')">
        <q-input type="text" v-model="NEW.name" @blur="$v.NEW.name.$touch()" :error="$v.NEW.name.$error"></q-input>
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="block col-md-6 col-xs-12 font-16 text-four" label-width="3" :error-label="$t('LAUNCH_MODAL.NET_CURRENCY_TIP')" :label="$t('LAUNCH_MODAL.NET_CURRENCY')">
        <q-input type="text" v-model="NEW.currency" @blur="$v.NEW.currency.$touch()" :error="$v.NEW.currency.$error"></q-input>
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="block col-md-6 col-xs-12 font-16 text-four" label-width="3" :error-label="$t('LAUNCH_MODAL.PRECISION_TIP')" :label="$t('PRECISION')">
        <q-input upper-case type="number" v-model="NEW.currencyPrecision" @blur="$v.NEW.currencyPrecision.$touch()" :error="$v.NEW.currencyPrecision.$error"></q-input>
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="block col-md-6 col-xs-12 font-16 text-four" label-width="3" :error-label="$t('LAUNCH_MODAL.CURRENCY_BRIEF_TIP')" :label="$t('LAUNCH_MODAL.CURRENCY_BRIEF')">
        <q-input type="textarea" v-model="NEW.currencyBrief" @blur="$v.NEW.currencyBrief.$touch()" :error="$v.NEW.currencyBrief.$error" :max-height="100" :maxlength="256"></q-input>
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="block col-md-6 col-xs-12 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_3_33')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
        <q-input type="number" v-model="NEW.memberNumber" @blur="$v.NEW.memberNumber.$touch()" :error="$v.NEW.memberNumber.$error" :placeholder="$t('LAUNCH_MODAL.PERSON')"></q-input>
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="col-md-6 col-xs-12 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD_NET')">
        <q-input type="number" v-model="NEW.period" @blur="$v.NEW.period.$touch()" :error="$v.NEW.period.$error" :placeholder="$t('LAUNCH_MODAL.DAY')"></q-input>
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="col-md-6 col-xs-12 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
        <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
      </q-field>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators'
import { assetSymbolReg, gatewayNameReg } from '../../utils/validators'
import {
  QField,
  QInput
} from 'quasar'

export default {
  name: 'snippet-newGateway',
  props: ['reset'],
  components: {
    QField,
    QInput
  },
  data() {
    return {
      NEW: {
        memberList: [],
        memberNumber: null,
        period: null,
        agreement: [],
        // NET SCOPE
        name: null,
        currency: null,
        currencyBrief: null,
        currencyPrecision: null
      },
      brief: '',
      pack: {}
    }
  },
  validations: {
    NEW: {
      memberNumber: {
        required,
        minValue: minValue(3),
        maxValue: maxValue(33)
      },
      period: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(30)
      },
      // NET SCOPE
      name: {
        required,
        reg(val) {
          return gatewayNameReg.test(val)
        }
      },
      currency: {
        required,
        reg(val) {
          return assetSymbolReg.test(val)
        }
      },
      currencyPrecision: {
        required,
        minValue: minValue(0),
        maxValue: maxValue(16)
      },
      currencyBrief: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(256)
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
          name: this.NEW.name,
          desc: this.NEW.currencyBrief,
          updateInterval: this.countedInterval,
          minimumMembers: this.NEW.memberNumber,
          currency: {
            symbol: this.NEW.currency,
            desc: this.NEW.currencyBrief,
            precision: this.NEW.currencyPrecision
          }
        },
        brief: this.brief
      }
    },
    send(stuff) {
      this.$emit('send', stuff)
    }
  },
  computed: {
    avaliable() {
      if (this.$v.invalid !== true) {
        this.compilePackage()
        this.send(this.pack)
        return true
      }
      return false
    },
    countedInterval() {
      return Number(this.NEW.period) * 8640
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