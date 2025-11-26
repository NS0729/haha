import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Products from './views/Products.vue'
import ProductDetail from './views/ProductDetail.vue'
import Cart from './views/Cart.vue'
import './style.css'

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/product/:id', component: ProductDetail, props: true },
  { path: '/cart', component: Cart }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')

