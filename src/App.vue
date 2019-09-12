<template>
  <div id="app">
    <nav class="navbar has-background-info">
      <div class="navbar-brand">
        <a class="navbar-item has-text-white" href="https://i-doctor.sakura.ne.jp/font/?p=40818"> Vue OpenStreetMap Distance </a>
      </div>
    </nav>
    <div id="nav">
      <router-link to="/">Map</router-link>
      <span> | </span>
      <router-link to="/about">Distance</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 2px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
