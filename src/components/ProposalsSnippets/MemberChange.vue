<template>
  <div class="col-12 q-field-label-inner-center" v-show="this.first_type === 'member_n'" id="remove">
    <!-- instead members -->
    <div class="row">
      <q-field align="left" class="col-md-5 col-xs-12 font-16 text-four" label-width="3" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP1')">
      <q-select align="center" chips filter v-model="MEMBER.removed" :options="MEMBER.electedList"></q-select>
      </q-field>
      <q-field class="col-md-4 col-xs-12 font-16 text-four" label-width="3" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP2')">
      <q-select align="center" color="secondary" chips filter v-model="MEMBER.added" :options="MEMBER.unelectedList"></q-select>
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
export default {
  name: 'snippet-memberChange',
  props: ['reset', 'electedList', 'unelectedList'],
  data() {
    return {
      avaliable: false,
      MEMBER: {
        type: [
          {
            label: this.$t('proposal.SELECT_MEMBER_ADD'),
            value: 'add'
          },
          {
            label: this.$t('proposal.SELECT_MEMBER_DELETE'),
            value: 'delete'
          },
          {
            label: this.$t('proposal.SELECT_MEMBER_INSTEAD'),
            value: 'instead'
          }
        ],
        type_selected: null,
        added: [],
        removed: [],
        electedList: [],
        unelectedList: [],
        add_selected: [],
        delete_selected: [],
        instead_pre: [],
        instead_post: [],
        memberList: [],
        show_pre: [],
        show_post: [],
        clear: []
      },
      package: {}
    }
  },
  validations: {
    MEMBER: {
      instead_post: {
        required
      },
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
      this.package = {
        gateway: this.p_selected.name,
        from: this.MEMBER.removed.address,
        to: this.MEMBER.added.address
      }
    },
    judge() {
      this.$v.MEMBER.$touch()
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