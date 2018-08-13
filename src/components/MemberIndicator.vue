<template>
  <div class="row justify-around q-my-lg member-container">
    <div class="partLeft col-md-5 col-xs-12 align-center">
      <div class="part-title">{{$t(title_pre)}}</div>
      <q-chip square color="white" text-color="secondary" class="chip" v-for="(item, idx) in contentPre" :key="idx">{{item}}</q-chip>
    </div>
    
    <q-icon size="33px" class="mobile-hide padding-t-40" name="keyboard arrow right" />
    <q-icon size="33px" class="desktop-hide padding-t-40" name="keyboard arrow down"/>

    <div class="partRight col-md-5 col-xs-12 align-center">
      <div class="part-title">{{$t(title_post)}}</div>
      <q-chip square color="white" text-color="secondary" class="chip" v-for="(item, idx) in contentPost" :key="idx">{{item}}</q-chip>
    </div>
  </div>
  
</template>

<script>
import { QChipsInput, QField, QIcon, QChip } from 'quasar'

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
    QIcon,
    QChip
  },
  computed: {
    title_pre() {
      switch (this.type) {
        case 'gateway_init':
          return this.$t('DETAIL_MODAL.INIT_TIP_PRE', {
            number: this.memberPre ? this.memberPre.length : ''
          })
        case 'gateway_update_member':
          return this.$t('DETAIL_MODAL.MEMBER_TIP_PRE')
        case 'council_change':
          return this.$t('LAUNCH_MODAL.INSTEAD_PRE')
      }
    },
    title_post() {
      switch (this.type) {
        case 'gateway_init':
          return this.$t('DETAIL_MODAL.INIT_TIP_POST', {
            number: this.memberPost ? this.memberPost.length : ''
          })
        case 'gateway_update_member':
          return this.$t('DETAIL_MODAL.MEMBER_TIP_POST')
        case 'council_change':
          return this.$t('LAUNCH_MODAL.INSTEAD_POST')
      }
    },
    contentPre() {
      if (Array.isArray(this.memberPre)) {
        return this.memberPre
      }
      let ls = []
      ls.push(this.memberPre)
      return ls
    },
    contentPost() {
      if (Array.isArray(this.memberPost)) {
        return this.memberPost
      }
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
    align-items: flex-start;
  }

  .member-content-chips-2 {
    height: 100%;
    min-height: 200px;
    align-items: flex-start;
  }
}

.part-title {
  font-size: 14px;
  margin: 0 0 14px 0;
  font-weight: 600;
}

.chip {
  margin: 0 5px 5px 0;
  border: 1px solid #5CB8B3;
}

.partLeft, .partRight {
  border: 1px solid #5cb8b3;
  padding: 10px;
}
</style>
