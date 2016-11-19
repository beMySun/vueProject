<template>
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
