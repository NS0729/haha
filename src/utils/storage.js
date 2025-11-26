// LocalStorage 工具函数

export const storage = {
  // 获取
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },

  // 设置
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      return false
    }
  },

  // 删除
  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },

  // 清空
  clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

// 收藏功能
export const favorites = {
  key: 'jewelry_favorites',
  
  getAll() {
    return storage.get(this.key, [])
  },

  add(productId) {
    const favorites = this.getAll()
    if (!favorites.includes(productId)) {
      favorites.push(productId)
      storage.set(this.key, favorites)
    }
    return favorites
  },

  remove(productId) {
    const favorites = this.getAll()
    const index = favorites.indexOf(productId)
    if (index > -1) {
      favorites.splice(index, 1)
      storage.set(this.key, favorites)
    }
    return favorites
  },

  has(productId) {
    return this.getAll().includes(productId)
  },

  toggle(productId) {
    if (this.has(productId)) {
      return this.remove(productId)
    } else {
      return this.add(productId)
    }
  }
}

// 购物车功能
export const cart = {
  key: 'jewelry_cart',
  
  getAll() {
    return storage.get(this.key, [])
  },

  add(product, quantity = 1) {
    const cart = this.getAll()
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        category: product.category,
        quantity
      })
    }
    
    storage.set(this.key, cart)
    // 触发自定义事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'))
    }
    return cart
  },

  remove(productId) {
    const cart = this.getAll()
    const filtered = cart.filter(item => item.id !== productId)
    storage.set(this.key, filtered)
    return filtered
  },

  updateQuantity(productId, quantity) {
    const cart = this.getAll()
    const item = cart.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        return this.remove(productId)
      }
      item.quantity = quantity
      storage.set(this.key, cart)
    }
    return cart
  },

  clear() {
    storage.set(this.key, [])
    return []
  },

  getTotalItems() {
    return this.getAll().reduce((sum, item) => sum + item.quantity, 0)
  },

  getTotalPrice() {
    return this.getAll().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }
}

