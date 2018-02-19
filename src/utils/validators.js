import { withParams } from 'vuelidate/lib/validators/common.js'
import Bip39 from 'bip39'

export const secondPwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
// bip 39 validator
export const bip39 = () => {
  return withParams({ type: this.bip39 }, value => {
    return Bip39.validateMnemonic(value)
  })
}

// export const secondPwd = secondPub => {
//   return withParams({ type: 'secondPwd', secondPub }, value => {
//     console.log(secondPub)
//     return secondPub ? secondPwdReg.test(value) : true
//   })
// }
