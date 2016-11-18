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
                 <i class="iconfont icon-zititubiaoshoujianxiang"></i>
                 收件箱
              </li>
              <li class="nav-list-item">
                 <i class="iconfont icon-iconfontcanlender"></i>
                 今天
              </li>
              <li class="nav-list-item">
                 <i class="iconfont icon-rili"></i>
                 接下来7天
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
            <!-- 收件箱 -->
            <div class="mail_box">
              <h1 v-text="title" class="title"></h1>
              <div class="input-bar">
                  <input class="task-input" type="text" v-model="newItem" v-on:keyup.enter="addNew" placeholder="例如: 每两天学习葡萄牙语 共享">
                  <input  class="date-input" type="text" value="11月18日">
              </div>

              <button  class="add-button" type="button" @click="addNew">{{buttonName}}</button>
              <span class="cancel-button"> 取消</span>
              <ul class="task-list">

                  <li v-for="item in items" >
                    <span class="wrapper">
                      <input id="mycheckbox" type="checkbox" class="checkbox_default" data-shape="circled" v-bind:class="{finished:item.isFinished}" @click="toggleFinish(item)">
                      <span class="tip task-text" v-bind:class="{finished:item.isFinished}">{{item.label}}</span>
                    </span>
                    <span  class="task-text delete-task" @click="deleteItem(item)">删除任务</span>
                  </li>
              </ul>
            </div>

            <div class="add-project">
                <i class="iconfont icon-add"></i>
                <span class="add-text"> 添加任务</span>
            </div>
          </div>  

    </section>
  </div>
</template>

<script>

import Store from './assets/js/store'
import Hello from './components/Hello'

export default {
  data(){
    return {
      title: "收件箱",
      buttonName: "添加任务",
      items: Store.fetch(),
      newItem: ''
    }
  },
  methods: {

    toggleFinish(item){
      item.isFinished = !item.isFinished;

    },

    addNew(){

      if (this.newItem.trim().length == 0) {
        alert('空的'); 
      } else {
        this.items.push({
          label: this.newItem,
          isFinished: false
        });        
      }
      this.newItem = '';

    },
    deleteItem(item){
      console.log('delete');
      var index = this.items.indexOf(item)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    }
  },
  components: {
    Hello
  },

  watch: {
    items: {
      handler: function(items){
        Store.save(items);
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
@import 'assets/css/page.less';
</style>
