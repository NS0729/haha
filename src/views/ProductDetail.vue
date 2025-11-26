<template>
  <div class="product-detail">
    <LoadingSpinner v-if="loading" message="加载中..." />
    <div v-else-if="product" class="container">
      <div class="product-content">
        <div class="product-image">
          <div class="image-placeholder">
            {{ product.emoji || '💎' }}
          </div>
        </div>
        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-meta">
            <span class="product-category">{{ product.category }}</span>
            <span class="product-id">#{{ product.id }}</span>
          </div>
          <div class="product-price">
            <span class="price-symbol">¥</span>
            <span class="price-amount">{{ formatPrice(product.price) }}</span>
          </div>
          <div class="product-description">
            <h3>产品描述</h3>
            <p>{{ product.description || '这是一件精美的首饰，展现了独特的工艺和设计。' }}</p>
          </div>
          <div class="product-specs">
            <div class="spec-item">
              <span class="spec-label">材质:</span>
              <span class="spec-value">{{ product.material || '18K金' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">尺寸:</span>
              <span class="spec-value">{{ product.size || '标准尺寸' }}</span>
            </div>
          </div>
          <div class="product-actions">
            <button @click="addToCart" class="btn btn-primary">
              <span>🛒</span>
              <span>加入购物车</span>
            </button>
            <button @click="toggleFavorite" :class="['btn', isFavorite ? 'btn-favorite' : 'btn-outline']">
              <span>{{ isFavorite ? '❤️' : '🤍' }}</span>
              <span>{{ isFavorite ? '已收藏' : '加入收藏' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="error-state">
      <div class="error-icon">😕</div>
      <h2>产品不存在</h2>
      <p>抱歉，找不到您要查看的产品</p>
      <router-link to="/products" class="btn btn-primary">返回产品列表</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../utils/api'
import { favorites, cart } from '../utils/storage'
import { formatPrice } from '../utils/helpers'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const product = ref(null)
const loading = ref(true)
const error = ref(null)
const isFavorite = ref(false)
const toast = inject('toast', () => {})

const loadProduct = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await api.getProduct(route.params.id)
    product.value = data.product
    isFavorite.value = favorites.has(data.product.id)
  } catch (err) {
    error.value = err.message || '加载产品失败'
    toast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const toggleFavorite = () => {
  if (!product.value) return
  favorites.toggle(product.value.id)
  isFavorite.value = !isFavorite.value
  toast(
    isFavorite.value ? '已加入收藏' : '已取消收藏',
    isFavorite.value ? 'success' : 'info'
  )
}

const addToCart = () => {
  if (!product.value) return
  cart.add(product.value, 1)
  toast('已加入购物车', 'success')
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail {
  padding: 48px 0;
  min-height: 60vh;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}

.product-image {
  position: sticky;
  top: 100px;
}

.image-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: var(--gradient);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
  box-shadow: 0 8px 32px var(--shadow);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-title {
  font-size: 36px;
  color: var(--text);
  margin-bottom: 8px;
}

.product-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.product-category {
  background: var(--primary);
  color: var(--white);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.product-id {
  color: var(--text-light);
  font-size: 14px;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin: 16px 0;
}

.price-symbol {
  font-size: 24px;
  color: var(--primary);
  font-weight: 600;
}

.price-amount {
  font-size: 48px;
  color: var(--primary);
  font-weight: 700;
  font-family: 'Playfair Display', serif;
}

.product-description {
  padding: 24px;
  background: var(--accent);
  border-radius: 12px;
}

.product-description h3 {
  margin-bottom: 12px;
  color: var(--text);
}

.product-description p {
  color: var(--text-light);
  line-height: 1.8;
}

.product-specs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: var(--white);
  border: 1px solid #eee;
  border-radius: 12px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-label {
  font-weight: 500;
  color: var(--text);
}

.spec-value {
  color: var(--text-light);
}

.product-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.product-actions .btn {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.btn-favorite {
  background: rgba(255, 192, 203, 0.1);
  border: 2px solid #ffc0cb;
  color: #d63384;
}

.btn-favorite:hover {
  background: rgba(255, 192, 203, 0.2);
}

.error-state {
  text-align: center;
  padding: 64px 20px;
  color: var(--text-light);
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-state h2 {
  margin-bottom: 8px;
  color: var(--text);
}

.error-state p {
  margin-bottom: 24px;
  color: var(--text-light);
}

@media (max-width: 968px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .product-image {
    position: static;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .product-actions .btn {
    width: 100%;
  }
}
</style>

