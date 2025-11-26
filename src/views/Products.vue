<template>
  <div class="products-page">
    <div class="container">
      <div class="page-header">
        <h1>所有产品</h1>
        <p>探索我们的精美首饰收藏</p>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>分类:</label>
          <select v-model="selectedCategory" class="filter-select">
            <option value="">全部</option>
            <option value="戒指">戒指</option>
            <option value="项链">项链</option>
            <option value="耳环">耳环</option>
            <option value="手镯">手镯</option>
            <option value="胸针">胸针</option>
          </select>
        </div>
        <div class="filter-group">
          <label>排序:</label>
          <select v-model="sortBy" class="filter-select">
            <option value="newest">最新</option>
            <option value="price_asc">价格: 低到高</option>
            <option value="price_desc">价格: 高到低</option>
            <option value="name">名称</option>
          </select>
        </div>
      </div>

      <LoadingSpinner v-if="loading" message="加载产品中..." />
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>{{ error }}</h3>
        <button @click="loadProducts" class="btn btn-primary">重试</button>
      </div>
      <div v-else-if="products.length" class="products-grid grid-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>未找到产品</h3>
        <p>尝试调整筛选条件或搜索关键词</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { api } from '../utils/api'

const route = useRoute()
const products = ref([])
const loading = ref(true)
const error = ref(null)
const selectedCategory = ref('')
const sortBy = ref('newest')
const toast = inject('toast', () => {})

const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const params = {
      category: selectedCategory.value || undefined,
      search: route.query.search,
      sort: sortBy.value
    }
    const data = await api.getProducts(params)
    products.value = data.products || []
  } catch (err) {
    error.value = err.message || '加载产品失败'
    toast(error.value, 'error')
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})

watch([selectedCategory, sortBy, () => route.query.search], () => {
  loadProducts()
})
</script>

<style scoped>
.products-page {
  padding: 48px 0;
  min-height: 60vh;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-header h1 {
  font-size: 42px;
  margin-bottom: 12px;
  color: var(--text);
}

.page-header p {
  font-size: 18px;
  color: var(--text-light);
}

.filters {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group label {
  font-weight: 500;
  color: var(--text);
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: var(--white);
  cursor: pointer;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
}

.error-state {
  text-align: center;
  padding: 64px 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h3 {
  margin-bottom: 16px;
  color: var(--text);
}

.empty-state {
  text-align: center;
  padding: 64px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin-bottom: 8px;
  color: var(--text);
}

.empty-state p {
  color: var(--text-light);
}

.products-grid {
  margin-top: 32px;
}
</style>

