<template>
  <div class="col-12" v-show="this.first_type === 'init' && this.initFalse" id="init">
    <div class="row">
      <q-field class="col-md-8 col-xs-12 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_SUGGEST_PRE')">
      <q-select chips-color="secondary" chips multiple filter v-model="INIT.selected" @input="detectChange" :suffix="$t('LAUNCH_MODAL.MEMBER_SUGGEST_POST', {number: gatewayMember})" @blur="$v.INIT.selected.$touch()" :error="!$v.INIT.selected.inNeed" :options="delegateList"></q-select>
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="col-md-8 col-xs-12 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.INIT_REASON')">
      <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
      </q-field>
    </div>
    <!-- below is net init disabled page -->
    <div class="col-12" v-show="!this.initFalse">
      <div class="row">{{$t('ALREADY_INIT')}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'snippet-initGateway',
  props: ['reset', 'selected', 'initFalse'],
  data() {
    return {
      avaliable: false,
      INIT: {
        selected: []
      },
      package: {}
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
  methods: {
    compilePackage() {
      this.package = {
        gateway: this.p_selected.name,
        members: this.INIT.selected,
        desc: this.brief
      }
    },
    judge() {
      this.$v.INIT.$touch()
      this.$v.brief.$touch()
      if (!this.$v.invalid) {
        this.send(this.package)
      }
    },
    send(stuff) {
      this.$emit('send', stuff)
    }
  }
}
</script>