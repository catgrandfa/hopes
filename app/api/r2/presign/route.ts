import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

// 检查环境变量是否配置
const requiredEnvVars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET']
const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars)
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/avif',
])

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 开始处理预签名请求')

    // 检查环境变量
    const accountId = process.env.R2_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
    const bucket = process.env.R2_BUCKET

    console.log('📋 环境变量检查:', {
      hasAccountId: !!accountId,
      hasAccessKeyId: !!accessKeyId,
      hasSecretAccessKey: !!secretAccessKey,
      hasBucket: !!bucket,
      bucketName: bucket,
      accountId: accountId?.substring(0, 8) + '...',
    })

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
      return NextResponse.json(
        {
          error: 'R2 配置不完整',
          details: {
            hasAccountId: !!accountId,
            hasAccessKeyId: !!accessKeyId,
            hasSecretAccessKey: !!secretAccessKey,
            hasBucket: !!bucket,
          },
        },
        { status: 500 }
      )
    }

    const { filename, contentType } = await req.json()
    console.log('📝 请求参数:', { filename, contentType })

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename 和 contentType 必填' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json({ error: '仅允许上传图像类型' }, { status: 415 })
    }

    // 根据原始文件名推断扩展名（防御性处理）
    const ext = (filename as string).includes('.')
      ? filename.substring(filename.lastIndexOf('.')).toLowerCase()
      : ''

    // 生成固定前缀 Key：blog/image/<uuid><ext>
    const key = `blog/image/${randomUUID()}${ext}`
    console.log('🔑 生成的对象键:', key)

    // 预签名有效期（秒）
    const expiresIn = 60 * 2 // 2 分钟

    // 固定 Content-Type 到签名中，防止篡改
    const putCmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      // 也可加上 ContentMD5 以强校验：前端需计算并传入
      // ContentMD5: base64Md5,
    })

    console.log('🔐 开始生成预签名 URL...')
    const signedUrl = await getSignedUrl(s3, putCmd, { expiresIn })
    console.log('✅ 预签名 URL 生成成功:', signedUrl.substring(0, 100) + '...')

    // 若配置了公共访问域，返回可访问 URL 方便前端落库
    const publicBase = process.env.R2_PUBLIC_BASE
    const publicUrl = publicBase ? `${publicBase}/${key}` : null

    return NextResponse.json({
      key,
      signedUrl,
      expiresIn,
      publicUrl,
      contentType,
    })
  } catch (err: any) {
    console.error('❌ 预签名生成失败:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
      code: err?.Code,
      requestId: err?.requestId,
      cfId: err?.cfId,
    })

    return NextResponse.json(
      {
        error: '生成预签名失败',
        detail: err?.message || String(err),
        code: err?.Code || 'UNKNOWN',
        requestId: err?.requestId,
      },
      { status: 500 }
    )
  }
}

// 建议指定 runtime
export const runtime = 'nodejs'
