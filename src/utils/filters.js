import AschJs from 'asch-js'
import { convertFee } from './asch'
export default {
  t: (value, t) => {
    return t(value)
  },
  fee: (fee, precision = 8) => {
    return convertFee(fee)
  },
  time: value => {
    return AschJs.utils.format.fullTimestamp(value)
  }
}
