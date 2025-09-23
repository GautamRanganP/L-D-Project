<template>
  <div>
    <header class="bg-blue-100" >
        <nav class="px-6 py-3">
            <div class="flex justify-between items-center">
                <a href="#" class="text-2xl font-bold text-gray-800"><img src="./assets/50.jpg" width="35" height="35"> </a>
                <div class="flex space-x-4">
                    <RouterLink to="/" class="text-gray-800">Attendance Generator</RouterLink>
                    <RouterLink to="/prepost" class="text-gray-800">Effectiveness Report Generator</RouterLink>
                    <!-- <RouterLink to="/lmsform" class="text-gray-800">Training Calendar</RouterLink>
                   -->
                    <!-- <RouterLink to="/report" class="text-gray-800">Report </RouterLink>
                -->
                  </div>
            </div>
        </nav>
    </header>
    <RouterView></RouterView>
  </div>
</template>

<script >
import { RouterView , RouterLink } from 'vue-router';
export default{
  data(){

  },
  components:{
    RouterView,
    RouterLink
  }
}



</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

nav a.router-link-exact-active{
  text-decoration: underline;
}
</style>
