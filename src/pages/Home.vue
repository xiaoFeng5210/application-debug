<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watchEffect, onBeforeMount, onBeforeUnmount } from "vue"
import usePressEvent from '@/composables/press';
import { useRobotControlService } from '@/stores/robotControlService'
import Rotation from "@/components/rotation.vue";
import { useRouter } from 'vue-router';

const imgWidth = 0;
const renderCmd = ref({})
let timer: NodeJS.Timer | null = null;

const robotStatus = ref<any>({
  // "机器人状态": "启动中",
  // "电机状态": "启动中",
})
// 手动自动区分
const startAuto = ref(true)
const startManual = ref(false)
const autoButtonStyle = computed(() => startAuto.value ? 'success' : 'default')
const manualButtonStyle = computed(() => startManual.value ? 'success' : 'default')
const { pressStart, pressEnd } = usePressEvent();
const {
  moveToPosition, updatePosition, moveByStep, backToOrigin, pointListClient,
  stopRobot, startRobot, teachMode, endTeachMode, confirmSavePosition, getCmds, autoMode, getSystemstatus, manualMode
} = useRobotControlService();

const handleManualMode = async () => {
  startManual.value = true
  startAuto.value = false
  await manualMode()
  await getConfig()
}

const handleAutoMode = async () => {
  startAuto.value = true
  startManual.value = false
  await autoMode()
  await getConfig()
}

onBeforeMount(() => {
  getConfig()
  pollGetStatus()
})

onBeforeUnmount(() => {
  clearTimer()
})


const getConfig = async () => {
  const response: any = await pointListClient()
  startAuto.value = response.mode === "auto"
  startManual.value = response.mode === "manual"
}

const getStatus = async () => {
  const response = await getSystemstatus();
  const data = response?.data;
  if (data) {
    robotStatus.value = data;
  }
}
const pollGetStatus = async () => {
  clearTimer()
  timer = setInterval(async () => {
    await getStatus()
  }, 1000)
}

// const getCmdButtons = async () => {
//   const response = await getCmds();
//   if (response) {
//     renderCmd.value = response
//   }
// }
const moveTo = async (param: string) => {
  const request = {
    cmd: 'move_to_position',
    param
  };
  await moveToPosition(request)
}
const fineTurning = async (direction: string) => {
  await moveByStep(direction);
}

// 区分手机端和PC端
const isMobile = computed(() => {
  const userAgentInfo = navigator.userAgent;
  const Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  let flag = false;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = true;
      break;
    }
  }
  return flag;
})
const styleComputed = computed(() => {
  return {
    fontSize: isMobile.value ? '1rem' : '2rem'
  }
})
const router = useRouter()
const handleSettings = () => {
  router.push('/settings')
}

function clearTimer() {
  if (timer) {
    clearInterval(timer as any)
    timer = null
  }
}
</script>

<template>
  <div class="g_box background">
    <div class="control_area">
      <div class="header">
        <div class="test_run">
          <van-cell v-for="(value, key) in robotStatus" :title="key" :label="value" />
        </div>
        <div class="control_button_control">
          <van-button :type="autoButtonStyle" style="margin-right: 1rem;" :style="styleComputed"
            @click="handleAutoMode">自动模式</van-button>
          <van-button :type="manualButtonStyle" @click="handleManualMode" :style="styleComputed">手动模式</van-button>
          <van-button type="primary" style="margin-left: 1rem;" @click="handleSettings"
            :style="styleComputed">参数设置</van-button>
        </div>
      </div>

      <div class="main">
        <div class="up_down">
          <div class="up control_button" @touchstart="pressStart($event, 'up')" @touchend="pressEnd()"
            @mousedown="pressStart($event, 'up')" @mouseup="pressEnd()" @click="fineTurning('up')">
            <img style="transform: rotate(90deg);" src="/image/left_button.png" :width="imgWidth" alt="">
            <span>上移</span>
          </div>
          <div class="down control_button" @touchstart="pressStart($event, 'down')" @touchend="pressEnd()"
            @mousedown="pressStart($event, 'down')" @mouseup="pressEnd()" @click="fineTurning('down')">
            <img src="/image/left_button.png" style="transform: rotate(-90deg);" :width="imgWidth" alt="">
            <span>下移</span>
          </div>
        </div>
        <div class="left_right">
          <div class="button_group">
            <div class="advance control_button" @touchstart="pressStart($event, 'forward')" @touchend="pressEnd()"
              @mousedown="pressStart($event, 'forward')" @mouseup="pressEnd()" @click="fineTurning('forward')">
              <img src="/image/left_button.png" :width="imgWidth" style="transform: rotate(90deg);" alt="">
              <span>前移</span>
            </div>

            <div class="left control_button" @touchstart="pressStart($event, 'left')" @touchend="pressEnd()"
              @mousedown="pressStart($event, 'left')" @mouseup="pressEnd()" @click="fineTurning('left')">
              <img src="/image/left_button.png" :width="imgWidth" alt="">
              <span>左移</span>
            </div>

            <div class="rotation_box rotation">
              <Rotation />
            </div>

            <div class="right control_button" @touchstart="pressStart($event, 'right')" @touchend="pressEnd()"
              @mousedown="pressStart($event, 'right')" @mouseup="pressEnd()" @click="fineTurning('right')">
              <img src="/image/right_button.png" :width="imgWidth" alt="">
              <span>右移</span>
            </div>
            <div class="back_control control_button" @touchstart="pressStart($event, 'backward')" @touchend="pressEnd()"
              @mousedown="pressStart($event, 'backward')" @mouseup="pressEnd()" @click="fineTurning('backward')">
              <img src="/image/left_button.png" style="transform: rotate(-90deg);" :width="imgWidth" alt="">
              <span>后移</span>
            </div>
          </div>
        </div>
      </div>


      <div class="footer">
        <van-button type="danger" @click="stopRobot" :style="styleComputed">急 停</van-button>
        <van-button type="primary" @click="startRobot" :style="styleComputed">启 动</van-button>
        <van-button type="default" @click="backToOrigin" :style="styleComputed">回原点</van-button>
        <van-button type="primary" @click="teachMode" :style="styleComputed">示 教</van-button>
        <van-button type="warning" @click="endTeachMode" :style="styleComputed">停止示教</van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/app.scss';
</style>
