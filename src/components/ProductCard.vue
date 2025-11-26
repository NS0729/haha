<template>
  <div class="product-card card">
    <router-link :to="`/product/${product.id}`" class="product-link">
      <div class="product-image">
        <div class="image-placeholder">
          {{ product.emoji || '💎' }}
        </div>
        <button
          v-if="isFavorite"
          @click.prevent="toggleFavorite"
          class="favorite-btn favorite-active"
          title="取消收藏"
        >
          ❤️
        </button>
        <button
          v-else
          @click.prevent="toggleFavorite"
          class="favorite-btn"
          title="加入收藏"
        >
          🤍
        </button>
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-category">{{ product.category }}</p>
        <div class="product-price">
          <span class="price-symbol">¥</span>
          <span class="price-amount">{{ formatPrice(product.price) }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { favorites } from '../utils/storage'
import { formatPrice } from '../utils/helpers'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const toast = inject('toast', () => {})
const isFavorite = ref(favorites.has(props.product.id))

const toggleFavorite = () => {
  favorites.toggle(props.product.id)
  isFavorite.value = !isFavorite.value
  toast(
    isFavorite.value ? '已加入收藏' : '已取消收藏',
    isFavorite.value ? 'success' : 'info'
  )
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--gradient);
  position: relative;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: var(--white);
}

.favorite-active {
  background: rgba(255, 192, 203, 0.9);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  transition: transform 0.3s ease;
}

.product-card:hover .image-placeholder {
  transform: scale(1.1);
}

.product-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.product-name {
  font-size: 20px;
  color: var(--text);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category {
  font-size: 14px;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-top: auto;
  padding-top: 12px;
}

.price-symbol {
  font-size: 16px;
  color: var(--primary);
  font-weight: 600;
}

.price-amount {
  font-size: 28px;
  color: var(--primary);
  font-weight: 700;
  font-family: 'Playfair Display', serif;
}

.price-amount::after {
  content: '';
}
</style>

