import { defineStore } from 'pinia'
import {
  debugClient,
  type DebugPamrams,
  type DebugRequest,
  getLightsTimeRange,
  getParams,
  getPointList,
  getRobotStatus,
  maintainClient,
  saveParams
} from '@/api/robot'
import { showNotify } from 'vant';


export const useRobotControlService = defineStore('robotControlService', {
  state: () => ({
    isTeachingMode: false,
  }),
  actions: {
    async getSystemstatus() {
      return await getRobotStatus().catch(() => {
        return
      })
    },
    async pointListClient() {
      const response = await getPointList().catch(error => {
        // showNotify({type: 'danger', message: '获取点位列表失败'})
        return undefined;
      })
      // Add type assertion here
      return response?.data
    },
    async getCmds() {
      const response = await getPointList().catch(error => {
      })
      const data = response?.data;
      if (data && data.code === 0) {
        return data.cmd_data
      } else {
        showNotify({ type: 'danger', message: '获取cmd失败' })
        return undefined
      }

    },
    // 测试运行
    async testRun() {
      const response = await debugClient({ cmd: 'test_product' } as any).catch(error => {
        showNotify({ type: 'danger', message: '测试运行失败' })
        return
      })
      const data = response?.data;
      if (data && data.code === 0) {
        showNotify({ type: 'success', message: '正在测试运行' })
      } else {
        showNotify({ type: 'danger', message: data!.errmsg ?? '运行失败' })
      }
    },
    async postureMove(request: DebugRequest) {
      const response = await debugClient(request).catch(error => {
        showNotify({ type: 'danger', message: '操作失败' })
        return
      })
      showNotify({ type: "success", message: '操作成功' })
    },
    // 移动到点
    async moveToPosition(request: DebugRequest) {
      const response = await debugClient(request).catch(error => {
        showNotify({ type: 'danger', message: '移动到点失败' })
        return
      })
      const data = response?.data;
      if (data && data.code === 0) {
        showNotify({ type: 'success', message: '正在移动' })
      } else {
        showNotify({ type: 'danger', message: '移动失败' })
      }
    },
    // 更新点位
    async updatePosition(param: string): Promise<{ code: number, msg?: string }> {
      return new Promise(async (resolve, reject) => {
        const response = await debugClient({ cmd: 'save_position', param }).catch(error => {
          showNotify({ type: 'danger', message: '保存点位接口报错' })
          reject({ code: -1, msg: '保存点位接口报错' })
          return
        })
        const data = response?.data;
        if (data && data.code === 0) {
          showNotify({ type: 'success', message: '保存点位成功' })
          resolve({ code: 0 })
        } else if (data && data.code === 1) {
          resolve({ code: 1, msg: data?.errmsg ?? '与原目标位置偏差较大，确认是否保存？' })
        } else {
          showNotify({ type: 'danger', message: '保存点位失败' })
          reject({ code: -1, errmsg: '保存点位失败' })
        }
      })
    },
    // 再次确认保存点位
    async confirmSavePosition(param: string) {
      const response = await debugClient({ cmd: 'sure_save_position', param }).catch(error => {
        showNotify({ type: 'danger', message: '保存点位失败' })
        return
      })
      const data = response?.data;
      if (data && data.code === 0) {
        showNotify({ type: 'success', message: '保存点位成功' })
      } else {
        showNotify({ type: 'danger', message: '保存点位失败' })
      }
    },
    // 默认点位
    async setDefaultPosition(param: string) {
      const response = await debugClient({ cmd: 'reset_position', param }).catch(error => {
        showNotify({ type: 'danger', message: '重置默认点位失败' })
        return
      })
      const data = response?.data;
      if (data && data.code === 0) {
        showNotify({ type: 'success', message: '重置默认点位成功' })
      } else {
        showNotify({ type: 'danger', message: '重置默认点位失败' })
      }
    },
    // 点动微调
    async moveByStep(direction: string) {
      const response = await debugClient({ cmd: 'fine_tune', param: { direction, mode: 'jog' } }).catch(error => {
        showNotify({ type: 'danger', message: '微调请求失败' })
        return
      })
      const directionText = directionTextMap()[direction]
      const data = response?.data;
      if (data && data.code === 0) {
        showNotify({ type: 'success', message: `${directionText} 微调成功` })
      } else {
        showNotify({ type: 'danger', message: `${directionText} 微调失败` })
      }
    },
    // 旋转
    async rotateByStep(direction: string) {
      const response = await debugClient({ cmd: 'fine_rotate', param: { direction, mode: 'jog' } }).catch(error => {
        showNotify({ type: 'danger', message: '微调请求失败' })
        return
      })
      const directionText = rotateTextMap()[direction]
      const data = response?.data;
      if (data && data.code === 0) {
        showNotify({ type: 'success', message: `${directionText} 微调成功` })
      } else {
        showNotify({ type: 'danger', message: `${directionText} 微调失败` })
      }
    },
    // 长按微调
    async moveByLongPress(direction: string) {
      const response = await debugClient({ cmd: 'fine_tune', param: { direction, mode: 'continuous' } }).catch(error => {
        showNotify({ type: 'danger', message: '长按微调请求失败' })
        return
      })
      const directionText = directionTextMap()[direction]
      const data = response?.data;
      if (data && data.code === 0) {
        showNotify({ type: 'success', message: `${directionText} 长按微调成功` })
      } else {
        showNotify({ type: 'danger', message: `${directionText} 长按微调失败` })
      }
    },
    // 旋转长按微调
    async rotateByLongPress(direction: string) {
      const response = await debugClient({ cmd: 'fine_rotate', param: { direction, mode: 'continuous' } }).catch(error => {
        showNotify({ type: 'danger', message: '长按微调请求失败' })
        return
      })
      const directionText = rotateTextMap()[direction]
      const data = response?.data;
      if (data && data.code === 0) {
        showNotify({ type: 'success', message: `${directionText} 长按微调成功` })
      } else {
        showNotify({ type: 'danger', message: `${directionText} 长按微调失败` })
      }
    },
    // 停止运动
    async stopMove() {
      await debugClient({ cmd: 'stop_move' } as any)
    },

    // 启动机器人
    async startRobot() {
      showNotify({ type: 'success', message: '正在启动机器人' })
      await maintainClient('start_robot').catch(error => {
        showNotify({ type: 'danger', message: '启动机器人失败' })
        throw new Error('启动机器人失败')
      })
    },

    // 关闭机器人
    async stopRobot() {
      await maintainClient('stop_robot').catch(error => {
        showNotify({ type: 'danger', message: '关闭机器人失败' })
        throw new Error('关闭机器人失败')
      })
      showNotify({ type: 'success', message: '正在关闭机器人' })
    },

    // teach_mode
    async teachMode() {
      await maintainClient('teach_mode').catch(error => {
        showNotify({ type: 'danger', message: '切换示教模式失败' })
        throw new Error('切换示教模式失败')
      })
      showNotify({ type: 'success', message: '启动示教模式' })
    },
    // end_teach_mode
    async endTeachMode() {
      await maintainClient('end_teach_mode').catch(error => {
        showNotify({ type: 'danger', message: '结束示教模式' })
        throw new Error('结束示教模式失败')
      })
      showNotify({ type: 'success', message: '结束示教模式' })
    },

    // 回原点
    async backToOrigin() {
      await maintainClient('backhome').catch(error => {
        showNotify({ type: 'danger', message: '回原点失败' })
        throw new Error('回原点失败')
      })
      showNotify({ type: 'success', message: '正在返回原点' })
    },
    // 自动模式
    async autoMode() {
      await maintainClient('auto').catch(error => {
        showNotify({ type: 'danger', message: '切换自动模式失败' })
        throw new Error('切换自动模式失败')
      })
      showNotify({ type: 'success', message: '切换自动模式成功' })
    },
    // 手动模式
    async manualMode() {
      await maintainClient('manual').catch(error => {
        showNotify({ type: 'danger', message: '切换手动模式失败' })
        throw new Error('切换手动模式失败')
      })
      showNotify({ type: 'success', message: '切换手动模式成功' })
    },

    // 进入debug页面
    async entryDebugClient() {
      await maintainClient('entry_debug').catch(error => {
        showNotify({ type: 'danger', message: '进入调试模式失败' })
        throw new Error('进入调试模式失败')
      })
    },

    // 退出debug页面
    async exitDebugClient() {
      await maintainClient('exit_debug').catch(error => {
        showNotify({ type: 'danger', message: '退出调试模式失败' })
        throw new Error('退出调试模式失败')
      })
    },

    // 获取参数
    async getDebugParams() {
      const res = await getParams().catch(error => {
        showNotify({ type: 'danger', message: '获取参数失败' })
        return
      });
      const data = res?.data;
      if (data && data.code === 0) {
        return data.data;
      } else {
        showNotify({ type: 'danger', message: '获取参数失败' });
        return undefined;
      }
    },
    async saveDebugParams(param: DebugPamrams) {
      const res = await saveParams({ cmd: 'save_config_parameter', param }).catch(error => {
        showNotify({ type: 'danger', message: '保存参数失败' });
        return;
      });
      showNotify({ type: 'success', message: '保存参数成功' })
      // const data = res?.data;
      // if (data && data.code === 0) {
      //   showNotify({type: 'success', message: '保存参数成功'});
      // } else {
      //   showNotify({type: 'danger', message: '保存参数失败'});
      // }
    },
    async resetConfigParams() {
      const res = await saveParams({ cmd: 'reset_config_parameter' } as any).catch(error => {
        showNotify({ type: 'danger', message: '重置参数失败' });
        return;
      });
      const data = res?.data;
      if (data && data.code === 0) {
        showNotify({ type: 'success', message: '重置参数成功' });
        return true
      } else {
        showNotify({ type: 'danger', message: '重置参数失败' });
        return false
      }
    },
    async getLightsTimeRangeStore() {
      const res = await getLightsTimeRange().catch(error => {
        showNotify({ type: 'danger', message: '获取紫外线时间范围数据失败' })
      })
      const data = res?.data
      if (data && data.code === 0) {
        return data.data
      } else {
        return
      }
    },

    async saveLightsTimeRange(period: any) {
      const res = await debugClient({ cmd: 'save_lights_period', period } as any).catch(error => {
        showNotify({ type: 'danger', message: '保存紫外线时间范围失败' })
        return
      })
      showNotify({ type: 'success', message: '保存紫外线时间范围成功' })
    }
  },
})

function directionTextMap(): Record<string, string> {
  return {
    'up': '上移',
    'down': '下移',
    'left': '左移',
    'right': '右移',
    'forward': '前移',
    'backward': '后移'
  }
}

function rotateTextMap(): Record<string, string> {
  return {
    left: '左旋转',
    right: '右旋转',
    forward: '前旋转',
    backward: '后旋转'
  }
}
