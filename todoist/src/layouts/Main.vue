<template>
  <div class="container">
    <!-- 除非子组件模板包含至少一个 <slot> 插口，否则父组件的内容将会被丢弃。当子组件模板只有一个没有属性的 slot 时，父组件整个内容片段将插入到 slot 所在的 DOM 位置，并替换掉 slot 标签本身。 -->
    <slot></slot>
  </div>
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

  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 15px 30px;
    background: #f9f7f5;
  }
</style>
