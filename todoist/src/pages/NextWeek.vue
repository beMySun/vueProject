<template>
  <main-layout>
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
  </main-layout>
</template>


 <script>

import Store from '../assets/js/store'
import MainLayout from '../layouts/Main.vue'

export default {
  data(){
    return {
      title: "接下来7天",
      buttonName: "添加任务",
      items: Store.fetch(),
      newItem: ''
    }
  },
  components: {
      MainLayout
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