import { http } from "@/utils/http";

// import type {Res} from "@/api"

interface Res {
  code: number
  msg: string
}

interface Robot extends Res {
  data: {
    id: string // 机器人id
  }
}

export enum CommonStatus {
  NORMAL = 'NORMAL', // 正常
  FAULT = 'FAULT', // 故障
  LACK = 'LACK', // 缺少
  MAINTENANCE = 'MAINTENANCE' //歇业
}

export enum Status {
  IDLE = 'IDLE', // 全部制作完成 空闲
  DONE = 'DONE', // 当前物品制作完成等待用户取走
  RUNNING = 'RUNNING', // 当前物品正在制作中
  FAILD = 'FAILD', // 当前物品制作失败
}

export type TaskDetail = {
  name: string,
  count: number,
  complete: number,
}

interface TaskStatus extends Res {
  data: {
    status: Status,
    current: {
      total_count: number,
      name: string,
      complete: number,
      working_tips: ''
    },
    detail: TaskDetail[],
    errmsg?: ''
  }
}

interface MakeRequest {
  id: string
  products: {
    name: string
    count: number
  }[]
}

type MaterialItem = { status: CommonStatus } & {
  [key: string]: {
    status: CommonStatus,
    selects: {
      [key: string]: boolean
    }
  }
}

export interface Material {
  // 商品
  [key: string]: MaterialItem
}

interface Inventory extends Res {
  data: {
    robot: {
      status: CommonStatus,
      msg: string // 不可用详情
    },
    device: {
      status: CommonStatus,
      msg: string // 不可用详情
    },
    material: Material
  }
}

export interface DeviceStatus {
  [key: string]: {
    status: string,
    message: string
  }
}

interface DeviceStatusRes extends Res {
  data: DeviceStatus
}

export interface FunctionList {
  [key: string]: {
    name: string
  }
}

interface FunctionListRes extends Res {
  data: FunctionList
}

interface MaintainRequest {
  cmd: string
}

export interface PointListRes extends Res {
  data: { name: string, display_name: string }[]
  cmd_data: any
}

export type DebugPamrams = { name: string, value: number, type: string, min: number, max: number }[]

interface ParamsRes extends Res {
  data: Array<DebugPamrams>
}

interface MoveToPosition extends Res {
  cmd: string
}

export type MoveToParam = 'cup' | 'origin' | 'outlet' | 'dining_out'

export interface DebugRequest {
  cmd: string,
  mod?: string,
  param: any,
}

export interface Config {
  password: string
  mod: boolean
}

// 这里的接口不需要走代理，直接获取机器人信息


/**
 * 获取配置
 */
export const getConfig = async (): Promise<Record<'data', Config>> => {
  return await http.get("config");
}

/**
 * 修改配置
 */
export const setConfig = async (config: any): Promise<Record<'data', Config>> => {
  return await http.post("config", config);
}

/**
 * 获取机器人基本信息
 */
export const getRobot = async (): Promise<Record<'data', Robot>> => {
  return await http.get("base_info");
}

/**
 * 查询机器人制作状态
 */
export const getTaskStatus = async (): Promise<Record<'data', TaskStatus>> => {
  return await http.get("task_status")
}

/**
 * 制作接口
 */
export const make = async (data: MakeRequest): Promise<Record<'data', Res>> => {
  return await http.post("task", data as any)
}

/**
 * 机器人信息(查询库存状态)
 */
export const getInventory = async (): Promise<Record<'data', Inventory>> => {
  return await http.get("status")
}

/**
 * 查询设备状态
 */
export const getDeviceStatus = async (): Promise<Record<'data', DeviceStatusRes>> => {
  return await http.get("device_status")
}

/**
 * 获取设备维护功能列表
 */
export const getDeviceFunctionList = async (): Promise<Record<'data', FunctionListRes>> => {
  return await http.get("function_list")
}

/**
 * 功能维护
 */
export const maintain = async (data: MaintainRequest): Promise<Record<'data', Res>> => {
  return await http.post("maintain", data as any)
}

/**
 * 通用功能
 */
export const baseActions = async (data: MaintainRequest): Promise<Record<'data', Res>> => {
  return await http.post("base_action", data as any)
}

/**
 * 获取点位列表
 */
export const getPointList = async (): Promise<Record<'data', PointListRes>> => {
  return await http.get("point_list", undefined, { timeout: 3000 })
}

/**
 * debug
 */
export const debugClient = async (data: DebugRequest): Promise<Record<'data', MoveToPosition>> => {
  return await http.post(`adjust`, data as any)
}

/**
 * maintain
 * cmd: "entry_debug" | "exit_debug"
 */
export const maintainClient = async (cmd: string) => {
  return await http.post(`maintain`, { cmd })
}

/**
 * 获取参数 Record<'data', ParamsRes
 */
export const getParams = async (): Promise<any> => {
  return await http.get(`config_parameter`);
}

/**
 * 保存参数
 */
export const saveParams = async (data: { cmd: string, param: DebugPamrams }): Promise<Record<'data', Res>> => {
  return await http.post(`adjust`, data as any)
}

/**
 * 更新点位
 */
export const fetchPointsActions = async (param: string, cmd: string): Promise<Record<'data', Res>> => {
  return await http.post(`adjust`, {
    cmd,
    param
  })
}

type lightsTime = [number, number]
type lightsTimeRange = Array<lightsTime>
export type LightsTimeRangeData = Array<lightsTimeRange>

interface LightsResponse extends Res {
  data: LightsTimeRangeData
}

/**
 * 获取紫外线时间范围
 */
export const getLightsTimeRange = async (): Promise<Record<'data', LightsResponse>> => {
  return await http.get('get_lights_period')
}

/**
 * 机器人状态
 */
export const getRobotStatus = async (): Promise<any> => {
  return await http.get('system_status', undefined, { timeout: 999 })
}

/**
 * 设置参数
 */
export const setParams = async (data: any): Promise<Record<'data', Res>> => {
  return await http.post(`update_config`, data as any, { timeout: 5000 })
}
