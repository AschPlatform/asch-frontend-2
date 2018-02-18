import { Alert, Dialog, Toast } from 'quasar'

export const alertMsg = (content, duration = 500) => {
  Alert.create({
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
export const toastError = key => {
  Toast.create.warning(this.$t(key))
}
