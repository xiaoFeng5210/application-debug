<script lang="ts" setup>
import { FloatFormatter } from '@/utils/common'
import { ref, onMounted, computed } from 'vue';
import { setParams } from '@/api/robot'
import { showNotify } from 'vant';
import { useRouter } from 'vue-router';
import { getPointList, fetchPointsActions } from '@/api/robot';


const form = ref({
  step: 0, // 手动移动步进值  单位mm 0～20
  continuous_speed: 0, // 手动移动速度 单位 m/s 0~1浮点数2位小数
  forward_limit: 0, // 前进限位 mm 0～100

  // 以下系数值 0-100  浮点数2位小数
  movespeed_coefficient: 0, // 自动移动速度系数 
  moveacc_coefficient: 0, // 自动移动加速度系数
  movex_coefficient: 0, // 自动移动X轴系数
  movey_coefficient: 0, // 自动移动Y轴系数
  rotate_rightleft_coefficient: 0, // 自动旋转X轴系数
  rotate_updown_coefficient: 0 // 自动旋转Y轴系数
})

const pointList = ref<{
  display_name: string
  name: string
}[]>([])


const pointsActions = ref<{
  [key: string]: { name: string }
}>({})

const init = async () => {
  try {
    const response = await getPointList()
    const data = (response?.data) as any
    if (data) {
      form.value = {
        step: data?.step ?? 0,
        continuous_speed: data?.continuous_speed ?? 0,
        forward_limit: data?.forward_limit ?? 0,

        movespeed_coefficient: data?.movespeed_coefficient ?? 0,
        moveacc_coefficient: data?.moveacc_coefficient ?? 0,
        movex_coefficient: data?.movex_coefficient ?? 0,
        movey_coefficient: data?.movey_coefficient ?? 0,
        rotate_rightleft_coefficient: data?.rotate_rightleft_coefficient ?? 0,
        rotate_updown_coefficient: data?.rotate_updown_coefficient ?? 0,
      }
      pointList.value = data?.point_list?.data ?? []
      currentPoint.value = pointList.value[0]?.name ?? ''
      pointsActions.value = data?.point_list?.cmd_data ?? {}
    }
  }
  catch {
    showNotify({
      message: '获取参数失败, 请刷新当前页面',
      duration: 3000
    })
  }
}

onMounted(() => {
  init()
})

function validateFloat(value: number) {
  const floatValue = value.toString().split('.')[1]
  if (floatValue && floatValue.length > 2) {
    return false
  }
  return true
}

const submitLoading = ref(false)

const onSubmit = async () => {
  if (submitLoading.value) {
    return
  }
  submitLoading.value = true
  const data = {}
  for (const key in form.value) {
    data[key] = Number(form.value[key])
  }
  try {
    await setParams(data)
    showNotify({
      message: '设置成功',
      type: 'success',
      duration: 3000
    })
  }
  catch {
    showNotify({
      message: '设置失败',
      type: 'danger',
      duration: 3000
    })
  }
  finally {
    submitLoading.value = false
  }
}
const router = useRouter()
function navigateBack() {
  router.push({ name: 'Home' })
}
const tabActive = ref(0)
const currentPoint = ref('')
const pointOptions = computed(() => {
  return pointList.value.map((item) => ({
    text: item.display_name,
    value: item.name
  }))
})


const pointCMD = async (cmd: string) => {
  try {
    const res = await fetchPointsActions(currentPoint.value, cmd)
    if (res?.data?.code === 0) {
      showNotify({
        message: '操作成功',
        type: 'success',
        duration: 3000
      })
    } else {
      showNotify({
        message: '操作失败, code码不为0',
        type: 'danger',
        duration: 3000
      })
    }

  } catch {
    showNotify({
      message: '操作失败, 网络通讯异常，请检查网络后重试',
      type: 'danger',
      duration: 3000
    })
  }

}

const cmdButtonsType = computed(() => (cmd: string) => {
  if (cmd === 'save_position') {
    return 'success'
  }
  if (cmd === 'move_to_position') {
    return 'primary'
  }
  if (cmd === 'backhome') {
    return 'default'
  }
  return 'primary'
})
</script>

