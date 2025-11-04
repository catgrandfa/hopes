"use client";

import { useState, useCallback, useRef } from "react";
import { ImageUploader } from "@/components/upload/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Image, Type, Eye, Save } from "lucide-react";

interface BlogEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialCoverImage?: string;
  onSave?: (_data: {
    title: string;
    content: string;
    coverImage?: string;
  }) => void;
  className?: string;
}

export function BlogEditor({
  initialTitle = "",
  initialContent = "",
  initialCoverImage = "",
  onSave,
  className,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = useCallback((result: {
    key: string;
    publicUrl: string | null;
    contentType: string;
  }) => {
    if (result.publicUrl) {
      // 在光标位置插入图片 markdown 语法
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = content.substring(0, start);
        const textAfter = content.substring(end);
        const imageMarkdown = `![图片](${result.publicUrl})`;

        const newContent = textBefore + imageMarkdown + textAfter;
        setContent(newContent);

        // 设置光标位置到插入图片后
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + imageMarkdown.length,
            start + imageMarkdown.length
          );
        }, 0);
      }
    }
  }, [content]);

  const handleCoverImageUpload = useCallback((result: {
    key: string;
    publicUrl: string | null;
    contentType: string;
  }) => {
    if (result.publicUrl) {
      setCoverImage(result.publicUrl);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      alert("请输入文章标题");
      return;
    }

    if (!content.trim()) {
      alert("请输入文章内容");
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.({
        title: title.trim(),
        content: content.trim(),
        coverImage: coverImage || undefined,
      });
    } finally {
      setIsSaving(false);
    }
  }, [title, content, coverImage, onSave]);

  const insertMarkdown = useCallback((markdown: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const textBefore = content.substring(0, start);
      const textAfter = content.substring(end);

      let newMarkdown = markdown;
      if (selectedText && markdown.includes("text")) {
        newMarkdown = markdown.replace("text", selectedText);
      }

      const newContent = textBefore + newMarkdown + textAfter;
      setContent(newContent);

      // 设置光标位置
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + newMarkdown.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  }, [content]);

  // 简单的 markdown 渲染（用于预览）
  const renderMarkdown = useCallback((text: string) => {
    return text
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-4" />')
      .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
      .replace(/\n\n/g, "</p><p>")
      .replace(/^\n/, "<p>")
      .replace(/\n$/, "</p>");
  }, []);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            博客编辑器
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 标题输入 */}
          <div className="space-y-2">
            <Label htmlFor="title">文章标题</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题..."
              className="text-lg"
            />
          </div>

          {/* 封面图片 */}
          <div className="space-y-2">
            <Label>封面图片</Label>
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="封面图片"
                  className="w-full h-48 object-cover rounded-md"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setCoverImage("")}
                >
                  移除
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  上传封面图片（可选）
                </p>
                <ImageUploader
                  onUploadComplete={handleCoverImageUpload}
                  className="border-0 shadow-none"
                />
              </div>
            )}
          </div>

          {/* 内容编辑器 */}
          <div className="space-y-2">
            <Label>文章内容</Label>
            <Tabs value={isPreview ? "preview" : "edit"} onValueChange={(value: string) => setIsPreview(value === "preview")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  编辑
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  预览
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-4">
                {/* Markdown 工具栏 */}
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown("**text**")}
                  >
                    粗体
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown("*text*")}
                  >
                    斜体
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown("## text")}
                  >
                    标题
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown("- ")}
                  >
                    列表
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkdown("[text](url)")}
                  >
                    链接
                  </Button>
                </div>

                {/* 文本编辑器 */}
                <Textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="开始编写你的文章内容... 支持 Markdown 语法"
                  className="min-h-[400px] font-mono"
                />

                {/* 图片上传区域 */}
                <div className="border rounded-md p-4">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    插入图片
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    上传图片后，会自动在光标位置插入图片
                  </p>
                  <ImageUploader
                    onUploadComplete={handleImageUpload}
                    onUploadError={(error) => {
                      console.error("图片上传失败:", error);
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div
                  className="prose prose-sm max-w-none min-h-[400px] p-4 border rounded-md"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving || !title.trim() || !content.trim()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "保存中..." : "保存文章"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}