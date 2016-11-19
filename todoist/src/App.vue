<template>
  <div id="app">

    <head-bar></head-bar>

    <section class="content">
        <!-- 导航 -->
        <div class="navigation">
            <side-bar></side-bar>
            <Tab></Tab>
            <Add></Add>         
        </div>
        <!-- 主体内容 -->
        <div class="main_content">
            <router-view></router-view>
        </div>
    </section>
  </div>
</template>


<script>

  import VLink from './components/VLink.vue' 
  import SideBar  from './layouts/SideBar' 
  import Tab  from './layouts/Tab' 
  import Add  from './layouts/Add' 
  import HeadBar  from './layouts/Head' 


  //import { SideBar, Tab, Add } from './layouts'
  // lol 注册的组建，import进来之后，标签名字要注意。这里的 SideBar ,组建要写成  <side-bar>


    export default {
      components: {
          VLink,
          SideBar,
          Tab,
          Add,
          HeadBar
        },
      replace: false
    }
</script>
<style lang="less">
    @import 'assets/css/page.less';
</style>
