<template>
  <q-page class="contract-container">
    <div class="contract-content bg-white shadow-2 border-r-6">
      <div class="relative w-full border-1 border-solid border-tw-grey">
        <div class="top-bar">
          <button :class="this.type === 1 ? styleSelected : styleUnselected" @click="changeType(1)">
            {{$t('SMART_CONTRACT_LIST')}}
          </button>
          <button :class="this.type === 0 ? styleSelected : styleUnselected" @click="changeType(0)">
            {{$t('SMART_CONTRACT_MINE')}}
          </button>
          <div class="float-right">
            <q-btn v-if="this.type === 0" class="font-14 pos" rounded color="secondary" :label="$t('SMART_CONTRACT_NEW')" @click="newContract" />
            <q-input color="secondary" v-else class="contract-search" type="text" v-model="searchStr" :after="searchIcon"  @keyup.enter="search" :placeholder="$t('SEARCH_BY_CONTRACT_NAME')" hide-underline />
          </div>
        </div>

        <q-table class="no-shadow margin-top-20" :data="contracts" :columns="columns" row-key="index" :pagination.sync="pagination" @request="request" :rows-per-page-options="[10]">
          <q-td slot="body-cell-address" slot-scope="props" :props="props">
            <div class="text-secondary cursor-pointer" @click="viewAccountInfo(props.row)">{{props.value}}</div>
          </q-td>
          <!-- <q-td slot="body-cell-name" slot-scope="props" :props="props">
            {{props.value}}
          </q-td>
          <q-td slot="body-cell-version" slot-scope="props" :props="props">
            {{props.value}}
          </q-td>
          <q-td slot="body-cell-owner" slot-scope="props" :props="props">
            {{props.value}}
          </q-td> -->
          <q-td slot="body-cell-timestamp" slot-scope="props" :props="props">
            {{props.value | time}}
          </q-td> 
          <q-td slot="body-cell-name" slot-scope="props" :props="props">
             <div class="text-secondary cursor-pointer" @click="open(props.row)">
                {{props.value}}
              </div>
          </q-td> 
          <q-td slot="body-cell-owner" slot-scope="props" :props="props">
             <div class="text-secondary cursor-pointer" @click="viewAccountInfo(props.row)">
                {{props.value}}
              </div>
          </q-td> 
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { QPage, QBtnGroup, QBtn, QTable, QTd, QInput } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import { toastError } from '../utils/util'

export default {
  name: 'Contract',
  components: {
    QPage,
    QBtnGroup,
    QBtn,
    QTable,
    QTd,
    QInput
  },
  data() {
    return {
      searchStr: '',
      type: 1,
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
          name: 'vmVersion',
          required: true,
          label: this.$t('VERSION'),
          align: 'center',
          field: 'vmVersion'
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
  mounted() {
    this.getContractsFunc()
  },
  methods: {
    ...mapActions(['getContracts', 'getContractDetail']),
    async request(props) {
      await this.getContractsFunc(props.pagination, props.filter)
    },
    async getContractsFunc(pagination = {}, filter = '') {
      let limit = pagination.rowsPerPage || this.pagination.rowsPerPage
      let pageNo = pagination.page || this.pagination.page
      let params = {
        limit: limit,
        offset: (pageNo - 1) * limit
      }
      if (this.type === 0) params.owner = this.address
      let res = await this.getContracts(params)
      if (res.success) {
        this.contracts = res.contracts
        this.pagination.rowsNumber = res.count
      }
    },
    changeType(type) {
      this.type = type
      this.getContractsFunc()
    },
    viewAccountInfo(row) {
      this.$root.$emit('openAccountModal', row.address)
    },
    open(row) {
      this.$router.push('/contractDetail/' + row.name)
    },
    newContract() {
      this.$router.push('/postContract')
    },
    async search() {
      let name = this.searchStr
      if (name) {
        let res = await this.getContractDetail({
          name
        })
        if (res.success) {
          this.$router.push('/contractDetail/' + name)
        } else {
          toastError(this.$t('ERR_CONTRACT_NOT_EXIST'))
        }
      } else {
        toastError(this.$t('ERR_CONTRACT_NOT_EXIST'))
      }
      this.searchStr = ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    },
    address() {
      return this.user.account.address
    },
    searchIcon() {
      const deleteIcon = {
        icon: 'close',
        handler: () => (this.searchStr = ''),
        content: true
      }
      const searchIcon = {
        icon: 'search',
        handler: () => this.search,
        content: true
      }
      return this.searchStr ? [deleteIcon, searchIcon] : [searchIcon]
    }
  },
  watch: {
    userInfo(val) {
      this.getContractsFunc()
    }
  }
}
</script>

<style lang="stylus" scoped>
.contract-container {
  padding: 20px;
}

.inner-btn {
  outline: none;
  background-color: rgba(0, 0, 0, 0);
  position: relative;
  height: 57px;
  width: 188px;
  font-size: 20px;
  padding: 6px 12px;
  cursor: pointer;
  border-top: none;
  border-left: none;
  border-right: 1px solid #e0e1e5;
  border-bottom: 1px solid #ffffff;
}

.selected {
  bottom: -1px;
}

.top-bar {
  border-bottom: 1px solid #e0e1e5;
}

.pos {
  top: 10px;
  right: 40px;
  height: 36px;
  padding: 0px 30px;
}

.contract-search {
  top: 10px;
  right: 40px;
  width: 300px;
  height: 36px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 22px;
  border: 1px solid #ccc;
}
</style>
