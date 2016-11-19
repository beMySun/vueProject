<template>
    <section class="head">
        <div class="logo">
              <img class="logoIcon" src="../assets/images/logo.jpeg"></img>
        </div>

        <div class="operates">
            <div class="search-bar">
              <i class="iconfont icon-fangdajing"></i>
              <input type="" placeholder="快速查找" class="search-input">
            </div>
            <div class="operate-bar">
                <i class="iconfont icon-add"></i>
                <i class="iconfont icon-gaojing"></i>
                <i class="iconfont icon-3"></i>
                <i class="iconfont icon-shezhi"></i>
            </div>
        </div>

    </section>
</template>

<script>

  import VLink from '../components/VLink.vue' 

  export default {
    components: {
      VLink
    }
  }
</script>

<style scoped>

</style>
