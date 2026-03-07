<script setup lang="ts">
import { onMounted, ref } from "vue";
import api from "../services/api";

const listings = ref([]);

const loadListings = async () => {
  const res = await api.get("/listings");
  listings.value = res.data.listings;
};

onMounted(loadListings);
</script>

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