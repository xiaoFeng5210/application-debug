import { useRobotControlService } from '@/stores/robotControlService';
import { ref, onBeforeMount} from 'vue'
import {PointListRes} from "@/api/robot.ts";

const usePoseControl = () => {
  const { pointListClient } = useRobotControlService();
  const PoseOptions = ref<{ text: string, value: string }[]>([])

  const currentPose = ref('');

  onBeforeMount(async () => {
    const res = await pointListClient();
    if (res) {
      PoseOptions.value = (res as PointListRes).map(resItem => {
        return {
          text: `点位：${resItem.display_name}`,
          value: resItem.name
        }
      });
      currentPose.value = PoseOptions.value[0].value
    }
  });
  return {
    PoseOptions,
    currentPose,
  }
}

export default usePoseControl
