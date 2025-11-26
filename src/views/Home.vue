<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">发现您的完美首饰</h1>
        <p class="hero-subtitle">精选优质珠宝，展现独特魅力</p>
        <router-link to="/products" class="btn btn-primary">浏览产品</router-link>
      </div>
      <div class="hero-image">
        <div class="hero-placeholder">💎✨</div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🌟</div>
            <h3>精选品质</h3>
            <p>每一件首饰都经过精心挑选，确保品质卓越</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💝</div>
            <h3>独特设计</h3>
            <p>融合传统工艺与现代美学，打造独特风格</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚚</div>
            <h3>快速配送</h3>
            <p>安全包装，快速送达，让您安心购物</p>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products">
      <div class="container">
        <h2 class="section-title">精选推荐</h2>
        <LoadingSpinner v-if="loading" message="加载中..." />
        <div v-else-if="products.length" class="products-grid grid-4">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">💎</div>
          <p>暂无产品</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { api } from '../utils/api'

const products = ref([])
const loading = ref(true)
const toast = inject('toast', () => {})

onMounted(async () => {
  try {
    const data = await api.getProducts({ limit: 8 })
    products.value = data.products || []
  } catch (error) {
    toast(error.message || '加载产品失败', 'error')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home {
  flex: 1;
}

.hero {
  background: var(--gradient);
  padding: 80px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  min-height: 500px;
}

.hero-content {
  max-width: 500px;
  text-align: center;
}

.hero-title {
  font-size: 48px;
  color: var(--white);
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 32px;
}

.hero-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-placeholder {
  font-size: 120px;
  opacity: 0.8;
}

.features {
  padding: 80px 0;
  background: var(--white);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-card {
  text-align: center;
  padding: 32px;
  background: var(--accent);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  margin-bottom: 12px;
  color: var(--text);
}

.feature-card p {
  color: var(--text-light);
}

.featured-products {
  padding: 80px 0;
  background: var(--accent);
}

.section-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 48px;
  color: var(--text);
}

.empty-state {
  text-align: center;
  padding: 48px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--text-light);
  font-size: 18px;
}

.products-grid {
  margin-top: 32px;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    padding: 60px 20px;
    min-height: auto;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-placeholder {
    font-size: 80px;
  }
}
</style>

