import './assets/main.css';
import 'leaflet/dist/leaflet.css';

// import L from 'leaflet'
// delete (L.Icon.Default.prototype as any)._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
//   iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
//   shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
// })

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
