import { onMounted, onUnmounted, ref } from 'vue'
import { useRobotControlService } from '@/stores/robotControlService';

const usePressEvent = () => {
  const { moveByLongPress, stopMove, rotateByLongPress } = useRobotControlService()

  let timer: NodeJS.Timeout | null = null

  let longPressTimer: NodeJS.Timeout | null = null
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

  const clearLongPressTimer = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
  }

  // 因为在长按的持续时间内，需要不断的发送指令（目前是长按时候每2s调用一次），所以需要一个长按的控制函数
  const longPressControl = (type: string, direction: string) => {
    clearLongPressTimer()
    longPressTimer = setInterval(async () => {
      if (isLongPressing.value) {
        console.log("执行中")
        // 长按时候的操作
        if (type === 'rotate') {
          await rotateByLongPress(direction)
        } else {
          await moveByLongPress(direction)
        }
      } else {
        console.log("执行结束")
        clearLongPressTimer()
      }
    }, 2000)
  }

  const pressStart = (e: any, direction: string, type?: string) => {
    // e.preventDefault()
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(async () => {
      if (isLongPressing.value) return
      isLongPressing.value = true
      // 开始长按
      if (type === 'rotate') {
        await rotateByLongPress(direction)
        longPressControl('rotate', direction)
      } else {
        await moveByLongPress(direction)
        longPressControl('move', direction)
      }
    }, 400)
  }

  const pressEnd = () => {
    clearLongPressTimer()
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (isLongPressing.value) {
      console.log('停止运动')
      isLongPressing.value = false
      stopMove()
    }
  }

  return {
    pressStart,
    pressEnd,
  }
}

export default usePressEvent
