'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBlogPost } from '@/lib/blog-utils';
import RichTextEditor from '@/components/ui/rich-text-editor';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar';

export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

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

    
    try {
    await createBlogPost({
      title: title.trim(),
      content: content
    });

    router.push('/biz/blog');
  } catch (error) {
    console.error('글 저장 실패:', error);
    alert('글 저장 중 오류가 발생했습니다.');
  } finally {
    setIsSaving(false);
  }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">글 작성</h1>
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