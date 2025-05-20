<template>
  <div>
    <h1>Add New Album</h1>
    <AlbumForm />
  </div>
</template>

<script>
import AlbumForm from '../components/AlbumForm.vue';

export default {
  name: 'AddAlbumView',
  components: {
    AlbumForm
  }
};
</script>

<style scoped>
h1 {
  color: var(--primary-color);
  margin-bottom: 20px;
}
</style>