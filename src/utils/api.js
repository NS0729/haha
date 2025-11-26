import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// 请求拦截器
client.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response
      const message = data?.error || `请求失败 (${status})`
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // 请求已发出但没有收到响应
      return Promise.reject(new Error('网络错误，请检查网络连接'))
    } else {
      // 其他错误
      return Promise.reject(new Error(error.message || '未知错误'))
    }
  }
)

export const api = {
  async getProducts(params = {}) {
    try {
      const { data } = await client.get('/products', { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async getProduct(id) {
    try {
      const { data } = await client.get(`/products/${id}`)
      return data
    } catch (error) {
      throw error
    }
  },

  async createProduct(product) {
    try {
      const { data } = await client.post('/products', product)
      return data
    } catch (error) {
      throw error
    }
  },

  async updateProduct(id, product) {
    try {
      const { data } = await client.put(`/products/${id}`, product)
      return data
    } catch (error) {
      throw error
    }
  },

  async deleteProduct(id) {
    try {
      const { data } = await client.delete(`/products/${id}`)
      return data
    } catch (error) {
      throw error
    }
  }
}

