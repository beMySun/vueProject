<template>
  <div class="container">
  	<!-- 左侧的导航区域 -->
    <ul>
      <li>
        <v-link href="/inBox">收件箱</v-link>
        <v-link href="/nextDay">明天</v-link>
 		<v-link href="/nextSevenDays">接下里七天</v-link>
      </li>
    </ul>

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
