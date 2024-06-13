import {defineStore} from 'pinia'
import {baseActions, getConfig, getDeviceFunctionList, getDeviceStatus, maintain, setConfig} from '@/api/robot.ts'
import type {Config, DeviceStatus, FunctionList} from '@/api/robot'
import {showNotify} from 'vant';

interface State {
  actions: Partial<FunctionList>,
  status: DeviceStatus,
  config: Config
}

export const useSettingStore = defineStore('setting', {
  state: (): State => ({
    actions: {},
    status: {},
    config: {
      'password': '1234',
      // mod: localStorage.getItem('mod') !== 'tradition',
      mod: true,
    }
  }),
  getters: {},
  actions: {
    async getConfigGlobal() {
      const {data} = await getConfig().catch(message => {
        console.log(message)
      });
      if (data.code === 0) {
        Object.assign(this.config, data.data)
      }
    },
    async setConfigGlobal(config: Record<string, any>) {
      const {data} = await setConfig(config).catch(message => {
        console.log(message)
      });
      if (data.code === 0) {
        Object.assign(this.config, data.data)
      }
    },
    async getDeviceStatusGlobal() {
      const {data} = await getDeviceStatus().catch(message => {
        throw new Error(message)
      });
      if (data.code === 0) {
        this.status = data.data
      }
    },
    async getSettingGlobal() {
      const {data} = await getDeviceFunctionList().catch(message => {
        showNotify({type: 'danger', message: '获取功能列表失败'})
        throw new Error(message)
      });
      if (data.code === 0) {
        this.actions = data.data
      } else {
        showNotify({type: 'danger', message: "获取功能列表失败"})
        throw new Error("获取功能列表失败")
      }
    },
    async doCmd(cmd: any) {
      await maintain({cmd})
      await maintain({cmd: 'pre_check_status'})
    },
    async action(cmd: any) {
      const {data} = await baseActions({cmd}).catch(message => {
        showNotify({type: 'danger', message: '操作失败'})
        throw new Error(message)
      });
      if (data.code === 0) {
      } else {
        showNotify({type: 'danger', message: "操作失败"})
        throw new Error("操作失败")
      }
    }
  }
})
