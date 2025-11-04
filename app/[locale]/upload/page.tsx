'use client'

import { ImageUploader } from '@/components/upload/image-uploader'
import { ImageUploaderProxy } from '@/components/upload/image-uploader-proxy'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Zap, Cloud } from 'lucide-react'

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">图片上传</h1>
          <p className="text-muted-foreground">
            基于 Cloudflare R2 的图片上传功能，支持多种图片格式
          </p>
        </div>

        {/* CORS 警告 */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>CORS 错误？</strong> 如果直传方式报 CORS 错误，请使用代理上传模式，
            或者按照下方说明配置 R2 存储桶的 CORS 规则。
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              直传模式
            </TabsTrigger>
            <TabsTrigger value="proxy" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              代理模式
            </TabsTrigger>
          </TabsList>

          <TabsContent value="direct" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  直传到 R2
                </CardTitle>
                <CardDescription>
                  文件直接从浏览器上传到 Cloudflare R2，不经过服务器
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  onUploadComplete={result => {
                    console.log('直传完成:', result)
                  }}
                  onUploadError={error => {
                    console.error('直传错误:', error)
                  }}
                  maxFileSize={10 * 1024 * 1024} // 10MB
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proxy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  代理上传
                </CardTitle>
                <CardDescription>
                  通过服务器代理上传，可绕过 CORS 限制
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploaderProxy
                  onUploadComplete={result => {
                    console.log('代理上传完成:', result)
                  }}
                  onUploadError={error => {
                    console.error('代理上传错误:', error)
                  }}
                  maxFileSize={10 * 1024 * 1024} // 10MB
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>CORS 配置指南</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                如果使用直传模式遇到 CORS 错误，请按以下步骤配置 R2 存储桶：
              </AlertDescription>
            </Alert>

            <div>
              <h4 className="mb-2 font-medium">配置步骤：</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>登录 Cloudflare Dashboard</li>
                <li>进入 R2 Object Storage</li>
                <li>选择存储桶：<code>{`blog`}</code></li>
                <li>点击 &quot;Settings&quot; → &quot;CORS&quot;</li>
                <li>添加以下 CORS 规则</li>
              </ol>
            </div>

            <div className="bg-muted p-3 rounded-md">
              <h4 className="mb-2 font-mono text-sm">CORS 规则配置：</h4>
              <pre className="text-xs overflow-x-auto">
{`[
  {
    "AllowedOrigins": [
      "http://localhost:3333",
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "PUT", "GET", "HEAD", "OPTIONS"
    ],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]`}
              </pre>
            </div>

            <div>
              <h4 className="mb-2 font-medium">支持的功能：</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• <strong>格式支持</strong>：PNG, JPG/JPEG, WEBP, GIF, AVIF</li>
                <li>• <strong>文件大小</strong>：单个文件最大 10MB</li>
                <li>• <strong>存储路径</strong>：blog/image/[uuid].[ext]</li>
                <li>• <strong>上传模式</strong>：直传模式（推荐）或代理模式</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
