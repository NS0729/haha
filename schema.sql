-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '💎',
  material TEXT,
  size TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_price ON products(price);

-- 插入示例数据
INSERT INTO products (name, category, price, description, emoji, material, size) VALUES
('经典黄金戒指', '戒指', 2999.00, '18K黄金打造，经典设计，适合日常佩戴', '💍', '18K金', '标准'),
('珍珠项链', '项链', 1899.00, '精选天然珍珠，优雅大方，展现女性魅力', '📿', '天然珍珠', '45cm'),
('钻石耳环', '耳环', 4999.00, '精美钻石镶嵌，闪耀夺目，适合重要场合', '💎', '18K金+钻石', '标准'),
('翡翠手镯', '手镯', 8999.00, '上等翡翠材质，温润如玉，传承经典', '🟢', '天然翡翠', '内径58mm'),
('玫瑰金胸针', '胸针', 1299.00, '玫瑰金材质，精致工艺，点缀优雅', '🌹', '18K玫瑰金', '3cm'),
('蓝宝石戒指', '戒指', 6999.00, '天然蓝宝石，深邃蓝色，高贵典雅', '💙', '18K白金+蓝宝石', '标准'),
('银质项链', '项链', 899.00, '925纯银，简约设计，百搭单品', '✨', '925银', '40cm'),
('珍珠耳环', '耳环', 1599.00, '天然珍珠，温润光泽，优雅气质', '🌊', '18K金+珍珠', '标准');

