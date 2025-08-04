import { createRouter, createWebHistory } from 'vue-router';
import MapView from '@/views/MapView.vue';
import MainLayout from '@/components/layout/MainLayout.vue';
const NotFound = () => import('@/views/NotFound.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'MapView',
          component: MapView,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
});

export default router;
