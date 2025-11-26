import { ref } from 'vue'

const toastState = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 3000
})

export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    toastState.value = {
      show: true,
      message,
      type,
      duration
    }
  }

  const hideToast = () => {
    toastState.value.show = false
  }

  return {
    toastState,
    showToast,
    hideToast
  }
}

