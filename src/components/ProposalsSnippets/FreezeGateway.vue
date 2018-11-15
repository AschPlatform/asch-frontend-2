<template>
  <div class="col-12" v-show="this.first_type === 'gateway_freeze' && this.initFalse" id="freeze">
    <div class="row">
      <q-field class="gateway-claim col-md-8 col-xs-12 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.GATEWAY_FREEZE_TIP')">
      <div class="text-secondary">{{p_selected.name}}</div>
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
export default {
  name: 'snippet-freezeGateway',
  props: ['reset', 'name'],
  data() {
    return {
      avaliable: false,
      package: {}
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
      this.package = {
        gateway: this.p_selected.name,
        from: this.MEMBER.removed.address,
        to: this.MEMBER.added.address
      }
    },
    judge() {
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