<template>
  <div class="table-container">
    <div class="q-table-top relative-position row">
      <div class="q-table-control">
        <div class="q-table-title">TITLE</div>
      </div>
      <div class="q-table-separator col"></div>
      <div class="q-table-control">
        <q-btn-toggle :class="transRecordBtnClass" flat rounded icon="fiber_manual_record" v-model="type" 
        toggle-color="negative"  toggle-text-color="white"
        :options="options" />
      </div>
    </div>
    <div class="scroll q-table-middle">
      <div class="q-table modified">
        <div id="tr" v-for="(item, index) in this.data" :key="index" class="justify-between row">
          <div id="td" class="col-xs-12 col-md-5">
            <p>{{item.col1[0]}}</p>
            <p>{{item.col1[1]}}</p>
          </div>
          <div>
            <span class="number col-xs-12 col-md-3">{{item.fee[0]}}</span><span class="fee">{{item.fee[1]}}</span>
          </div>
          <div id="td" class="col-xs-12 col-md-3">
            <p>{{item.col2[0]}}</p>
            <p>{{item.col2[1]}}</p>
          </div>
        </div>
      </div>
    </div>
    <q-pagination v-model="page" :min="1" :max="Number(this.maxPage)" :max-pages="6" @input="changePage" direction-links></q-pagination>
  </div>
</template>

<script>
import { QPagination, QBtnToggle } from 'quasar'

export default {
  name: 'RecordTable',
  props: ['data', 'options', 'maxPage'],
  components: {
    QPagination,
    QBtnToggle
  },
  data() {
    return {
      type: '',
      page: 0,
      items: [
        // structure of the item
        // {
        //   amount: '10000000',
        //   currency: 'XAS',
        //   receipientId: 'AHUN8znTu4hnes21Ayjgdgv5K4AinoetZB',
        //   receipientName: 'Zombie',
        //   senderId: 'Abise',
        //   tid: '7f7aff45034307ac712abea367b2ad25beb0516373f87819d3fee5b72e75740d',
        //   timestamp: '61105019',
        //   transaction: {
        //     args: '["10000000000","AHUN8znTu4hnes21Ayjgdgv5K4AinoetZB"]',
        //     fee: 10000000,
        //     height: 119636,
        //     id: '7f7aff45034307ac712abea367b2ad25beb0516373f87819d3fee5b72e75740d',
        //     message: 'u !',
        //     secondSignature: null,
        //     senderId: 'A8Y2krjbjTjb5p2jFocSoZZSE7fapsq6o4',
        //     senderPublicKey: "aa675e9c355f44593cc8333cda3506b603cf17a8634b0f61225fb852bd3d67eb",
        //     signatures: '["f32b58163796f526d13dd2c23978e820d693ee10692c2ae11d17827cf01fa432461005220417c0acebb11cfa2b4e813ca782fd9449f93e47fac599986efb6d04"]',
        //     timestamp: 61105019,
        //     type: 1
        //   }
        // }
        {
          col1: ['SYSTEM', '2016-12-06 15:36:56'],
          col2: ['请收款', '备注'],
          fee: ['+10000', 'BTS']
        },
        {
          col1: ['Asd4fg518F416a1w6g1V981', '2016-12-06 15:36:56'],
          col2: ['请收款', '备注'],
          fee: ['+10000', 'XAS']
        },
        {
          col1: ['SYSTEM', '2016-12-06 15:36:56'],
          col2: ['请收款, BITCASH', '备注'],
          fee: ['-10000', 'BTC']
        },
        {
          col1: ['SYSTEM', '2016-12-06 15:36:56'],
          col2: ['请收款', '备注'],
          fee: ['+0.165', 'XCT']
        },
        {
          col1: ['SYSTEM', '2016-12-06 15:36:56'],
          col2: ['请收款', '备注'],
          fee: ['+0.165', 'XCT']
        }
      ]
    }
  },
  methods: {
    changePage(num) {
      this.$emit('changePage', num)
    }
  },
  computed: {
    transRecordBtnClass() {
      return this.isDesk ? 'bg-secondary text-white' : 'trans-record-btns bg-secondary text-white'
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
</style>

