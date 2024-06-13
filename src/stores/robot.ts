import {defineStore} from 'pinia'
import type {Material} from '@/api'
import {getRobot} from '@/api'
import {showNotify} from 'vant';
import {t} from "@/lang"
import {CommonStatus, getInventory} from "@/api/robot";
import {useProductsStore} from './products';
import {nextTick} from "vue";

interface State {
  robotId: string
  materialTimer: NodeJS.Timer | null
  isCheckMaterial: boolean
  material: Material
  alarm: boolean
  alarmInfo: string
  maintenance: boolean
  device: { msg: string, status: CommonStatus }
}

export const useRobotStore = defineStore('robot', {
  state: (): State => ({
    robotId: '',  // 机器人设备号
    // 根据属性值来判断是否可用
    material: {},
    materialTimer: null,
    isCheckMaterial: true,
    alarm: false,
    maintenance: false,
    alarmInfo: '',
    device: {msg: '', status: CommonStatus.NORMAL}
  }),
  actions: {
    async getRobotId() {
      const {data} = await getRobot().catch(err => {
        showNotify({type: 'danger', message: t('error.500')})
        throw new Error(err)
      })
      this.robotId = data.data.id
    },
    async getRobotInventory() {
      const response = await getInventory().catch(async () => {
        await this.reset();
        return;
      })
      const {data} = response as any
      if (data?.code === 0) {
        // 这里我们赋值不希望直接修改 material，而是修改 material 的属性值
        this.material = data.data.material
        const {robot, device, material} = data.data
        this.maintenance = device?.status === CommonStatus.MAINTENANCE
        this.device = device
        if (robot.status !== CommonStatus.NORMAL || device.status !== CommonStatus.NORMAL) {
          this.alarmInfo = robot?.msg + ' ' + device?.msg
          await nextTick()
          this.alarm = true
        } else {
          this.alarmInfo = ''
          await nextTick()
          this.alarm = false
        }
        this.examineMaterial(material)
      } else {
        await this.reset();
      }
    },
    async pollRobotInventory() {
      this.clearTimer()
      this.materialTimer = setInterval(() => {
        // 有些地方不轮询
        this.isCheckMaterial && this.getRobotInventory()
      }, 2000)
    },
    startPollRobotInventory() {
      this.isCheckMaterial = true
    },
    stopPollRobotInventory() {
      this.isCheckMaterial = false
    },
    // 对商品的缺料以及商品属性里可选择进行数据处理
    examineMaterial(materialParam: Material) {
      const productStore = useProductsStore()
      productStore.productList.forEach(product => {
        // 这里需要拿到当前的产品属性，然后判断product里面的props name是否和material里面的name一致，如果一致，根据material里
        // 面selects属性的true或false，来设置product props里面的selects的true或false
        // 这里需要判断key是否和product里面name一致
        const isCurrentProduct = Object.keys(materialParam).find(key => key === product.name)
        if (isCurrentProduct) {
          const material = materialParam[product!.name]
          product.disabled = material.status !== CommonStatus.NORMAL
          const props = product?.props ?? []
          for (const key in material) {
            const prop = props.find(prop => prop.name === key)
            if (prop) {
              if (material[key].status !== CommonStatus.NORMAL) {
                prop.disabled = true
              }
              const materialSelects = material[key].selects
              Object.keys(materialSelects).forEach(selectKey => {
                const propSelects = prop.selects.find(select => select.name === selectKey)
                if (propSelects) {
                  // true代表显示，false代表不显示
                  propSelects.disabled = !materialSelects[selectKey]
                }
              })
            }
          }
        }
      })
    },
    clearTimer() {
      if (this.materialTimer) {
        clearInterval(this.materialTimer as any)
        this.materialTimer = null
      }
    },
    async reset() {
      await nextTick()
      this.alarmInfo = '';
      this.maintenance = false;
      this.alarm = false;
    }
  }
})
