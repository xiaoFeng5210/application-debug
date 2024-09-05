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
$width: 12rem;
$height: 10rem;
$offset: -3.5rem;
$directionWidth: 100px;
$contentWidth: 6rem;
$borderWidth: calc(($width - $contentWidth) / 2);


$length2: 8rem;
$width2: 6rem;
$height2: 6rem;
$contentWidth2: 3rem;
$borderWidth2: calc(($width2 - $contentWidth2) / 2);
$directionWidth2: 60px;
$offset2: -1.8rem;




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
  filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.7));
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    font-size: 2rem;
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
  width: $directionWidth;
  height: $directionWidth;
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



@media only screen and (max-width: 768px) {


  .rotation_svg_box {
    width: $length2;
    height: $length2;
  }

  .direction-control {
    position: relative;
    width: $width2;
    height: $width2;
    background-color: transparent;
    border: $borderWidth2 solid #41575D;
    filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.7));
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    &::before {
      font-size: 1rem;
      content: '旋转';
      text-align: center;
      line-height: $contentWidth2;
      width: $contentWidth2; /* 200px - 2*20px */
      height: $contentWidth2;
      background-color: transparent; /* 也可以设置为 transparent，具体取决于需要 */
      border-radius: 50%;
      position: absolute;
    }
  }

  .direction-btn {
    position: absolute;
    width: $directionWidth2;
    height: $directionWidth2;
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
  .top { top: $offset2; border-radius: 50% 50% 0 0; }
  .right { right: $offset2; border-radius: 0 50% 50% 0; }
  .bottom { bottom: $offset2; border-radius: 0 0 50% 50%; }
  .left { left: $offset2; border-radius: 50% 0 0 50%; }
  .center-circle {
    width: 100px;
    height: 100px;
    //border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.5);
    visibility: hidden;
  }
}

</style>
