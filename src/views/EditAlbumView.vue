<template>
  <div>
    <h1>Edit Album</h1>
    <AlbumForm :albumId="id" />
  </div>
</template>

<script>
import AlbumForm from '../components/AlbumForm.vue';

export default {
  name: 'EditAlbumView',
  components: {
    AlbumForm
  },
  props: {
    id: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
h1 {
  color: var(--primary-color);
  margin-bottom: 20px;
}
</style>