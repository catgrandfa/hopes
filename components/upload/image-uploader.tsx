'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

interface ImageUploadResult {
  key: string
  publicUrl: string | null
  contentType: string
}

interface ImageUploaderProps {
  onUploadComplete?: (_result: ImageUploadResult) => void
  onUploadError?: (_error: string) => void
  className?: string
  maxFileSize?: number // in bytes, default 10MB
  accept?: string
}

export function ImageUploader({
  onUploadComplete,
  onUploadError,
  className,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  accept = 'image/*',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxFileSize) {
        return `文件大小不能超过 ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`
      }

      // Check file type
      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'image/avif',
      ]

      if (!allowedTypes.includes(file.type)) {
        return '仅支持 PNG, JPG, WEBP, GIF, AVIF 格式的图片'
      }

      return null
    },
    [maxFileSize]
  )

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        onUploadError?.(validationError)
        return
      }

      setIsUploading(true)
      setError(null)
      setUploadedUrl(null)

      try {
        // 1) 向后端要预签名
        const res = await fetch('/api/r2/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        })

        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || `预签名请求失败: ${res.status}`)
        }

        const { signedUrl, publicUrl, contentType, key } = await res.json()

        console.log('🔗 获取到预签名 URL:', signedUrl.substring(0, 100) + '...')
        console.log('📄 文件信息:', {
          name: file.name,
          type: file.type,
          size: file.size,
          contentType: contentType
        })

        // 2) 直传到 R2（PUT）
        const put = await fetch(signedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': contentType,
          },
          body: file,
        })

        console.log('📤 上传响应状态:', put.status, put.statusText)

        if (!put.ok) {
          const text = await put.text().catch(() => '')
          console.error('❌ 上传失败详情:', {
            status: put.status,
            statusText: put.statusText,
            headers: Object.fromEntries(put.headers.entries()),
            responseText: text
          })
          throw new Error(`上传失败: ${put.status} ${put.statusText} ${text}`)
        }

        console.log('✅ 上传成功!')

        // 3) 成功回调
        const result: ImageUploadResult = {
          key,
          publicUrl,
          contentType,
        }

        setUploadedUrl(publicUrl)
        onUploadComplete?.(result)
      } catch (e: any) {
        const errorMessage = e.message || String(e)
        setError(errorMessage)
        onUploadError?.(errorMessage)
      } finally {
        setIsUploading(false)
      }
    },
    [validateFile, onUploadComplete, onUploadError]
  )

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file) {
        uploadFile(file)
      }
    },
    [uploadFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect]
  )

  const resetUpload = useCallback(() => {
    setUploadedUrl(null)
    setError(null)
  }, [])

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-2 border-dashed transition-colors',
        isDragging && 'border-primary bg-primary/5',
        uploadedUrl && 'border-solid border-green-500',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="p-8">
        {!uploadedUrl ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {isUploading ? (
              <>
                <Loader2 className="text-primary h-12 w-12 animate-spin" />
                <p className="text-lg font-medium">上传中...</p>
                <p className="text-muted-foreground text-sm">正在将图片上传到云端存储</p>
              </>
            ) : (
              <>
                <ImageIcon className="text-muted-foreground h-12 w-12" />
                <div>
                  <p className="text-lg font-medium">拖拽图片到此处或点击上传</p>
                  <p className="text-muted-foreground text-sm">
                    支持 PNG, JPG, WEBP, GIF, AVIF 格式，最大{' '}
                    {(maxFileSize / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-input')?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    选择文件
                  </Button>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept={accept}
                  onChange={handleFileInput}
                  disabled={isUploading}
                  className="hidden"
                />
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              {uploadedUrl.startsWith('http') ? (
                <img
                  src={uploadedUrl}
                  alt="上传的图片"
                  className="h-64 w-full rounded-md object-cover"
                />
              ) : (
                <div className="bg-muted flex h-64 w-full items-center justify-center rounded-md">
                  <p className="text-muted-foreground">上传成功</p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={resetUpload}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-green-600">图片上传成功！</p>
              {uploadedUrl.startsWith('http') && (
                <p className="text-muted-foreground mt-1 text-xs break-all">{uploadedUrl}</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
