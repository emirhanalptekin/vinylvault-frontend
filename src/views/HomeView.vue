<template>
  <div>
    <h1>Your Vinyl Collection</h1>
    <p class="intro">Manage your vinyl record collection with VinylVault. Browse your albums below, or add a new record to your collection.</p>
    
    <AlbumList />
  </div>
</template>

<script>
import AlbumList from '../components/AlbumList.vue';

export default {
  name: 'HomeView',
  components: {
    AlbumList
  }
};
</script>

<style scoped>
h1 {
  color: var(--primary-color);
  margin-bottom: 10px;
}

.intro {
  margin-bottom: 30px;
  max-width: 800px;
  line-height: 1.6;
}
</style>