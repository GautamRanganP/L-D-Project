<template>
  <div>
    <header class="bg-blue-100">
      <nav class="px-6 py-3">
        <div class="flex justify-between items-center">
          <a href="#" class="text-2xl font-bold text-gray-800">
            <img src="./assets/50.jpg" width="35" height="35" alt="logo" />
          </a>
          <div class="flex items-center space-x-4">
            <RouterLink to="/" class="text-gray-800">Attendance Generator</RouterLink>
            <RouterLink v-if="isAuthenticated" to="/prepost" class="text-gray-800">Effectiveness Report Generator</RouterLink>
            <RouterLink v-if="isAuthenticated" to="/trainings" class="text-gray-800">Training Dashboard</RouterLink>

            <div v-if="!isAuthenticated">
              <button
                @click="goLogin"
                class="px-3 py-1 bg-white border rounded text-gray-800 hover:bg-gray-50"
              >
                Login
              </button>
            </div>

            <div v-else class="flex items-center space-x-2">
              <span class="text-gray-700">Hello, {{ userName }}</span>
              <button
                @click="handleLogout"
                class="px-3 py-1 bg-white border rounded text-gray-800 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<script>
import { RouterView, RouterLink } from "vue-router";
import { getToken, getUser, logout } from "./services/auth"; // adjust path if needed

export default {
  components: {
    RouterView,
    RouterLink,
  },
  data() {
    return {
      token: getToken(), // initial token snapshot
      user: getUser(),   // initial user snapshot (expected { name, email, role, ... } or null)
    };
  },
  computed: {
    isAuthenticated() {
      return !!this.token;
    },
    userName() {
      // choose the best available display name
      if (!this.user) return 'User'
      return this.user.name || this.user.fullName || this.user.email || 'User'
    }
  },
  methods: {
    goLogin() {
      // preserve redirect if desired
      const current = this.$route.fullPath || '/'
  if (this.$route.name === 'login') {
    this.$router.replace({ name: 'login' })
  } else {
    this.$router.push({ name: 'login', query: { redirect: current } })
  }
    },
    handleLogout() {
      logout(); // should clear token and user in auth service (and emit auth-change)
      // update local snapshots so UI updates immediately
      this.token = null;
      this.user = null;
      // redirect to home after logout
      this.$router.push({ name: "home" });
    },
    onStorage(e) {
      // update token and user when storage changes in other tabs
      this.token = getToken();
      this.user = getUser();
    },
    onAuthChange() {
      // custom event to update token/user in same tab
      this.token = getToken();
      this.user = getUser();
    },
  },
  mounted() {
    // listen for storage changes from other tabs
    window.addEventListener("storage", this.onStorage);
    // custom event: other parts of the app (eg. login component) can dispatch `auth-change`
    window.addEventListener("auth-change", this.onAuthChange);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.onStorage);
    window.removeEventListener("auth-change", this.onAuthChange);
  },
};
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

nav a.router-link-exact-active {
  text-decoration: underline;
}
</style>
