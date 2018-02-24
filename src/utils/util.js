import { SessionStorage, Notify, Dialog } from 'quasar'

export const alertMsg = (content, duration = 500) => {
  this.$q.notify({
    enter: 'bounceInRight',
    leave: 'bounceOutRight',
    color: 'red',
    icon: 'warning',
    html: content,
    duration: duration,
    position: 'top'
  })
}
export const confirm = (conf, cancel = () => {}, confirm = () => {}) => {
  Dialog.create({
    title: conf.title || 'Confirm',
    message: conf.message,
    ok: conf.confirm || 'Agree',
    cancel: conf.cancel || 'Disagree'
  })
    .then(() => {
      confirm()
    })
    .catch(() => {
      cancel()
    })
}
export const toastError = message => {
  const type = 'negative'
  const color = 'positive'
  Notify.create({ message, type, color })
}
export const toastWarn = message => {
  const type = 'warning'
  const color = 'warning'
  Notify.create({ message, type, color })
}
// export const toastInfo = message => {
//   Notify.create.warning(message)
// }

export const setCache = (key, value) => {
  return SessionStorage.set(key, value)
}
export const getCache = key => {
  return SessionStorage.get.item(key)
}
export const removeCache = key => {
  return SessionStorage.remove()
}
