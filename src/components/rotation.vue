<script setup lang="ts">
import {useRobotControlService} from "@/stores/robotControlService.ts";
import usePressEvent from "@/composables/press.ts";

const {rotateByStep} = useRobotControlService()
const {pressStart, pressEnd} = usePressEvent();

const fineTurning = async (direction: string) => {
  await rotateByStep(direction);
}
</script>

<template>
  <div class="direction-control">
    <button class="direction-btn top" @click="fineTurning('forward')" @touchstart="pressStart($event, 'forward', 'rotate')" @touchend="pressEnd()"
            @mousedown="pressStart($event, 'forward', 'rotate')"
            @mouseup="pressEnd()">
      <img src="/image/forward.svg" style="max-width: 30px" alt="">
    </button>
    <button class="direction-btn right" @click="fineTurning('right')" @touchstart="pressStart($event, 'right', 'rotate')" @touchend="pressEnd()"
            @mousedown="pressStart($event, 'right', 'rotate')"
            @mouseup="pressEnd()">
      <img src="/image/right_rotation.svg" style="max-width: 30px" alt="">
    </button>
    <button class="direction-btn bottom" @touchstart="pressStart($event, 'backward', 'rotate')" @touchend="pressEnd()"
            @mousedown="pressStart($event, 'backward', 'rotate')"
            @mouseup="pressEnd()" @click="fineTurning('backward')">
      <img src="/image/bottom_rotation.svg" style="max-width: 30px" alt="">
    </button>
    <button class="direction-btn left" @click="fineTurning('left')"
            @touchstart="pressStart($event, 'left', 'rotate')" @touchend="pressEnd()"
            @mousedown="pressStart($event, 'left', 'rotate')"
            @mouseup="pressEnd()">
      <img src="/image/left_rotation.svg" style="max-width: 30px" alt="">
    </button>
  </div>
</template>

<style scoped lang="scss">
$length: 15rem;
$width: 8rem;
$height: 10rem;
$offset: -45px;

$contentWidth: 4rem;
$borderWidth: calc(($width - $contentWidth) / 2);
.rotation_svg_box {
  width: $length;
  height: $length;
}

.direction-control {
  position: relative;
  width: $width;
  height: $width;
  background-color: transparent;
  border: $borderWidth solid #41575D;
  //border-image: linear-gradient(to bottom, #41575D, white) 1;
  filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.7));
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    content: '旋转';
    text-align: center;
    line-height: $contentWidth;
    width: $contentWidth; /* 200px - 2*20px */
    height: $contentWidth;
    background-color: transparent; /* 也可以设置为 transparent，具体取决于需要 */
    border-radius: 50%;
    position: absolute;
  }
}
.direction-btn {
  position: absolute;
  width: 60px;
  height: 60px;
  //background-color: #3A4E54;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.arrow {
  color: white;
  font-size: 24px;
  line-height: 1;
}
.top { top: $offset; border-radius: 50% 50% 0 0; }
.right { right: $offset; border-radius: 0 50% 50% 0; }
.bottom { bottom: $offset; border-radius: 0 0 50% 50%; }
.left { left: $offset; border-radius: 50% 0 0 50%; }
.center-circle {
  width: 100px;
  height: 100px;
  //border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.5);
  visibility: hidden;
}
</style>
