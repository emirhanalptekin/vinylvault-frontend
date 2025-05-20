import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import AlbumView from './views/AlbumView.vue';
import AddAlbumView from './views/AddAlbumView.vue';
import EditAlbumView from './views/EditAlbumView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/album/:id',
    name: 'album-detail',
    component: AlbumView,
    props: true
  },
  {
    path: '/add-album',
    name: 'add-album',
    component: AddAlbumView
  },
  {
    path: '/edit-album/:id',
    name: 'edit-album',
    component: EditAlbumView,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;