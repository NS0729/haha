// 测试 wrangler 配置的脚本
import { readFileSync } from 'fs';

try {
  const config = readFileSync('wrangler.toml', 'utf-8');
  console.log('✅ wrangler.toml 文件存在');
  
  // 检查基本配置
  if (!config.includes('name =')) {
    throw new Error('缺少 name 配置');
  }
  if (!config.includes('main =')) {
    throw new Error('缺少 main 配置');
  }
  
  console.log('✅ 基本配置检查通过');
  console.log('配置内容:');
  console.log(config);
} catch (error) {
  console.error('❌ 配置检查失败:', error.message);
  process.exit(1);
}

