<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <router-link to="/" class="logo">
          <span class="logo-icon">💎</span>
          <span class="logo-text">精美首饰</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/products" class="nav-link">产品</router-link>
        </div>
        <div class="nav-actions">
          <router-link to="/cart" class="cart-icon" title="购物车">
            🛒
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>
        </div>
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索首饰..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-btn">🔍</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { cart } from '../utils/storage'

const router = useRouter()
const searchQuery = ref('')
const cartCount = ref(0)

const updateCartCount = () => {
  cartCount.value = cart.getTotalItems()
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: searchQuery.value } })
  }
}

onMounted(() => {
  updateCartCount()
  // 监听storage变化
  window.addEventListener('storage', updateCartCount)
  // 自定义事件监听（同页面内）
  window.addEventListener('cartUpdated', updateCartCount)
})

onUnmounted(() => {
  window.removeEventListener('storage', updateCartCount)
  window.removeEventListener('cartUpdated', updateCartCount)
})
</script>

<style scoped>
.navbar {
  background: var(--white);
  box-shadow: 0 2px 8px var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 0;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text);
  font-size: 24px;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 32px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  border-radius: 24px;
  padding: 8px 16px;
  min-width: 250px;
}

.search-input {
  border: none;
  background: transparent;
  flex: 1;
  padding: 4px 8px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
}

.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-icon {
  position: relative;
  font-size: 24px;
  text-decoration: none;
  color: var(--text);
  transition: transform 0.3s ease;
}

.cart-icon:hover {
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary);
  color: var(--white);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .nav-content {
    flex-wrap: wrap;
  }
  
  .nav-links {
    order: 3;
    width: 100%;
    justify-content: space-around;
  }
  
  .search-box {
    min-width: 200px;
  }
}
</style>

