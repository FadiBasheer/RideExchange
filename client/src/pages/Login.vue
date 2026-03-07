<template>
  <div>
    <h1>Listings</h1>

    <div v-for="listing in listings" :key="listing._id">
      <router-link :to="`/listing/${listing._id}`">
        {{ listing.title }} - ${{ listing.price }}
      </router-link>
    </div>
  </div>
</template>