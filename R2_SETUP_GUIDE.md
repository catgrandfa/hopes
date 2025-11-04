# Cloudflare R2 图片直传功能设置指南

本指南将帮助您配置和使用基于 Cloudflare R2 的图片直传功能。

## 功能概述

✅ **已实现功能**：
- 基于预签名 URL 的图片直传到 Cloudflare R2
- 支持多种图片格式（PNG, JPG, WEBP, GIF, AVIF）
- 文件大小限制（默认 10MB）
- 自动生成唯一文件名
- 集成到博客编辑器中
- 支持 Markdown 格式
- **已验证**：预签名生成和文件上传功能完全正常

## 问题解决记录

### ❌ 原始问题
上传接口最初失败，可能的原因：
1. 使用了 `forcePathStyle: true` 配置
2. endpoint 配置可能不正确
3. 错误处理不够详细

### ✅ 解决方案
1. **移除 `forcePathStyle: true`**：根据 Cloudflare R2 官方文档，此配置不是必需的
2. **直接构造 endpoint**：使用 `https://${ACCOUNT_ID}.r2.cloudflarestorage.com` 格式
3. **增强错误处理**：添加详细的日志输出和错误诊断

### 🔧 修复的关键代码变更

```typescript
// 修复前
const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: { ... },
  forcePathStyle: true, // ❌ 移除此配置
});

// 修复后
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { ... },
  // ❌ 不需要 forcePathStyle
});
```

### 🧪 测试验证
```bash
# 测试预签名接口
curl -X POST http://localhost:3333/api/r2/presign \
  -H "Content-Type: application/json" \
  -d '{"filename":"test.png","contentType":"image/png"}'

# 返回成功响应，包含 signedUrl
# 然后使用返回的 signedUrl 进行文件上传
```

## 1. 环境配置

在 `.env` 文件中配置以下环境变量：

```bash
# R2 Storage Configuration
R2_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxx
R2_ACCESS_KEY_ID=XXXXXXXXXXXXXXXXXXXX
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com
R2_PUBLIC_BASE=https://assets.example.com
```

### 如何获取 R2 配置信息

1. **登录 Cloudflare Dashboard**
2. 进入 **R2 Object Storage**
3. 创建新的 R2 存储桶
4. 在 "Manage R2 API tokens" 中创建 API 令牌
5. 获取 Account ID、Access Key ID 和 Secret Access Key

## 2. R2 存储桶配置

### CORS 配置（重要！）

**❌ 如果不配置 CORS，前端上传会失败并报错：**
```
Access to fetch at 'https://...' from origin 'http://localhost:3333' has been blocked by CORS policy
```

在 R2 存储桶设置中配置 CORS 规则：

