<template>
  <div class="weui_dialog_alert" v-show="show" style="z-index:300">
    <div class="weui_mask" style="z-index:300;background:rgba(0,0,0,0.5);"></div>
    <div class="weui_dialog" v-show="show" :transition="dialogTransition" style="z-index:301;">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maskTransition: {
      type: String,
      default: 'vux-fade'
    },
    dialogTransition: {
      type: String,
      default: 'vux-dialog'
    }
  },
  watch: {
    show (val) {
      this.$emit(val ? 'on-show' : 'on-hide')
    }
  }
}
</script>
