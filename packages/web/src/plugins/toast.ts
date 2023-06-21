import Toastify from 'toastify-js'

const commonConfig = {
  newWindow: true,
  close: true,
  gravity: 'top',
  position: 'right',
  stopOnFocus: true,
  duration: 5000
}

export const successToast = (message: string) =>
  Toastify({
    text: message,
    backgroundColor: '#0B875B',
    ...commonConfig
  })
export const errorToast = (message: string) =>
  Toastify({
    text: message,
    backgroundColor: '#E13C3C',
    ...commonConfig
  })