<template>
  <div class="background p-2">
    <div class="flex items-center" @click="navigateBack">
      <div class="p-2">
        <van-icon name="arrow-left" class="text-white text-4xl " />
      </div>
      <span class="text-3xl font-bold text-white">设置</span>
    </div>

    <van-tabs v-model:active="tabActive">
      <van-tab title="参数设置" :name="0">
        <div class="w-full h-[85vh] overflow-y-auto pt-[2vw]">
          <van-form label-width="35vw" class=" w-full" @submit="onSubmit" :validate-trigger="['onChange', 'onBlur']">
            <van-cell-group inset>
              <van-field v-model="form.step" name="手动移动步进值" type="digit" label="手动移动步进值" placeholder="手动移动步进值" :min="0"
                :max="20" :rules="[{ required: true, message: '请填写手动移动步进值' }, {
                  validator: (value) => {
                    if (value > 20 || value < 0) {
                      return false
                    }
                    return true
                  },
                  message: '手动移动步进值不能大于20'
                }]">
                <template #extra>
                  <span class="text-gray-500">mm</span>
                </template>
              </van-field>

              <van-field v-model="form.continuous_speed" name="手动移动速度" type="number" label="手动移动速度" placeholder="手动移动速度"
                :min="0" :max="1" :rules="[{ required: true, message: '请填写手动移动速度' }, {
                  validator: (value) => {
                    if (value > 1 || value < 0) {
                      return false
                    }
                    if (!validateFloat(value)) {
                      return false
                    }
                    return true
                  },
                  message: '手动移动速度应在0-1之间，小数点后最多两位'
                }]">
                <template #extra>
                  <span class="text-gray-500">m/s</span>
                </template>
              </van-field>

              <van-field v-model="form.forward_limit" name="前进限位" type="digit" label="往前限制距离参数" placeholder="前进限位"
                :min="0" :max="500" :rules="[{ required: true, message: '请填写往前限制距离参数' }, {
                  validator: (value) => {
                    if (value > 500 || value < 0) {
                      return false
                    }
                    return true
                  },
                  message: '往前限制距离参数应在0-500之间的整数'
                }]">
                <template #extra>
                  <span class="text-gray-500">mm</span>
                </template>
              </van-field>

              <!-- movespeed_coefficient -->

              <van-field v-model="form.movespeed_coefficient" name="自动移动速度系数" type="number" label="自动移动速度系数"
                placeholder="自动移动速度系数" :min="0" :max="100" :rules="[{ required: true, message: '请填写自动移动速度系数' }, {
                  validator: (value) => {
                    if (value > 100 || value < 0) {
                      return false
                    }
                    const floatValue = value.toString().split('.')[1]
                    if (floatValue && floatValue.length > 2) {
                      return false
                    }
                    return true
                  },
                  message: '自动移动速度系数应在0-100之间，小数点后最多两位'
                }]">
              </van-field>

              <!-- moveacc_coefficient -->
              <van-field v-model="form.moveacc_coefficient" name="自动移动加速度系数" type="number" label="自动移动加速度系数"
                placeholder="自动移动加速度系数" :min="0" :max="100" :rules="[{ required: true, message: '请填写自动移动加速度系数' }, {
                  validator: (value) => {
                    if (value > 100 || value < 0) {
                      return false
                    }
                    if (!validateFloat(value)) {
                      return false
                    }
                    return true
                  },
                  message: '自动移动加速度系数应在0-100之间，小数点后最多两位'
                }]">
              </van-field>

              <!-- movex_coefficient -->
              <van-field v-model="form.movex_coefficient" name="自动左右移动系数" type="number" label="自动左右移动系数"
                placeholder="自动左右移动系数" :min="0" :max="100" :rules="[{ required: true, message: '请填写自动左右移动系数' }, {
                  validator: (value) => {
                    if (value > 100 || value < 0) {
                      return false
                    }
                    if (!validateFloat(value)) {
                      return false
                    }
                    return true
                  },
                  message: '自动左右移动系数应在0-100之间，小数点后最多两位'
                }]">
              </van-field>

              <!-- movey_coefficient -->
              <van-field v-model="form.movey_coefficient" name="自动上下移动系数" type="number" label="自动上下移动系数"
                placeholder="自动上下移动系数" :min="0" :max="100" :rules="[{ required: true, message: '请填写自动上下移动系数' }, {
                  validator: (value) => {
                    if (value > 100 || value < 0) {
                      return false
                    }
                    if (!validateFloat(value)) {
                      return false
                    }
                    return true
                  },
                  message: '自动上下移动系数应在0-100之间，小数点后最多两位'
                }]">
              </van-field>

              <!-- rotate_rightleft_coefficient -->
              <van-field v-model="form.rotate_rightleft_coefficient" name="自动左右旋转幅度系数" type="number" label="自动左右旋转幅度系数"
                placeholder="自动左右旋转幅度系数" :min="0" :max="100" :rules="[{ required: true, message: '请填写自动左右旋转幅度系数' }, {
                  validator: (value) => {
                    if (value > 100 || value < 0) {
                      return false
                    }
                    if (!validateFloat(value)) {
                      return false
                    }
                    return true
                  },
                  message: '自动左右旋转幅度系数应在0-100之间，小数点后最多两位'
                }]">
              </van-field>

              <!-- rotate_updown_coefficient -->
              <van-field v-model="form.rotate_updown_coefficient" name="自动上下旋转幅度系数" type="number" label="自动上下旋转幅度系数"
                placeholder="自动上下旋转幅度系数" :min="0" :max="100" :rules="[{ required: true, message: '请填写自动上下旋转幅度系数' }, {
                  validator: (value) => {
                    if (value > 100 || value < 0) {
                      return false
                    }
                    if (!validateFloat(value)) {
                      return false
                    }
                    return true
                  },
                  message: '自动上下旋转幅度系数应在0-100之间，小数点后最多两位'
                }]">
              </van-field>

            </van-cell-group>

            <div style="margin: 16px;">
              <van-button round block type="success" native-type="submit" :loading="submitLoading">
                提交
              </van-button>
            </div>
          </van-form>
        </div>
      </van-tab>

      <van-tab title="点位设置" :name="1">
        <div class="w-full h-[85vh] overflow-y-auto pt-[2vw]">
          <van-dropdown-menu>
            <van-dropdown-item v-model="currentPoint" :options="pointOptions" />
          </van-dropdown-menu>
          <div class="full grid grid-cols-2 gap-2 mt-[1rem]">
            <van-button :type="cmdButtonsType(k as string)" block @click="pointCMD(k)" v-for="(v, k) in pointsActions"
              :key="k">
              {{ v.name }}
            </van-button>

          </div>
        </div>
      </van-tab>

    </van-tabs>



  </div>
</template>

<style lang="scss" scoped>
.background {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #14b8a6, #4c1d95),
    /* 柔和的渐变背景 */
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0, rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent 20px),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0, rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent 20px);
  background-size: 100% 100%, 100% 20px, 20px 20px;
}
</style>
