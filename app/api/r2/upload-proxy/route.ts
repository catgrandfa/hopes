import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 开始处理代理上传请求')

    const formData = await req.formData()
    const file = formData.get('file') as File
    const key = formData.get('key') as string

    if (!file || !key) {
      return NextResponse.json(
        { error: '缺少文件或键参数' },
        { status: 400 }
      )
    }

    console.log('📄 文件信息:', {
      name: file.name,
      type: file.type,
      size: file.size,
      key: key
    })

    // 直接上传到 R2
    const putCmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: file.type,
      Body: file,
    })

    console.log('📤 开始上传到 R2...')
    const result = await s3.send(putCmd)
    console.log('✅ 上传成功:', result)

    // 构建公共 URL
    const publicBase = process.env.R2_PUBLIC_BASE
    const publicUrl = publicBase ? `${publicBase}/${key}` : null

    return NextResponse.json({
      success: true,
      key,
      publicUrl,
      etag: result.ETag,
      contentType: file.type,
      size: file.size
    })
  } catch (err: any) {
    console.error('❌ 代理上传失败:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
      code: err?.Code
    })

    return NextResponse.json(
      {
        error: '上传失败',
        detail: err?.message || String(err),
        code: err?.Code || 'UNKNOWN'
      },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'