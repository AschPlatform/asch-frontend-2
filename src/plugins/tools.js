import _ from 'lodash'
import { Platform } from 'quasar'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype._ = _
  Vue.prototype.isDesk = Platform.is.desktop
}
