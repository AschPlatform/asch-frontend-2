<template>
  <div class="col-12" id="init">
    <div class="row">
      <q-field class="col-md-8 col-xs-12 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_SUGGEST_PRE')">
      <q-select chips-color="secondary" chips multiple filter v-model="INIT.selected" :suffix="$t('LAUNCH_MODAL.MEMBER_SUGGEST_POST', {number: gatewayMember})" @blur="$v.INIT.selected.$touch()" :error="!$v.INIT.selected.inNeed" :options="delegateList"></q-select>
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="col-md-8 col-xs-12 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.INIT_REASON')">
      <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
      </q-field>
    </div>
    <!-- below is net init disabled page -->
    <slot name="fin"></slot>
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
  name: 'snippet-initGateway',
  props: ['reset', 'name', 'delegateList', 'gatewayMember'],
  components: {
    QField,
    QInput,
    QSelect
  },
  data() {
    return {
      INIT: {
        selected: []
      },
      brief: '',
      pack: {}
    }
  },
  validations: {
    INIT: {
      selected: {
        required,
        inNeed(val) {
          if (this.gatewayMember === val.length) {
            return true
          }
          return false
        }
      }
    },
    brief: {
      required,
      minLength: minLength(50),
      maxLength: maxLength(1000)
    }
  },
  computed: {
    // gatewayMember() {
    //   if (this.p_selected.minimumMembers) {
    //     return this.p_selected.minimumMembers
    //   }
    //   return 0
    // },
    avaliable() {
      if (this.$v.$invalid === false) {
        this.compilePackage()
        this.send(this.pack)
        return true
      }
      return false
    }
  },
  methods: {
    compilePackage() {
      this.pack = {
        pack: {
          gateway: this.name,
          members: this.INIT.selected,
          desc: this.brief
        },
        brief: this.brief
      }
    },
    send(stuff) {
      this.$emit('send', stuff)
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