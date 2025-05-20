<template>
  <div v-if="loading" class="loading">
    <p>Loading album details...</p>
  </div>
  
  <div v-else-if="error" class="error">
    <p>{{ error }}</p>
    <router-link to="/" class="btn">Back to Home</router-link>
  </div>
  
  <div v-else-if="album" class="album-detail">
    <div class="album-header">
      <div class="album-title-section">
        <h1>{{ album.title }}</h1>
        <div class="album-rating">
          <span v-for="star in album.rating" :key="star">★</span>
          <span v-for="star in (5 - album.rating)" :key="'empty-' + star">☆</span>
        </div>
      </div>
      <div class="album-actions">
        <router-link :to="'/edit-album/' + album.id" class="btn">Edit Album</router-link>
        <button @click="confirmDelete" class="btn btn-delete">Delete Album</button>
      </div>
    </div>
    
    <div class="album-info">
      <div class="info-group">
        <h3>Artist</h3>
        <p>{{ album.artist ? album.artist.name : 'Unknown Artist' }}</p>
      </div>
      
      <div class="info-group">
        <h3>Release Year</h3>
        <p>{{ album.release_year }}</p>
      </div>
      
      <div class="info-group">
        <h3>Genre</h3>
        <p>{{ album.genre ? album.genre.name : 'Unknown Genre' }} {{ album.genre ? album.genre.icon : '' }}</p>
      </div>
      
      <div class="info-group">
        <h3>Condition</h3>
        <p>{{ album.condition }}</p>
      </div>
    </div>
    
    <div class="album-notes">
      <h3>Notes</h3>
      <p v-if="album.notes">{{ album.notes }}</p>
      <p v-else class="no-notes">No notes available for this album.</p>
    </div>
    
    <div class="back-link">
      <router-link to="/" class="btn btn-secondary">Back to Collection</router-link>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ album.title }}"?</p>
        <p>This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="deleteAlbum" class="btn btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '../services/api';

export default {
  name: 'AlbumView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const album = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const showDeleteModal = ref(false);
    
    const loadAlbum = async () => {
      try {
        loading.value = true;
        const response = await ApiService.getAlbum(props.id);
        album.value = response.data;
        loading.value = false;
      } catch (err) {
        console.error('Error loading album:', err);
        error.value = 'Failed to load album details. The album may not exist or has been deleted.';
        loading.value = false;
      }
    };
    
    const confirmDelete = () => {
      showDeleteModal.value = true;
    };
    
    const deleteAlbum = async () => {
      try {
        await ApiService.deleteAlbum(props.id);
        router.push('/');
      } catch (err) {
        console.error('Error deleting album:', err);
        error.value = 'Failed to delete album. Please try again later.';
        showDeleteModal.value = false;
      }
    };
    
    onMounted(() => {
      loadAlbum();
    });
    
    return {
      album,
      loading,
      error,
      showDeleteModal,
      confirmDelete,
      deleteAlbum
    };
  }
};
</script>

<style scoped>
.album-detail {
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.album-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--light-gray);
  padding-bottom: 20px;
}

.album-title-section h1 {
  margin: 0 0 10px 0;
  color: var(--primary-color);
}

.album-rating {
  font-size: 24px;
  color: goldenrod;
}

.album-actions {
  display: flex;
  gap: 10px;
}

.album-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-group h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: var(--secondary-color);
}

.info-group p {
  font-size: 18px;
  margin: 0;
}

.album-notes {
  margin-bottom: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--light-gray);
}

.album-notes h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: var(--secondary-color);
}

.no-notes {
  font-style: italic;
  color: #999;
}

.back-link {
  margin-top: 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  max-width: 900px;
  margin: 0 auto;
}

.error {
  color: var(--danger);
}

.error .btn {
  margin-top: 20px;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--white);
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin-bottom: 20px;
  color: var(--danger);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .album-header {
    flex-direction: column;
  }
  
  .album-actions {
    margin-top: 20px;
    width: 100%;
  }
  
  .album-actions .btn {
    flex: 1;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>