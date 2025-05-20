<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="logo">
        <span class="logo-icon">🎵</span> VinylVault
      </router-link>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/add-album" class="btn">Add Album</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'MainNavbar'
};
</script>

<style scoped>
.navbar {
  background: var(--secondary-color);
  padding: 15px 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: auto;
}

.logo {
  display: flex;
  align-items: center;
  color: var(--white);
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
}

.logo-icon {
  margin-right: 10px;
  font-size: 28px;
}

.nav-links {
  display: flex;
  list-style: none;
  align-items: center;
}

.nav-links li {
  margin-left: 20px;
}

.nav-links a {
  color: var(--white);
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover:not(.btn) {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .navbar .container {
    flex-direction: column;
    padding: 10px;
  }
  
  .nav-links {
    margin-top: 10px;
  }
  
  .nav-links li {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>