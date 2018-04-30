<template>
  <div class="row justify-around q-my-lg member-container">
    <q-field class="col-5 align-center ">
      <div class="column">
        <p class="col-1">{{$t(title_pre)}}</p>
        <div class="col-auto">

      <q-chips-input color="primary" class="col-auto member-content-chips-1" inverted readonly v-model="contentPre" disable/>
        </div>
      </div>
      
    </q-field>
    <q-icon size="33px" class="padding-t-40" name="keyboard arrow right" />
    <q-field class="col-5">
      <p>{{$t(title_post)}}</p>
      <q-chips-input color="primary" class="col-5 member-content-chips-2" inverted readonly v-model="contentPost" disable/>
    </q-field>
  </div>
</template>

<script>
import { QChipsInput, QField, QIcon } from 'quasar'

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
          return this.$t('DETAIL_MODAL.INIT_TIP_PRE', { number: this.memberPre.length })
        case 'gateway_update_member':
          return this.$t('DETAIL_MODAL.MEMBER_TIP_PRE')
      }
    },
    title_post() {
      switch (this.type) {
        case 'gateway_init':
          return this.$t('DETAIL_MODAL.INIT_TIP_POST', { number: this.memberPost.length })
        case 'gateway_update_member':
          return this.$t('DETAIL_MODAL.MEMBER_TIP_POST')
      }
    },
    contentPre() {
      let ls = []
      ls.push(this.memberPre)
      return ls
    },
    contentPost() {
      let ls = []
      ls.push(this.memberPost)
      return ls
    }
  }
}
</script>

<style lang="stylus" scoped>
.member-container .q-field div .q-field-content {
  .member-content-chips-1 {
    height: 100%;
    min-height: 235px;
  }

  .member-content-chips-2 {
    height: 100%;
    min-height: 200px;
    align-items: flex-start;
  }
}
</style>
