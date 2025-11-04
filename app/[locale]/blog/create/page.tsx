import { Metadata } from "next";
import { BlogEditor } from "@/components/editor/blog-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "创建博客",
  description: "创建新的博客文章",
};

async function createBlogPost(data: {
  title: string;
  content: string;
  coverImage?: string;
}) {
  // 这里应该调用后端 API 来保存博客文章
  // 目前只是模拟保存，实际项目中需要集成数据库操作

  console.log("创建博客文章:", data);

  // 模拟 API 调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 这里应该返回保存后的文章 ID 或跳转到文章页面
  return { success: true, id: "new-post-id" };
}

export default function CreateBlogPage() {
  const handleSave = async (data: {
    title: string;
    content: string;
    coverImage?: string;
  }) => {
    "use server";

    try {
      const result = await createBlogPost(data);

      if (result.success) {
        // 保存成功后重定向到博客列表或文章页面
        redirect("/blog");
      }
    } catch (error) {
      console.error("保存博客失败:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">创建博客</h1>
          <p className="text-muted-foreground">
            编写并发布新的博客文章
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>编写文章</CardTitle>
            <CardDescription>
              使用 Markdown 语法编写文章内容，支持图片上传和实时预览
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BlogEditor onSave={handleSave} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用提示</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Markdown 语法</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code># 标题</code> - 一级标题</li>
                <li>• <code>## 标题</code> - 二级标题</li>
                <li>• <code>**粗体**</code> - 粗体文字</li>
                <li>• <code>*斜体*</code> - 斜体文字</li>
                <li>• <code>- 列表项</code> - 无序列表</li>
                <li>• <code>[链接文本](URL)</code> - 链接</li>
                <li>• <code>![图片描述](图片URL)</code> - 图片</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">图片上传</h4>
              <p className="text-sm text-muted-foreground">
                点击图片上传区域或拖拽图片文件，上传成功后会自动在光标位置插入图片链接。
                支持 PNG、JPG、WEBP、GIF、AVIF 格式，最大 10MB。
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">保存文章</h4>
              <p className="text-sm text-muted-foreground">
                填写标题和内容后点击&quot;保存文章&quot;按钮，保存成功后会自动跳转到博客列表页面。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}