<template>
  <div class="peers-container self-center">
    <div class="padding-20 bg-white border-r-6">
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <div class="col-12">
          <q-table :data="peers" :filter="filter" color="secondary" row-key="ip" :columns="columns" @request="request" :pagination.sync="pagination" :loading="loading" :title="$t('PEER_LIST')" :rows-per-page-options="[10]">
  
            <template slot="top-right" slot-scope="props">
                <q-toggle v-model="official" color="secondary"  />
</template>
           
          <q-td slot="body-cell-ip"  slot-scope="props" :props="props">
            <div>
              {{props.value}}
            </div>
          </q-td>
          <q-td slot="body-cell-address"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="viewAccountInfo(props.row)">
              {{props.value}}<q-icon v-if="isCurrentServer(props)" name="check circle" color="positive"/>
            </div>
          </q-td>
          <q-td slot="body-cell-username"  slot-scope="props" :props="props">
            <div>
              {{props.value}} <q-icon v-if="props.row.voted" name="check circle" color="positive"/>
            </div>
          </q-td>
          <q-td slot="body-cell-opt"  slot-scope="props" :props="props">
            <q-btn @click="changePeer(props.row)" icon="playlist add check" size="sm" flat :color="isCurrentServer(props)?'positive':'secondary'" >
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('CHANGE_TO')}}</q-tooltip>
            </q-btn>
          </q-td>
          <q-td slot="body-cell-ping"  slot-scope="props" :props="props">
            {{props.value}}
          </q-td>
        </q-table>
      </div>
      </transition>
    </div>
  
      
</div>
</template>

<script>
import { api } from '../utils/api'
import { officialPeers } from '../utils/constants'
import { setCache, getCache, toast } from '../utils/util'
import axios from '../utils/axiosWrap'
import { QTd, QBtn, QTooltip, QIcon, QTable, QToggle } from 'quasar'

export default {
  props: ['userObj'],
  components: {
    QTd,
    QBtn,
    QTooltip,
    QIcon,
    QTable,
    QToggle
  },
  data() {
    return {
      peers: [],
      filter: '',
      loading: false,
      official: false,
      pagination: {
        page: 1,
        rowsNumber: '',
        rowsPerPage: 10
      }
    }
  },
  async mounted() {
    if (this.user) {
      this.getPeers()
    }
  },
  methods: {
    async request(props) {
      await this.getPeers(props.pagination, props.filter)
    },
    async getPeers(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await api.peer({
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      this.peers = res.peers
      // set max
      this.pagination.rowsNumber = res.totalCount
      this.loading = false
      return res
    },
    viewPeerInfo() {},
    getPing() {
      this.peers.map((peer, index) => {
        let url = 'http://' + peer.ip + ':' + peer.port + '/api/blocks/getHeight'
        let starttime = new Date().getTime()
        axios
          .get(url)
          .then(res => {
            if (res.success) {
              let ping = new Date().getTime() - starttime
              peer.ping = ping
              this.peers[index] = peer
            }
          })
          .catch(error => {
            peer.ping = '--'
            this.peers[index] = peer
            console.log(error)
          })
      })
    },
    isCurrentServer(props) {
      return (
        this.currentServer &&
        props.row.ip === this.currentServer.ip &&
        props.row.port === this.currentServer.port
      )
    },
    changePeer(peer) {
      const { ping } = peer
      if (ping > 0 && ping < 1000) {
        setCache('currentServer', peer)
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        this.$router.push({
          name: 'home'
        })
      } else {
        this.$q
          .dialog({
            title: 'Confirm',
            // message: 'Peer is not stable, still want change?',
            message: 'Change server?',
            ok: 'Yes',
            cancel: 'No'
          })
          .then(() => {
            setCache('currentServer', peer)
            toast(this.$t('INF_OPERATION_SUCCEEDED'))
            this.$router.push({
              name: 'home'
            })
          })
          .catch(e => {
            // console.log(e)
          })
      }
    }
  },
  computed: {
    user() {
      return this.userObj
    },
    columns() {
      let defaultCol = [
        {
          name: 'ip',
          label: 'IP',
          field: 'ip',
          align: 'center',
          format: val => {
            let ips = val.split('.')
            ips[0] = ips[1] = '*'
            return ips.join('.')
          }
        },
        {
          name: 'state',
          label: 'state',
          field: 'state'
        },
        {
          name: 'version',
          label: this.$t('VERSION'),
          field: 'version'
        },

        {
          name: 'os',
          label: this.$t('OPERATING_SYSTEM'),
          field: 'os'
        }
      ]
      let officialCol = [
        {
          name: 'opt',
          label: this.$t('OPERATION'),
          field: 'port',
          align: 'left'
        },
        {
          name: 'ip',
          label: 'IP',
          field: 'ip',
          align: 'center',
          format: val => {
            let ips = val.split('.')
            ips[0] = ips[1] = '*'
            return ips.join('.')
          }
        },
        {
          name: 'port',
          label: 'PORT',
          field: 'port',
          align: 'center'
        }
      ]
      return this.official ? officialCol : defaultCol
    },
    currentServer() {
      let currentServer = getCache('currentServer')
      if (currentServer) {
        return currentServer
      } else {
        return null
      }
    }
  },
  watch: {
    userObj(val) {
      if (val) {
        this.getPeers()
      }
    },
    official(val) {
      if (val) {
        this.peers = officialPeers
        // this.getPing()
      } else {
        this.getPeers()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.peers-container {
  padding: 20px;
  display: none;
}
</style>