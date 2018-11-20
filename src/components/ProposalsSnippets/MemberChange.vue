<template>
  <div class="col-12 q-field-label-inner-center" id="remove">
    <!-- instead members -->
    <div class="row">
      <q-field align="left" class="col-md-5 col-xs-12 font-16 text-four" label-width="3" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP1')">
      <q-select align="center" chips filter v-model="MEMBER.removed" :options="electedList"></q-select>
      </q-field>
      <q-field class="col-md-4 col-xs-12 font-16 text-four" label-width="3" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP2')">
      <q-select align="center" color="secondary" chips filter v-model="MEMBER.added" :options="unelectedList"></q-select>
      </q-field>
      <q-field class="col-md-3 col-xs-12 font-16 text-four" label-width="8" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP3')">
      </q-field>
    </div>
    <div class="row col-12">
      <q-field class="col-md-8 col-xs-12 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.MEMBER_REASON')">
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
  name: 'snippet-memberChange',
  props: ['reset', 'name', 'electedList', 'unelectedList'],
  components: {
    QField,
    QInput,
    QSelect
  },
  data() {
    return {
      MEMBER: {
        added: [],
        removed: [],
        electedList: [],
        unelectedList: [],
        memberList: []
      },
      brief: '',
      pack: {}
    }
  },
  validations: {
    MEMBER: {
      added: {
        required,
        isEqual(val) {
          return val.length === this.MEMBER.removed.length
        }
      },
      removed: {
        required,
        isEqual(val) {
          return val.length === this.MEMBER.added.length
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
      this.pack = {
        pack: {
          gateway: this.name,
          from: this.MEMBER.removed.address,
          to: this.MEMBER.added.address
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