**方法 1：通过 Cloudflare Dashboard 配置**
1. 登录 Cloudflare Dashboard
2. 进入 R2 Object Storage
3. 选择你的存储桶
4. 点击 "Settings" → "CORS"
5. 添加以下 CORS 规则：

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3333",
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ],
    "AllowedMethods": [
      "PUT",
      "GET",
      "HEAD",
      "OPTIONS"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

**方法 2：通过 API 配置**
```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/r2/buckets/{bucket_name}/cors" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "AllowedOrigins": [
        "http://localhost:3000",
        "http://localhost:3333",
        "https://yourdomain.com"
      ],
      "AllowedMethods": ["PUT", "GET", "HEAD", "OPTIONS"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }
  ]'
```

**关键配置说明：**
- `AllowedOrigins`: 必须包含你的前端域名（包括本地开发端口）
- `AllowedMethods`: 必须包含 `PUT` 和 `OPTIONS`（预检请求）
- `AllowedHeaders`: 使用 `["*"]` 允许所有头部，或至少包含 `Content-Type`

### 公共访问配置

如果需要公开访问图片，请：

1. 在 R2 存储桶设置中启用 "Public access"
2. 配置自定义域名（可选）
3. 更新 `R2_PUBLIC_BASE` 环境变量

## 3. 功能使用

### 访问上传页面

1. **测试上传页面**：访问 `http://localhost:3333/upload`
2. **博客编辑器**：访问 `http://localhost:3333/zh/blog/create`

### 博客编辑器功能

1. **创建博客**：在博客列表页面点击"创建博客"按钮
2. **上传封面图片**：可以上传文章封面图片
3. **插入图片**：在编辑器中上传图片会自动插入 Markdown 语法
4. **实时预览**：支持 Markdown 实时预览

### 支持的图片格式

- PNG
- JPG/JPEG
- WEBP
- GIF
- AVIF

### 文件大小限制

- 单个文件最大 10MB
- 可在组件中自定义 `maxFileSize` 参数

## 4. API 接口

### 预签名接口：`/api/r2/presign`

**请求方法**：POST

**请求体**：
```json
{
  "filename": "example.png",
  "contentType": "image/png"
}
```

**响应**：
```json
{
  "key": "blog/image/uuid-filename.png",
  "signedUrl": "https://account.r2.cloudflarestorage.com/bucket/key",
  "expiresIn": 120,
  "publicUrl": "https://assets.example.com/blog/image/uuid-filename.png",
  "contentType": "image/png"
}
```

## 5. 组件使用

### ImageUploader 组件

```tsx
import { ImageUploader } from "@/components/upload/image-uploader";

<ImageUploader
  onUploadComplete={(result) => {
    console.log("上传成功:", result);
  }}
  onUploadError={(error) => {
    console.error("上传失败:", error);
  }}
  maxFileSize={10 * 1024 * 1024} // 10MB
/>
```

### BlogEditor 组件

```tsx
import { BlogEditor } from "@/components/editor/blog-editor";

<BlogEditor
  onSave={async (data) => {
    // 保存博客文章
    console.log("保存文章:", data);
  }}
/>
```

## 6. 文件存储结构

上传的图片会按以下结构存储：

```
R2 存储桶/
├── blog/
│   └── image/
│       ├── 550e8400-e29b-41d4-a716-446655440000.png
│       ├── 550e8400-e29b-41d4-a716-446655440001.jpg
│       └── ...
```

## 7. 安全考虑

- 预签名 URL 有效期为 2 分钟
- 固定 Content-Type 到签名中，防止文件类型篡改
- 客户端和服务端双重文件类型验证
- 文件大小限制防止恶意上传

## 8. 错误处理

常见错误及解决方案：

### ❌ CORS 错误（最常见前端问题）
**错误信息：**
```
Access to fetch at 'https://...' from origin 'http://localhost:3333' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**解决方案：**
1. **检查 R2 存储桶 CORS 配置**（见上面详细说明）
2. **确保包含正确的端口**：`http://localhost:3333` 而不是 `http://localhost:3000`
3. **等待配置生效**：CORS 配置可能需要几分钟才能生效
4. **清除浏览器缓存**：开发者工具 → Network → Disable cache

### 403 SignatureDoesNotMatch
- 检查 Content-Type 是否与签名一致
- 检查预签名 URL 是否过期（2分钟有效期）
- 验证 R2 配置是否正确

### 415 Unsupported Media Type
- 检查文件类型是否在允许列表中
- 确认前端和后端的文件类型验证一致

### 上传成功但无法访问
- 确认存储桶公共访问已启用
- 检查自定义域名配置
- 验证 `R2_PUBLIC_BASE` 设置

### 环境变量配置问题
**检查所有必需的环境变量：**
```bash
R2_ACCOUNT_ID=✅ 必需
R2_ACCESS_KEY_ID=✅ 必需
R2_SECRET_ACCESS_KEY=✅ 必需
R2_BUCKET=✅ 必需
R2_PUBLIC_BASE=⚪ 可选（用于公共访问）
```

## 9. 性能优化

- 使用 CDN 加速图片访问
- 图片压缩和格式转换
- 实现图片懒加载
- 考虑使用 WebP 格式

## 10. 下一步开发

可以扩展的功能：

- 批量图片上传
- 图片编辑和裁剪
- 图片水印
- 图片 CDN 集成
- 图片分析和统计
- 存储使用量监控

---

**注意**：使用前请确保已正确配置所有环境变量和 R2 存储桶设置。