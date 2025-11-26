<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">购物车</h1>
      
      <div v-if="loading" class="loading-state">
        <LoadingSpinner message="加载中..." />
      </div>
      
      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>购物车是空的</h2>
        <p>快去挑选您喜欢的首饰吧！</p>
        <router-link to="/products" class="btn btn-primary">浏览产品</router-link>
      </div>
      
      <div v-else class="cart-content">
        <div class="cart-items">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="cart-item"
          >
            <div class="item-image">
              <div class="image-placeholder">{{ item.emoji || '💎' }}</div>
            </div>
            <div class="item-info">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-category">{{ item.category }}</p>
              <div class="item-price">¥{{ formatPrice(item.price) }}</div>
            </div>
            <div class="item-quantity">
              <button
                @click="updateQuantity(item.id, item.quantity - 1)"
                class="quantity-btn"
                :disabled="item.quantity <= 1"
              >
                −
              </button>
              <span class="quantity-value">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="quantity-btn"
              >
                +
              </button>
            </div>
            <div class="item-total">
              <div class="total-price">¥{{ formatPrice(item.price * item.quantity) }}</div>
            </div>
            <button @click="removeItem(item.id)" class="remove-btn" title="删除">
              ✕
            </button>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="summary-card">
            <h3>订单摘要</h3>
            <div class="summary-row">
              <span>商品数量:</span>
              <span>{{ totalItems }} 件</span>
            </div>
            <div class="summary-row">
              <span>小计:</span>
              <span>¥{{ formatPrice(totalPrice) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row summary-total">
              <span>总计:</span>
              <span class="total-amount">¥{{ formatPrice(totalPrice) }}</span>
            </div>
            <button class="btn btn-primary checkout-btn" @click="checkout">
              结算
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { cart } from '../utils/storage'
import { formatPrice } from '../utils/helpers'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const cartItems = ref([])
const loading = ref(false)
const toast = inject('toast', () => {})

const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const loadCart = () => {
  cartItems.value = cart.getAll()
}

const updateQuantity = (productId, quantity) => {
  cart.updateQuantity(productId, quantity)
  loadCart()
  window.dispatchEvent(new Event('cartUpdated'))
  toast('已更新数量', 'success')
}

const removeItem = (productId) => {
  cart.remove(productId)
  loadCart()
  window.dispatchEvent(new Event('cartUpdated'))
  toast('已从购物车移除', 'info')
}

const checkout = () => {
  toast('结算功能开发中...', 'info')
}

onMounted(() => {
  loadCart()
})
</script>

<style scoped>
.cart-page {
  padding: 48px 0;
  min-height: 60vh;
}

.page-title {
  font-size: 42px;
  margin-bottom: 32px;
  color: var(--text);
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 64px;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.empty-cart h2 {
  margin-bottom: 12px;
  color: var(--text);
}

.empty-cart p {
  margin-bottom: 32px;
  color: var(--text-light);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  background: var(--white);
  border-radius: 12px;
  padding: 24px;
  display: grid;
  grid-template-columns: 100px 1fr 120px 120px 40px;
  gap: 24px;
  align-items: center;
  box-shadow: 0 2px 8px var(--shadow);
  transition: transform 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow);
}

.item-image {
  width: 100px;
  height: 100px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--gradient);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 18px;
  color: var(--text);
  margin: 0;
}

.item-category {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
  text-transform: uppercase;
}

.item-price {
  font-size: 16px;
  color: var(--text-light);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: var(--white);
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  font-size: 16px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-total {
  text-align: right;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  font-family: 'Playfair Display', serif;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-light);
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: #ef4444;
}

.cart-summary {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: var(--white);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow);
}

.summary-card h3 {
  margin-bottom: 24px;
  color: var(--text);
  font-size: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: var(--text);
}

.summary-divider {
  height: 1px;
  background: #eee;
  margin: 16px 0;
}

.summary-total {
  font-size: 20px;
  font-weight: 700;
  margin-top: 8px;
}

.total-amount {
  color: var(--primary);
  font-size: 28px;
  font-family: 'Playfair Display', serif;
}

.checkout-btn {
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  font-size: 18px;
}

@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 16px;
  }
  
  .item-quantity,
  .item-total,
  .remove-btn {
    grid-column: 2;
  }
  
  .item-quantity {
    justify-content: flex-start;
  }
  
  .item-total {
    text-align: left;
  }
  
  .cart-summary {
    position: static;
  }
}
</style>

