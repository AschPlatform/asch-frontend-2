<template>
  <div class="col-12" v-show="this.first_type === 'gateway_clear' && this.initFalse" id="clear">
    <div class="row">
      <q-field class="gateway-claim col-md-12 col-xs-12 font-16 text-four row" label-width="1" :label="$t('LAUNCH_MODAL.GATEWAY_CLEAR_TIP')">
        <div class="text-secondary block">{{name || ''}}</div>
        <div class="row">
          <div>{{$t('GATEWAY_MEMBER')}}</div>
          <q-select class="col-md-4" align="center" multiple chips filter v-model="CLEAR.selected" :options="MEMBER.electedList"></q-select>
          <div class="col-md-5">{{$t('LAUNCH_MODAL.GATEWAY_CLEAR_TIP1')}}</div>
        </div>
      </q-field>
    </div>
    <div class="row">
      <q-field class="col-md-6 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.GATEWAY_FREEZE_BRIEF')">
        <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
      </q-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'snippet-claimGateway',
  props: ['reset', 'name', 'electedList'],
  data() {
    return {
      avaliable: false,
      CLEAR: {
        selected: []
      },
      package: {}
    }
  },
  validations: {
    CLEAR: {
      selected: {
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
      this.package = {
        gateway: this.p_selected.name,
          evilMembers: (() => {
            let tempArr = []
            this.CLEAR.selected.forEach(e => {
              tempArr.push(e.address)
            })
            return tempArr
          })(),
        url: this.CLEAR.url,
        desc: this.brief
      }
    },
    judge() {
      this.$v.CLEAR.$touch()
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