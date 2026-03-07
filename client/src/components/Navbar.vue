<script setup lang="ts"></script>

<template>
  <nav class="navbar">
    <h2>RideExchange</h2>

    <div class="links">
      <router-link to="/">Home</router-link>
      <router-link to="/create-listing">Sell</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #222;
  color: white;
}

.links a {
  margin-left: 15px;
  color: white;
  text-decoration: none;
}
</style>