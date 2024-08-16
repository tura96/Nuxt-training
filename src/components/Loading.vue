<template>
    <div class="overlay custom_pt" >
        <img src="../assets/images/loading.gif" alt="" class="m-auto">
    </div>
</template>
<style scoped>
    .overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 0);
      &.custom_pt {
        top: 0;
        background: #ffffff;
        img {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
</style>