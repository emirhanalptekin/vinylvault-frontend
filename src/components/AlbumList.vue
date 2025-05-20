<template>
  <div>
    <div class="filter-bar">
      <div class="search">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search albums..."
          @input="filterAlbums"
        >
      </div>
      <div class="filters">
        <select v-model="selectedArtist" @change="filterAlbums">
          <option value="">All Artists</option>
          <option v-for="artist in artists" :key="artist.id" :value="artist.id">
            {{ artist.name }}
          </option>
        </select>
        <select v-model="selectedGenre" @change="filterAlbums">
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }} {{ genre.icon }}
          </option>
        </select>
        <select v-model="selectedRating" @change="filterAlbums">
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <p>Loading albums...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="filteredAlbums.length === 0" class="no-results">
      <p>No albums found. Try adjusting your filters or add a new album.</p>
      <router-link to="/add-album" class="btn">Add Album</router-link>
    </div>
    
    <div v-else class="album-grid">
      <div 
        v-for="album in filteredAlbums" 
        :key="album.id" 
        class="album-card"
      >
        <div class="album-rating">
          <span v-for="star in album.rating" :key="star">★</span>
          <span v-for="star in (5 - album.rating)" :key="'empty-' + star">☆</span>
        </div>
        <h3 class="album-title">{{ album.title }}</h3>
        <p class="album-artist">{{ album.artist ? album.artist.name : 'Unknown Artist' }}</p>
        <p class="album-details">
          <span class="year">{{ album.release_year }}</span>
          <span class="genre">{{ album.genre ? album.genre.name : 'Unknown Genre' }} {{ album.genre ? album.genre.icon : '' }}</span>
        </p>
        <p class="album-condition">Condition: {{ album.condition }}</p>
        <div class="album-actions">
          <router-link :to="'/album/' + album.id" class="btn">View</router-link>
          <router-link :to="'/edit-album/' + album.id" class="btn btn-secondary">Edit</router-link>
          <button @click="confirmDelete(album)" class="btn btn-delete">Delete</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ albumToDelete?.title }}"?</p>
        <p>This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-secondary">Cancel</button>
          <button @click="deleteAlbum" class="btn btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ApiService from '../services/api';

export default {
  name: 'AlbumList',
  setup() {
    const albums = ref([]);
    const artists = ref([]);
    const genres = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const searchTerm = ref('');
    const selectedArtist = ref('');
    const selectedGenre = ref('');
    const selectedRating = ref('');
    const filteredAlbums = ref([]);
    const showDeleteModal = ref(false);
    const albumToDelete = ref(null);

    const loadData = async () => {
      try {
        loading.value = true;
        
        // Load albums
        const albumResponse = await ApiService.getAlbums();
        albums.value = albumResponse.data;
        filteredAlbums.value = [...albums.value];
        
        // Load artists
        const artistResponse = await ApiService.getArtists();
        artists.value = artistResponse.data;
        
        // Load genres
        const genreResponse = await ApiService.getGenres();
        genres.value = genreResponse.data;
        
        loading.value = false;
      } catch (err) {
        console.error('Error loading data:', err);
        error.value = 'Failed to load albums. Please try again later.';
        loading.value = false;
      }
    };

    const filterAlbums = () => {
      filteredAlbums.value = albums.value.filter(album => {
        // Filter by search term (album title or artist name)
        const matchesSearch = searchTerm.value === '' || 
          album.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          (album.artist && album.artist.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
        
        // Filter by artist
        const matchesArtist = selectedArtist.value === '' || album.artist_id === selectedArtist.value;
        
        // Filter by genre
        const matchesGenre = selectedGenre.value === '' || album.genre_id === selectedGenre.value;
        
        // Filter by rating
        const matchesRating = selectedRating.value === '' || album.rating >= parseInt(selectedRating.value);
        
        return matchesSearch && matchesArtist && matchesGenre && matchesRating;
      });
    };

    const confirmDelete = (album) => {
      albumToDelete.value = album;
      showDeleteModal.value = true;
    };

    const closeModal = () => {
      showDeleteModal.value = false;
      albumToDelete.value = null;
    };

    const deleteAlbum = async () => {
      if (!albumToDelete.value) return;
      
      try {
        await ApiService.deleteAlbum(albumToDelete.value.id);
        // Remove from local list
        albums.value = albums.value.filter(album => album.id !== albumToDelete.value.id);
        // Update filtered list
        filterAlbums();
        // Close modal
        closeModal();
      } catch (err) {
        console.error('Error deleting album:', err);
        error.value = 'Failed to delete album. Please try again later.';
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      albums,
      artists,
      genres,
      loading,
      error,
      searchTerm,
      selectedArtist,
      selectedGenre,
      selectedRating,
      filteredAlbums,
      showDeleteModal,
      albumToDelete,
      filterAlbums,
      confirmDelete,
      closeModal,
      deleteAlbum
    };
  }
};
</script>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.search {
  flex: 1;
  min-width: 200px;
}

.search input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 16px;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters select {
  padding: 10px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: 16px;
  background-color: var(--white);
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.album-card {
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 20px;
  position: relative;
  transition: transform 0.3s;
}

.album-card:hover {
  transform: translateY(-5px);
}

.album-rating {
  color: goldenrod;
  font-size: 20px;
  margin-bottom: 10px;
}

.album-title {
  font-size: 18px;
  margin-bottom: 5px;
  color: var(--primary-color);
}

.album-artist {
  font-weight: bold;
  margin-bottom: 10px;
}

.album-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.album-condition {
  margin-bottom: 15px;
  font-style: italic;
}

.album-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.album-actions .btn {
  flex: 1;
  text-align: center;
  font-size: 14px;
  padding: 8px 0;
}

.loading, .error, .no-results {
  text-align: center;
  padding: 40px;
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.error {
  color: var(--danger);
}

.no-results .btn {
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
  .filter-bar {
    flex-direction: column;
  }
  
  .search, .filters {
    width: 100%;
  }
  
  .filters select {
    flex: 1;
  }
  
  .album-actions {
    flex-direction: column;
  }
}
</style>