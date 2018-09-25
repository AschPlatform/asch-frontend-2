<template>
  <q-page class="contract-container">
    <div class="contract-content bg-white shadow-2 border-r-6">
      <div class="relative desktop-only w-full border-1 border-solid border-tw-grey">
        <div class="top-bar">
          <button :class="this.type === 1 ? styleSelected : styleUnselected" @click="changeType(1)">
            {{$t('SMART_CONTRACT_LIST')}}
          </button>
          <button :class="this.type === 0 ? styleSelected : styleUnselected" @click="changeType(0)">
            {{$t('SMART_CONTRACT_MINE')}}
          </button>
          <q-btn class="font-18 mobile-hide float-right pos" rounded size="xs" color="secondary" :label="$t('SMART_CONTRACT_NEW')" @click="callModal"></q-btn>
        </div>

        <q-table class="no-shadow margin-t-20" :data="contracts" :columns="columns" row-key="index" :pagination.sync="pagination" @request="request" :rows-per-page-options="[10]">
          <q-td slot="body-cell-address" slot-scope="props" :props="props">
            {{props.value}}
          </q-td>
          <q-td slot="body-cell-name" slot-scope="props" :props="props">
            {{props.value}}
          </q-td>
          <q-td slot="body-cell-version" slot-scope="props" :props="props">
            {{props.value}}
          </q-td>
          <q-td slot="body-cell-owner" slot-scope="props" :props="props">
            {{props.value}}
          </q-td>
          <q-td slot="body-cell-timestamp" slot-scope="props" :props="props">
            {{props.value}}
          </q-td>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  QPage,
  QBtnGroup,
  QBtn,
  QTable
} from 'quasar'

export default {
  name: 'Contract',
  components: {
    QPage,
    QBtnGroup,
    QBtn,
    QTable
  },
  data() {
    return {
      type: 0,
      styleSelected: 'inner-btn text-secondary selected',
      styleUnselected: 'inner-btn text-four',
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      contracts: [],
      columns: [
        {
          name: 'address',
          required: true,
          label: this.$t('ADDRESS'),
          align: 'center',
          field: 'address'
        },
        {
          name: 'name',
          required: true,
          label: this.$t('SMART_CONTRACT_NAME'),
          align: 'center',
          field: 'name'
        },
        {
          name: 'version',
          required: true,
          label: this.$t('VERSION'),
          align: 'center',
          field: 'version'
        },
        {
          name: 'owner',
          required: true,
          label: this.$t('SMART_CONTRACT_OWNER'),
          align: 'center',
          field: 'owner'
        },
        {
          name: 'timestamp',
          required: true,
          label: this.$t('CREATE_TIME'),
          align: 'center',
          field: 'timestamp'
        }
      ]
    }
  },
  methods: {
    async request(props) {
      await this.getContractsFunc(props.pagination, props.filter)
    },
    getContractsFunc(pagination = {}, filter = '') {
    },
    changeType(type) {
      this.type = type
    }
  }
}
</script>

<style lang="stylus" scoped>
.contract-container
  padding 20px
.inner-btn
  outline none
  background-color rgba(0, 0, 0, 0)
  position relative
  height 57px
  width 188px
  font-size 20px
  padding 6px 12px
  cursor pointer
  border-top: none;
  border-left: none;
  border-right: 1px solid #e0e1e5;
  border-bottom: 1px solid #ffffff;
.selected
  bottom: -1px
.top-bar
  border-bottom 1px solid #e0e1e5
.pos
  top 5px
  right 10px
</style>
