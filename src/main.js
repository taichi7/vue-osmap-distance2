import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './../node_modules/bulma/css/bulma.css';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-components';
import {
  applyPolyfills,
  defineCustomElements,
} from '@aws-amplify/ui-components/loader';

Amplify.configure(awsconfig);

Vue.config.ignoredElements = [/amplify-\w*/];


applyPolyfills().then(() => {
  defineCustomElements(window);
});
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Auth.currentAuthenticatedUser({
  bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
})
  .then((user) => console.log(user))
  .catch((err) => console.log(err));