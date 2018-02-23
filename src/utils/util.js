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
    buttons: [
      {
        label: conf.cancel || 'Disagree',
        handler() {
          cancel()
        }
      },
      {
        label: conf.confirm || 'Agree',
        handler() {
          confirm()
        }
      }
    ]
  })
}
export const toastError = message => {
  Notify.create(message)
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
