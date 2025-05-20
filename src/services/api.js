import axios from 'axios';

// Define the base URL for API calls
const apiClient = axios.create({
  baseURL: 'http://localhost:5050',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // Album endpoints
  getAlbums() {
    return apiClient.get('/albums');
  },
  
  getAlbum(id) {
    return apiClient.get(`/albums/${id}`);
  },
  
  createAlbum(album) {
    return apiClient.post('/albums', album);
  },
  
  updateAlbum(id, album) {
    return apiClient.put(`/albums/${id}`, album);
  },
  
  deleteAlbum(id) {
    return apiClient.delete(`/albums/${id}`);
  },
  
  // Artist endpoints
  getArtists() {
    return apiClient.get('/artists');
  },
  
  // Genre endpoints
  getGenres() {
    return apiClient.get('/genres');
  }
};