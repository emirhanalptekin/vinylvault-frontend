<template>
  <div id="app">
    <Navbar />
    <main class="container">
      <router-view/>
    </main>
    <footer>
      <p>&copy; {{ new Date().getFullYear() }} VinylVault - Your Record Collection</p>
    </footer>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>

<style>
:root {
  --primary-color: #4CAF50;
  --secondary-color: #333;
  --background-color: #f4f4f4;
  --text-color: #333;
  --light-gray: #ddd;
  --white: #fff;
  --danger: #ff3860;
  --success: #23d160;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 140px);
}

.btn {
  display: inline-block;
  background: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.3s;
}

.btn:hover {
  opacity: 0.8;
}

.btn-delete {
  background: var(--danger);
}

.btn-secondary {
  background: var(--secondary-color);
}

footer {
  text-align: center;
  padding: 20px;
  background: var(--secondary-color);
  color: var(--white);
  height: 60px;
}

.card {
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
</style>