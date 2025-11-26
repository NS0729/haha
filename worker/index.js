export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Health check endpoint
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return jsonResponse({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'jewelry-api'
      }, corsHeaders)
    }

    // Router
    if (url.pathname === '/api/products' && request.method === 'GET') {
      return handleGetProducts(request, env, corsHeaders)
    }
    
    if (url.pathname.startsWith('/api/products/') && request.method === 'GET') {
      const id = url.pathname.split('/').pop()
      return handleGetProduct(id, env, corsHeaders)
    }
    
    if (url.pathname === '/api/products' && request.method === 'POST') {
      return handleCreateProduct(request, env, corsHeaders)
    }
    
    if (url.pathname.startsWith('/api/products/') && request.method === 'PUT') {
      const id = url.pathname.split('/').pop()
      return handleUpdateProduct(id, request, env, corsHeaders)
    }
    
    if (url.pathname.startsWith('/api/products/') && request.method === 'DELETE') {
      const id = url.pathname.split('/').pop()
      return handleDeleteProduct(id, env, corsHeaders)
    }

    return jsonResponse({ 
      error: 'Not Found',
      path: url.pathname,
      method: request.method
    }, corsHeaders, 404)
  }
}

async function handleGetProducts(request, env, corsHeaders) {
  try {
    // Check if DB is available
    if (!env.DB) {
      return jsonResponse({ 
        error: 'Database not configured' 
      }, corsHeaders, 503)
    }

    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const sort = url.searchParams.get('sort') || 'newest'
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 1000) // Max 1000

    let query = 'SELECT * FROM products WHERE 1=1'
    const params = []

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY price ASC'
        break
      case 'price_desc':
        query += ' ORDER BY price DESC'
        break
      case 'name':
        query += ' ORDER BY name ASC'
        break
      default:
        query += ' ORDER BY created_at DESC'
    }

    query += ' LIMIT ?'
    params.push(limit)

    const result = await env.DB.prepare(query).bind(...params).all()

    return jsonResponse({ 
      products: result.results || [],
      total: result.results?.length || 0
    }, corsHeaders)
  } catch (error) {
    console.error('Error fetching products:', error)
    return errorResponse(error, corsHeaders)
  }
}

async function handleGetProduct(id, env, corsHeaders) {
  try {
    if (!env.DB) {
      return jsonResponse({ 
        error: 'Database not configured' 
      }, corsHeaders, 503)
    }

    // Validate ID
    if (!id || isNaN(id)) {
      return jsonResponse({ 
        error: 'Invalid product ID' 
      }, corsHeaders, 400)
    }

    const result = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first()

    if (!result) {
      return jsonResponse({ 
        error: 'Product not found' 
      }, corsHeaders, 404)
    }

    return jsonResponse({ product: result }, corsHeaders)
  } catch (error) {
    console.error('Error fetching product:', error)
    return errorResponse(error, corsHeaders)
  }
}

async function handleCreateProduct(request, env, corsHeaders) {
  try {
    const body = await request.json()
    const { name, category, price, description, emoji, material, size } = body

    if (!name || !category || !price) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: name, category, price' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    await env.DB.prepare(
      `INSERT INTO products (name, category, price, description, emoji, material, size, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).bind(name, category, price, description || null, emoji || '💎', material || null, size || null).run()

    // Get the inserted product
    const result = await env.DB.prepare(
      'SELECT * FROM products WHERE id = last_insert_rowid()'
    ).first()

    return jsonResponse({ product: result }, corsHeaders, 201)
  } catch (error) {
    return errorResponse(error, corsHeaders)
  }
}

async function handleUpdateProduct(id, request, env, corsHeaders) {
  try {
    const body = await request.json()
    const { name, category, price, description, emoji, material, size } = body

    const updates = []
    const params = []

    if (name) {
      updates.push('name = ?')
      params.push(name)
    }
    if (category) {
      updates.push('category = ?')
      params.push(category)
    }
    if (price !== undefined) {
      updates.push('price = ?')
      params.push(price)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      params.push(description)
    }
    if (emoji) {
      updates.push('emoji = ?')
      params.push(emoji)
    }
    if (material !== undefined) {
      updates.push('material = ?')
      params.push(material)
    }
    if (size !== undefined) {
      updates.push('size = ?')
      params.push(size)
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    updates.push("updated_at = datetime('now')")
    params.push(id)

    const updateResult = await env.DB.prepare(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...params).run()

    if (updateResult.changes === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get the updated product
    const result = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first()

    return jsonResponse({ product: result }, corsHeaders)
  } catch (error) {
    return errorResponse(error, corsHeaders)
  }
}

async function handleDeleteProduct(id, env, corsHeaders) {
  try {
    const result = await env.DB.prepare(
      'DELETE FROM products WHERE id = ?'
    ).bind(id).run()

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return jsonResponse({ message: 'Product deleted successfully' }, corsHeaders)
  } catch (error) {
    return errorResponse(error, corsHeaders)
  }
}

function jsonResponse(data, corsHeaders, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}

function errorResponse(error, corsHeaders) {
  return new Response(JSON.stringify({ 
    error: error.message || 'Internal server error' 
  }), {
    status: 500,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}

