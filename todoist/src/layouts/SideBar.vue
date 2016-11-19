<template>
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
