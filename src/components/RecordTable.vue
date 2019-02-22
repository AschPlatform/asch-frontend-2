<template>
  <div :class="deskStyle">
    <div class="q-table-top relative-position bg-white justify-between q-px-xs row">
      <div class="q-table-control">
        <i class="material-icons font-24 vertical-align-middle text-secondary">account_balance_wallet</i>
        <div class="q-table-title font-18 margin-left-10">{{title}}</div>
      </div>
      <div class="q-table-separator col"></div>
      <div
        v-if="isDesktop"
        class="q-table-control"
      >
        <q-btn-toggle
          v-if="showToggle"
          :class="transRecordBtnClass"
          color="white"
          text-color="secondary"
          icon="fiber_manual_record"
          v-model="type"
          toggle-color="secondary"
          toggle-text-color="white"
          :options="options"
          @input="changeType"
        />
      </div>
      <div
        v-else
        class="q-table-control"
      >
        <q-btn-toggle
          v-if="showToggle"
          dense
          :class="transRecordBtnClass"
          color="white"
          text-color="secondary"
          icon="fiber_manual_record"
          v-model="type"
          toggle-color="secondary"
          toggle-text-color="white"
          :options="options"
          @input="changeType"
        />
      </div>
    </div>
    <span
      v-if="isDesktop && isShowLine"
      class="transfer-title-line"
    ></span>
    <div class="scroll q-table-middle">
      <div
        class="q-table modified"
        v-if="dataInfo.length > 0"
      >
        <div
          id="tr"
          v-for="(item, index) in dataInfo"
          :key="index"
          class="justify-between row"
        >

          <div
            id="td"
            class="col-xs-12 col-md-3 row justify-left"
          >
            <asset-icon
              id="asset-icon"
              :iconKey="item.iconKey"
              class="q-mr-xs"
            />
            <div
              id="main-info"
              class="inline "
            >
              <!-- <p v-if="clip.col1" v-clipboard="item.col1[0] || 'no data'" @success="info($t('COPY_SUCCESS'))">{{item.col1[0].slice(0, 12)}}
                <q-tooltip> 
                  {{item.col1[0]}}
                </q-tooltip>
              </p> -->
              <p
                v-if="item.needClip"
                v-clipboard="item.col1[0] || 'no data'"
                @success="info($t('COPY_SUCCESS'))"
              >
                {{item.col1[0] | eclipse}}
                <q-tooltip>
                  {{item.col1[0]}}
                </q-tooltip>
              </p>
              <p v-else>
                {{item.col1[0]}}
                <q-tooltip>
                  {{item.col1[0]}}
                </q-tooltip>
              </p>
              <p>{{item.col1[1]}}</p>
            </div>
          </div>
          <div
            v-if="isDesktop"
            id="transId"
            class="col-xs-12 col-md-2"
          >
            <p
              v-clipboard="item.tid || 'no data'"
              @success="info($t('COPY_SUCCESS'))"
            >{{item.tid.slice(0,8)}}
              <q-tooltip>
                {{$t('TRANS_ID') + ': ' + item.tid}}
              </q-tooltip>
            </p>
            <!-- <p>{{$t('TRANS_ID')}}</p> -->
          </div>
          <div
            v-else
            id="transId"
            class="col-xs-12 col-md-2"
            v-clipboard="item.tid || 'no data'"
            @success="info($t('COPY_SUCCESS'))"
          >
            <span>{{$t('TRANS_ID')}}</span>
            <span>{{item.tid.slice(0, 7)}}
              <q-tooltip>
                {{item.tid}}
              </q-tooltip>
            </span>
          </div>
          <div
            v-if="isDesktop"
            id="backup"
            class="col-xs-12 col-md-2"
          >
            <p
              v-if="clip.col2"
              v-clipboard="item.col2[0] || 'no data'"
              @success="info($t('COPY_SUCCESS'))"
            >{{item.col2[0]}}
              <q-tooltip>
                {{item.col2[0]}}
              </q-tooltip>
            </p>
            <p v-else>{{item.col2[0]}}
              <q-tooltip>
                {{item.col2[0]}}
              </q-tooltip>
            </p>
            <!-- <p>{{item.col2[1]}}</p> -->
          </div>
          <div
            v-else
            id="backup"
            class="col-xs-12 col-md-2"
          >
            <span>{{item.col2[1]}}</span>
            <span>{{item.col2[0].slice(0, 7)}}
              <q-tooltip>
                {{item.col2[0]}}
              </q-tooltip>
            </span>
          </div>
          <div
            v-if="isDesktop"
            id="account"
            class="col-xs-12 col-md-4"
          >
            <span class="number">{{item.fee[0]}}</span><span class="fee">{{item.fee[1]}}</span>
          </div>
          <div
            v-else
            id="account"
          >
            <span class="number">{{item.fee[0]}}</span><br /><span class="fee">{{item.fee[1]}}</span>
          </div>
        </div>
      </div>
    </div>
    <span
      v-if="isDesktop && isShowLine"
      class="transfer-title-line"
    ></span>
    <q-pagination
      v-if="isDesktop && isShowLine"
      id="pagination"
      color="secondary"
      v-model="page"
      :min="1"
      :max="Number(this.maxPage)"
      :max-pages="3"
      @input="changePage"
      direction-links
      class="absolute-bottom-right"
    ></q-pagination>
    <q-pagination
      v-if="!isDesktop && isShowLine"
      id="pagination"
      color="secondary"
      v-model="page"
      :min="1"
      :max="Number(this.maxPage)"
      :max-pages="3"
      @input="changePage"
      direction-links
      class="absolute-bottom-center"
    ></q-pagination>
  </div>
