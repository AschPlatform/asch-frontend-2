import AschJs from 'asch-js'
import Bip39 from 'bip39'
import { BigNumber } from 'bignumber.js'

export const getPub = secret => AschJs.crypto.getKeys(secret).publicKey
export const getAddr = secret => AschJs.crypto.getAddress(secret)
export const createLock = (lockHeight, secret, secondpassword) =>
  AschJs.transaction.createLock(lockHeight, secret, secondpassword)
export const signature = (secret, secondpassword = '') =>
  AschJs.signature.createSignature(secret, secondpassword)
export const createFlags = (currency, flagType, flag, secret, secondPassword = '') =>
  AschJs.uia.createFlags(currency, flagType, flag, secret, secondPassword)
export const createIssuer = (name, desc, secret, secondPassword = '') =>
  AschJs.uia.createIssuer(name, desc, secret, secondPassword)
export const createIssue = (name, realAmount, secret, secondPassword = '') =>
  AschJs.uia.createIssue(name, String(realAmount), secret, secondPassword)
export const createAcl = (currency, operator, flag, list, secret, secondPassword = '') =>
  AschJs.uia.createAcl(currency, operator, flag, list, secret, secondPassword)
export const createAsset = (
  name,
  desc,
  realMaximum,
  precision,
  strategy,
  allowWriteoff,
  allowWhitelist,
  allowBlacklist,
  secret,
  secondPassword = ''
) =>
  AschJs.uia.createAsset(
    String(name),
    String(desc),
    String(realMaximum),
    precision,
    strategy,
    allowWriteoff,
    allowWhitelist,
    allowBlacklist,
    secret,
    secondPassword
  )

export const generateM = () => Bip39.generateMnemonic()
export const fullTimestamp = timestamp => AschJs.utils.format.fullTimestamp(timestamp)
export const convertFee = (fee, precision = 8) => {
  if (!fee) {
    return 0
  }
  fee = fee.toString()

  while (fee.length < 9) {
    fee = '0'.concat(fee)
  }

  fee = fee.slice(0, -8).concat('.', fee.slice(-8))

  var clearView = false

  while (!clearView) {
    if (fee[fee.length - 1] === '0') {
      fee = fee.slice(0, fee.length - 1)
    } else {
      clearView = true
    }
  }

  if (fee[fee.length - 1] === '.') {
    fee = fee.slice(0, fee.length - 1)
  }
  return fee
}
export const dealBigNumber = num => {
  let dealNumB = new BigNumber(num)
  let dealNum = dealNumB.toFormat(0).toString()
  return dealNum.replace(/,/g, '')
}
