<template>
  <div class="album-form">
    <h2>{{ isEditing ? 'Edit Album' : 'Add New Album' }}</h2>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Album Title *</label>
        <input 
          type="text" 
          id="title" 
          v-model="album.title" 
          required
          placeholder="Enter album title"
        >
      </div>
      
      <div class="form-group">
        <label for="artist">Artist *</label>
        <select id="artist" v-model="album.artist_id" required>
          <option value="" disabled>Select an artist</option>
          <option v-for="artist in artists" :key="artist.id" :value="artist.id">
            {{ artist.name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="releaseYear">Release Year *</label>
        <input 
          type="text" 
          id="releaseYear" 
          v-model="album.release_year" 
          required
          placeholder="e.g. 1977"
          pattern="[0-9]{4}"
          title="Please enter a valid 4-digit year"
        >
      </div>
      
      <div class="form-group">
        <label for="genre">Genre *</label>
        <select id="genre" v-model="album.genre_id" required>
          <option value="" disabled>Select a genre</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }} {{ genre.icon }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="condition">Condition *</label>
        <select id="condition" v-model="album.condition" required>
          <option value="" disabled>Select condition</option>
          <option value="Mint">Mint</option>
          <option value="Excellent">Excellent</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Rating *</label>
        <div class="rating-input">
          <span 
            v-for="star in 5" 
            :key="star" 
            @click="album.rating = star"
            :class="{ 'active': star <= album.rating }"
          >
            ★
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea 
          id="notes" 
          v-model="album.notes" 
          rows="4"
          placeholder="Add any additional information about this album"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="cancel">Cancel</button>
        <button type="submit" class="btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Album' : 'Add Album') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '../services/api';

export default {
  name: 'AlbumForm',
  props: {
    albumId: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const router = useRouter();
    const artists = ref([]);
    const genres = ref([]);
    const error = ref(null);
    const isSubmitting = ref(false);
    
    const isEditing = computed(() => !!props.albumId);
    
    const album = ref({
      title: '',
      artist_id: '',
      release_year: '',
      genre_id: '',
      notes: '',
      rating: 3, // Default rating
      condition: ''
    });
    
    const loadData = async () => {
      try {
        // Load artists and genres
        const [artistResponse, genreResponse] = await Promise.all([
          ApiService.getArtists(),
          ApiService.getGenres()
        ]);
        
        artists.value = artistResponse.data;
        genres.value = genreResponse.data;
        
        // If editing, load album data
        if (isEditing.value) {
          const albumResponse = await ApiService.getAlbum(props.albumId);
          const albumData = albumResponse.data;
          
          // Map the backend data to our form model
          album.value = {
            title: albumData.title,
            artist_id: albumData.artist_id,
            release_year: albumData.release_year,
            genre_id: albumData.genre_id,
            notes: albumData.notes,
            rating: albumData.rating,
            condition: albumData.condition
          };
        }
      } catch (err) {
        console.error('Error loading data:', err);
        error.value = 'Failed to load data. Please try again later.';
      }
    };
    
    const submitForm = async () => {
      try {
        isSubmitting.value = true;
        
        // Validate form data
        if (!album.value.title || !album.value.artist_id || !album.value.genre_id || 
            !album.value.release_year || !album.value.condition || !album.value.rating) {
          error.value = 'Please fill in all required fields.';
          isSubmitting.value = false;
          return;
        }
        
        if (isEditing.value) {
          // Update existing album
          await ApiService.updateAlbum(props.albumId, album.value);
          router.push(`/album/${props.albumId}`);
        } else {
          // Create new album
          const response = await ApiService.createAlbum(album.value);
          router.push(`/album/${response.data.id}`);
        }
      } catch (err) {
        console.error('Error saving album:', err);
        error.value = 'Failed to save album. Please try again later.';
        isSubmitting.value = false;
      }
    };
    
    const cancel = () => {
      router.back();
    };
    
    onMounted(() => {
      loadData();
    });
    
    return {
      artists,
      genres,
      album,
      error,
      isSubmitting,
      isEditing,
      submitForm,
      cancel
    };
  }
};
</script>

<style scoped>
.album-form {
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
  color: var(--primary-color);
}

.error-message {
  background-color: #ffdddd;
  color: var(--danger);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

.rating-input {
  display: flex;
  font-size: 30px;
  color: #ccc;
}

.rating-input span {
  cursor: pointer;
  margin-right: 5px;
}

.rating-input span.active {
  color: goldenrod;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .album-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>