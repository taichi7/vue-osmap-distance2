<template>
  <amplify-authenticator>
    <div id="app">
      <nav class="navbar has-background-info">
        <div class="navbar-brand">
          <router-link class="navbar-item has-text-white" to = "/"> カロリー計算アプリ </router-link>
        </div>
      </nav>
      <div id="nav">
        <router-link to="/Map">(Map)</router-link>
      </div>
      <router-view/>
      <amplify-sign-out></amplify-sign-out>
    </div>
  </amplify-authenticator>
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
  text-align: right;
}

#nav a {
  font-weight: bold;
  color: #ffffff;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
