<template>
  <div class="row justify-around q-my-lg">
    <q-field class="col-5 align-center">
      <p>{{$t(title_pre)}}</p>
      <q-chips-input color="primary" class="col-5" inverted readonly v-model="memberPre" disable/>
    </q-field>
    <q-icon size="33px" name="keyboard arrow right" />
    <q-field class="col-5">
      <p>{{$t(title_post)}}</p>
      <q-chips-input color="primary" class="col-5" inverted readonly v-model="memberPost" disable/>
    </q-field>
  </div>
</template>

<script>
import {
  QChipsInput,
  QField,
  QIcon
} from 'quasar'

export default {
  name: 'MemberIndicator',
  props: ['memberPre', 'memberPost', 'showCounter', 'type'],
  data() {
    return {
      preMsg: '',
      postMsg: ''
    }
  },
  components: {
    QChipsInput,
    QField,
    QIcon
  },
  computed: {
    title_pre() {
      switch (this.type) {
        case 'gateway_init':
          return this.$t('DETAIL_MODAL.INIT_TIP_PRE', {number: this.memberPre.length})
        case 'gateway_update_member':
          return this.$t('DETAIL_MODAL.MEMBER_TIP_PRE')
      }
    },
    title_post() {
      switch (this.type) {
        case 'gateway_init':
          return this.$t('DETAIL_MODAL.INIT_TIP_POST', {number: this.memberPost.length})
        case 'gateway_update_member':
          return this.$t('DETAIL_MODAL.MEMBER_TIP_POST')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
