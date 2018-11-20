<template>
  <div class="col-12" id="freeze">
    <div class="row">
      <q-field class="gateway-claim col-md-8 col-xs-12 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.GATEWAY_FREEZE_TIP')">
      <div class="text-secondary">{{name}}</div>
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="col-md-8 col-xs-12 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.GATEWAY_FREEZE_BRIEF')">
      <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
      </q-field>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import {
  QField,
  QInput
} from 'quasar'

export default {
  name: 'snippet-freezeGateway',
  props: ['reset', 'name'],
  components: {
    QField,
    QInput
  },
  data() {
    return {
      brief: '',
      pack: {}
    }
  },
  validations: {
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
          gateway: this.name,
          desc: this.brief
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
      if (this.$v.$invalid === false) {
        this.compilePackage()
        this.send(this.pack)
        return true
      }
      return false
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