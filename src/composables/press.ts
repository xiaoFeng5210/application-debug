import { onMounted, onUnmounted, ref } from 'vue'
import { useRobotControlService } from '@/stores/robotControlService';

const usePressEvent = () => {
  const { moveByLongPress, stopMove } = useRobotControlService()

  let timer: NodeJS.Timeout | null = null
  const isLongPressing = ref(false)

  onMounted(() => {
    document.oncontextmenu = function () {
      return false
    }
    const doms = document.getElementsByClassName('control_button')
    if (doms) {
      Array.from(doms).forEach((dom: any) => {
        dom.addEventListener('touchstart', (event: TouchEvent) => {
          dom.style.opacity = '0.5'
          dom.style.scale = '0.9'
        })
        dom.addEventListener('touchend', (event: TouchEvent) => {
          dom.style.opacity = '1'
          dom.style.scale = '1'
        })
      })
    }
  })

  onUnmounted(() => {
    document.oncontextmenu = null
  })

  const pressStart = (e: any, direction: string) => {
    // e.preventDefault()
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(async () => {
      if (isLongPressing.value) return
      isLongPressing.value = true
      // 开始长按
      console.log('长按')
      await moveByLongPress(direction)
    }, 400)
  }

  const pressEnd = () => {
    isLongPressing.value = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    setTimeout(() => {
      stopMove()
    }, 500)
  }

  return {
    pressStart,
    pressEnd,
  }
}

export default usePressEvent
