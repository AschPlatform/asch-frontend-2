<template>
  <div class="table-container relative-position">
    <div class="q-table-top relative-position row">
      <div class="q-table-control">
        <i class="material-icons font-24 vertical-align-middle text-secondary">account_balance_wallet</i>
        <div class="q-table-title">{{title}}</div>
      </div>
      <div class="q-table-separator col"></div>
      <div class="q-table-control">
        <q-btn-toggle :class="transRecordBtnClass" color="white" flat icon="fiber_manual_record" v-model="type" 
        toggle-color="negative"  toggle-text-color="white"
        :options="options" @input="changeType" />
      </div>
    </div>
    <div class="scroll q-table-middle">
      <div class="q-table modified">
        <div id="tr" v-if="dataInfo.length > 0" v-for="(item, index) in dataInfo" :key="index" class="justify-between row">
          <div id="td" class="col-xs-12 col-md-4">
            <p>{{item.col1[0]}}</p>
            <p>{{item.col1[1]}}</p>
          </div>
          <div>
            <span class="number col-xs-12 col-md-3">{{item.fee[0]}}</span><span class="fee">{{item.fee[1]}}</span>
          </div>
          <div id="td" class="col-xs-12 col-md-3">
            <p>{{item.col2[0].slice(0, 7)}}
              <q-tooltip>
                {{item.col2[0]}}
              </q-tooltip>
            </p>
            <p>{{item.col2[1]}}</p>
          </div>
        </div>
      </div>
    </div>
    <q-pagination v-model="page" :min="1" :max="Number(this.maxPage)" :max-pages="6" @input="changePage" direction-links class="absolute-bottom-right"></q-pagination>
  </div>
</template>

<script>
import { QPagination, QBtnToggle, QTooltip } from 'quasar'

export default {
  name: 'RecordTable',
  props: ['data', 'options', 'maxPage', 'title'],
  components: {
    QPagination,
    QBtnToggle,
    QTooltip
  },
  data() {
    return {
      type: 1,
      page: 1
    }
  },
  methods: {
    changePage(num) {
      this.$emit('changePage', num)
    },
    changeType(num) {
      console.log(num, this.type)
      this.$emit('changeType', this.type)
    }
  },
  computed: {
    transRecordBtnClass() {
      return this.isDesk ? 'bg-secondary text-white' : 'trans-record-btns bg-secondary text-white'
    },
    dataInfo() {
      if (this.data.length > 0) {
        return this.data
      }
      return []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .modified
    #tr
      padding 10px 6px
      #td
        p
         display block
         margin 0
         font-size 14px
         &:nth-child(1)
          color #000
          font-weight bold
         &:nth-child(2)
          color #999
  .fee
    margin-left 5px
    color #43aea8
    font-size 14px
  .number
    font-size 18px
  .table-container
    height 100%
</style>

