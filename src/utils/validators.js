import { withParams } from 'vuelidate/lib/validators/common.js'
import Bip39 from 'bip39'

// bip 39 validator
export const bip39 = () => {
  return withParams({ type: this.bip39 }, value => {
    return Bip39.validateMnemonic(value)
  })
}
