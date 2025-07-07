'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getBlogPost, updateBlogPost, type BlogPost } from '@/lib/blog-utils';
import RichTextEditor from '@/components/ui/rich-text-editor';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const postId = Number(params.id);

  useEffect(() => {
  const timer = setTimeout(() => {
    const fetchPost = async () => {
      const blogPost = await getBlogPost(postId);
      if (blogPost) {
        setPost(blogPost);
        setTitle(blogPost.title);
        setContent(blogPost.content);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    };

    fetchPost();
  }, 500);

  return () => clearTimeout(timer);
}, [postId]);


  const handleBack = () => {
    router.push('/biz/blog');
  };

  const goHome = () => {
    router.push('/biz');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);

    // 저장 시뮬레이션
    setTimeout(() => {
      updateBlogPost(postId, {
        title: title.trim(),
        content: content
      });
      setIsSaving(false);
      router.push('/biz/blog');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HamburgerWithSidebar />
        <div className="bg-white border-b mb-20">
          <div className="mobile-container py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-1 text-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>뒤로</span>
              </Button>
              <div onClick={goHome} className="bg-orange-500 text-white px-3 py-2 rounded text-base font-medium mt-2 mb-2 cursor-pointer">
                꾸다 외상체크
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh/2)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HamburgerWithSidebar />
        <div className="bg-white border-b">
          <div className="mobile-container py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-1 text-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>뒤로</span>
              </Button>
              <div onClick={goHome} className="bg-orange-500 text-white px-3 py-2 rounded text-base font-medium mt-2 mb-2 cursor-pointer">
                꾸다 외상체크
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-container py-8">
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              존재하지 않는 게시글입니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HamburgerWithSidebar />
      
      {/* Header */}
      <div className="bg-white border-b mb-6">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-1 text-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>뒤로</span>
            </Button>
            <div onClick={goHome} className="bg-orange-500 text-white px-3 py-2 rounded text-base font-medium mt-2 mb-2 cursor-pointer">
              꾸다 외상체크
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mobile-container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">글 수정</h1>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>저장</span>
              </>
            )}
          </Button>
        </div>

        {/* Title Input */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-0 p-0 focus:ring-0 placeholder:text-gray-400"
          />
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-lg border border-gray-200">
          <RichTextEditor
            content={content}
            
            onChange={setContent}
            placeholder="내용을 입력하세요..."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8">
        <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto"></div>
      </div>
    </div>
  );
}