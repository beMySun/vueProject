<template>
  <div id="app">
    <section class="head">

        <div class="logo">
              <img class="logoIcon" src="assets/images/logo.jpeg"></img>
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

    <section class="content">

        <div class="navigation">
          <ul class="nav-list">
              <li class="nav-list-item">
                <a v-link="{ path: '/inbox' }"><i class="iconfont icon-zititubiaoshoujianxiang"></i>收件箱</a>
              </li>
              <li class="nav-list-item">
                <a v-link="{ path: '/nextday' }"><i class="iconfont icon-iconfontcanlender"></i>明天</a>
              </li>
              <li class="nav-list-item">
                <a v-link="{ path: '/nextweek' }"><i class="iconfont icon-rili"></i>接下来7天</a>
              </li>
          </ul>
          <ul class="tabs">
                <li class="tab active">项目</li>
                <li class="tab">标签</li>
                <li class="tab">过滤器</li>
          </ul>
          <section class="tab-content">
            <ul class="tab-projects">
              <li class="tab-project ">
                  <span class="project-level level_red"></span>
                  <span class="project-text">个人</span>
              </li>
              <li class="tab-project">
                  <span class="project-level level-default"></span>
                  <span class="project-text">购物</span>
              </li>
              <li class="tab-project">
                  <span class="project-level level_green"></span>
                  <span class="project-text">工作</span>
              </li>
              <li class="tab-project">
                  <span class="project-level level_purple"></span>
                  <span class="project-text">嘿嘿嘿</span>
              </li>
            </ul>

            <div class="add-project">
              <i class="iconfont icon-add"></i>
              <span class="add-text"> 添加项目</span>
            </div>
          </section>
        </div>
        <div class="main_content">
          <router-view></router-view>
    </section>
  </div>
</template>

<script>

  import VLink from './components/VLink.vue' 

    export default {
        components: {
          VLink
        },
        replace: false
    }
</script>
<style lang="less">
    @import 'assets/css/page.less';
</style>
