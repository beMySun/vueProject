<template>
  <div class="vux-emotion"><slot style="display:none;"></slot></div>
</template>

<script>
// gif https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/5.gif
// whole https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif
// http://res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/appmsg/emotion/icon_emotion_switch.2x278965.png
// http://res.wx.qq.com/mmbizwap/zh_CN/htmledition/images/icon/appmsg/emotion/icon_emotion_switch_active.2x278965.png
const list = ['1']

export default {
  ready () {
    const name = this.$el.innerHTML
    this.index = list.indexOf(name)
    this.backgroundPositionX = -this.index * 24
    let imgHTML = ''
    if (!this.isGif) {
      imgHTML = this.$interpolate('<span class="static-emotion" style="background:url(https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif) {{backgroundPositionX}}px 0;"></span>')
    } else {
      imgHTML = this.$interpolate('<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/{{index}}.gif">')
    }
    this.$el.innerHTML = imgHTML
  },
  props: {
    isGif: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      src: '',
      backgroundPositionX: 0
    }
  }
}
</script>

<style>
.vux-emotion {
  display: inline-block;
}
.static-emotion {
  width: 24px;
  height: 24px;
  display: inline-block;
}
</style>