</template>

<script>
import { QPagination, QBtnToggle, QTooltip } from 'quasar'
import { isDesktop, toast } from '../utils/util'
import AssetIcon from '../components/AssetIcon'

export default {
  name: 'RecordTable',
  props: ['data', 'options', 'maxPage', 'title', 'iconKey', 'clip'],
  components: {
    QPagination,
    QBtnToggle,
    QTooltip,
    AssetIcon
  },
  data() {
    return {
      type: 1,
      page: 1,
      isDisable: false
    }
  },
  methods: {
    changePage(num) {
      this.$emit('changePage', num)
    },
    changeType(num) {
      this.$emit('changeType', num)
    },
    info(msg) {
      if (this.isDisable === true) {
        return
      }
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      toast(msg)
    }
  },
  mounted() {
  },
  computed: {
    transRecordBtnClass() {
      return this.isDesktop ? {'bg-white': true, 'text-secondary': true} : {'trans-record-btns': true, 'bg-white': true, 'text-secondary': true}
    },
    dataInfo() {
      if (this.data.length > 0) {
        return this.data
      }
      return []
    },
    showToggle() {
      return this.options !== 'none'
    },
    deskStyle() {
      return {
        'table-container': true,
        'shadow-1': true,
        'relative-position': true,
        'portable': !isDesktop()
      }
    },
    isDesktop() {
      return isDesktop()
    },
    isShowLine() {
      return this.dataInfo.length !== 0
    }
  }
}
</script>

<style lang="stylus" scoped>
.modified {
  #tr {
    padding: 8px 6px;

    #td {
      p {
        display: block;
        margin: 0;
        font-size: 14px;

        &:nth-child(1) {
          color: #000;
          font-weight: bold;
        }

        &:nth-child(2) {
          color: #999;
          font-size: 12px;
        }
      }
    }

    #backup {
      p {
        text-align: left;
        display: block;
        margin: 0;
        font-size: 14px;
        overflow: hidden;
        max-height: 30px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        height: 100%;
        -webkit-box-orient: vertical;

        &:nth-child(1) {
          color: #000;
          font-size: 12px;
        }

        &:nth-child(2) {
          color: #999;
          font-size: 12px;
        }
      }
    }

    #account {
      text-align: right;
      padding: 6px 0;
    }

    #transId {
      p {
        text-align: left;
        display: block;
        margin: 0;
        font-size: 14px;
        overflow: hidden;
        max-height: 30px;
        text-overflow: ellipsis;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        height: 100%;
        -webkit-box-orient: vertical;

        &:nth-child(1) {
          color: #000;
        }

        &:nth-child(2) {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}

.fee {
  margin-left: 5px;
  color: #43aea8;
  font-size: 16px;
}

.number {
  font-size: 22px;
}

.table-container {
  height: 100%;
  padding-bottom: 90px;
}

.q-table-middle {
  padding: 10px 20px 0 20px;
}

#pagination {
  right: 33px;
  bottom: 33px;

  button {
    margin: 0 15px !important;
  }
}

.portable {
  .q-table-title {
    font-size: 15px;
    font-weight: 600;
  }

  .q-table-top {
    padding: 0px 10px;
  }

  .q-table-separator {
    display: none;
  }

  .q-table-middle {
    padding: 0;
  }

  #asset-icon {
    display: none;
  }

  #tr {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
    margin: 15px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;

    #account {
      position: absolute;
      right: 10px;
      top: 30%;
      text-align: right;

      .number {
        font-size: 13px;
        color: #ED3E42;
      }

      .fee {
        fon-size: 13px;
      }
    }
  }
}

#main-info {
  p {
    &:nth-child(1) {
      font-weight: 400 !important;
    }

    &:nth-child(2) {
      font-size: 10px;
      margin: 5px 0;
    }
  }

  #backup {
    span {
      font-size: 10px !important;
      text-align: left !important;
      color: #666;

      &:nth-child(1) {
        text-align: left !important;
        font-weight: bold;
      }

      &:nth-child(2) {
        text-align: left;
      }
    }
  }

  #transId {
    span {
      font-size: 10px !important;
      text-align: left !important;
      color: #666;

      &:nth-child(1) {
        text-align: left !important;
        font-weight: bold;
      }

      &:nth-child(2) {
        text-align: left;
      }
    }
  }

  #pagination {
    left: 36%;
  }
}

.transfer-title-line {
  margin: auto;
  display: block;
  width: calc(100% - 40px);
  height: 1px;
  background: #dddddd;
  margin-left: 20px;
}
</style>

