var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-CPqROK/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-CPqROK/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// worker/index.js
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (url.pathname === "/health" || url.pathname === "/api/health") {
      return jsonResponse({
        status: "ok",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        service: "jewelry-api"
      }, corsHeaders);
    }
    if (url.pathname === "/api/products" && request.method === "GET") {
      return handleGetProducts(request, env, corsHeaders);
    }
    if (url.pathname.startsWith("/api/products/") && request.method === "GET") {
      const id = url.pathname.split("/").pop();
      return handleGetProduct(id, env, corsHeaders);
    }
    if (url.pathname === "/api/products" && request.method === "POST") {
      return handleCreateProduct(request, env, corsHeaders);
    }
    if (url.pathname.startsWith("/api/products/") && request.method === "PUT") {
      const id = url.pathname.split("/").pop();
      return handleUpdateProduct(id, request, env, corsHeaders);
    }
    if (url.pathname.startsWith("/api/products/") && request.method === "DELETE") {
      const id = url.pathname.split("/").pop();
      return handleDeleteProduct(id, env, corsHeaders);
    }
    return jsonResponse({
      error: "Not Found",
      path: url.pathname,
      method: request.method
    }, corsHeaders, 404);
  }
};
async function handleGetProducts(request, env, corsHeaders) {
  try {
    if (!env.DB) {
      return jsonResponse({
        error: "Database not configured"
      }, corsHeaders, 503);
    }
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const sort = url.searchParams.get("sort") || "newest";
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 1e3);
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    switch (sort) {
      case "price_asc":
        query += " ORDER BY price ASC";
        break;
      case "price_desc":
        query += " ORDER BY price DESC";
        break;
      case "name":
        query += " ORDER BY name ASC";
        break;
      default:
        query += " ORDER BY created_at DESC";
    }
    query += " LIMIT ?";
    params.push(limit);
    const result = await env.DB.prepare(query).bind(...params).all();
    return jsonResponse({
      products: result.results || [],
      total: result.results?.length || 0
    }, corsHeaders);
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse(error, corsHeaders);
  }
}
__name(handleGetProducts, "handleGetProducts");
async function handleGetProduct(id, env, corsHeaders) {
  try {
    if (!env.DB) {
      return jsonResponse({
        error: "Database not configured"
      }, corsHeaders, 503);
    }
    if (!id || isNaN(id)) {
      return jsonResponse({
        error: "Invalid product ID"
      }, corsHeaders, 400);
    }
    const result = await env.DB.prepare(
      "SELECT * FROM products WHERE id = ?"
    ).bind(id).first();
    if (!result) {
      return jsonResponse({
        error: "Product not found"
      }, corsHeaders, 404);
    }
    return jsonResponse({ product: result }, corsHeaders);
  } catch (error) {
    console.error("Error fetching product:", error);
    return errorResponse(error, corsHeaders);
  }
}
__name(handleGetProduct, "handleGetProduct");
async function handleCreateProduct(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { name, category, price, description, emoji, material, size } = body;
    if (!name || !category || !price) {
      return new Response(JSON.stringify({
        error: "Missing required fields: name, category, price"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(
      `INSERT INTO products (name, category, price, description, emoji, material, size, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).bind(name, category, price, description || null, emoji || "\u{1F48E}", material || null, size || null).run();
    const result = await env.DB.prepare(
      "SELECT * FROM products WHERE id = last_insert_rowid()"
    ).first();
    return jsonResponse({ product: result }, corsHeaders, 201);
  } catch (error) {
    return errorResponse(error, corsHeaders);
  }
}
__name(handleCreateProduct, "handleCreateProduct");
async function handleUpdateProduct(id, request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { name, category, price, description, emoji, material, size } = body;
    const updates = [];
    const params = [];
    if (name) {
      updates.push("name = ?");
      params.push(name);
    }
    if (category) {
      updates.push("category = ?");
      params.push(category);
    }
    if (price !== void 0) {
      updates.push("price = ?");
      params.push(price);
    }
    if (description !== void 0) {
      updates.push("description = ?");
      params.push(description);
    }
    if (emoji) {
      updates.push("emoji = ?");
      params.push(emoji);
    }
    if (material !== void 0) {
      updates.push("material = ?");
      params.push(material);
    }
    if (size !== void 0) {
      updates.push("size = ?");
      params.push(size);
    }
    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: "No fields to update" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    updates.push("updated_at = datetime('now')");
    params.push(id);
    const updateResult = await env.DB.prepare(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`
    ).bind(...params).run();
    if (updateResult.changes === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare(
      "SELECT * FROM products WHERE id = ?"
    ).bind(id).first();
    return jsonResponse({ product: result }, corsHeaders);
  } catch (error) {
    return errorResponse(error, corsHeaders);
  }
}
__name(handleUpdateProduct, "handleUpdateProduct");
async function handleDeleteProduct(id, env, corsHeaders) {
  try {
    const result = await env.DB.prepare(
      "DELETE FROM products WHERE id = ?"
    ).bind(id).run();
    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    return jsonResponse({ message: "Product deleted successfully" }, corsHeaders);
  } catch (error) {
    return errorResponse(error, corsHeaders);
  }
}
__name(handleDeleteProduct, "handleDeleteProduct");
function jsonResponse(data, corsHeaders, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}
__name(jsonResponse, "jsonResponse");
function errorResponse(error, corsHeaders) {
  return new Response(JSON.stringify({
    error: error.message || "Internal server error"
  }), {
    status: 500,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}
__name(errorResponse, "errorResponse");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-CPqROK/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-CPqROK/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
