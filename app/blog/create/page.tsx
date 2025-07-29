'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronsRightLeftIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBlogPost, showAllUrlPath, showSearchedUrlPath } from '@/lib/blog-utils';
import { RichTextEditor, deleteUnusedURLs, extractImageUrlsFromContent } from '@/components/ui/rich-text-editor';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar';
import { getCurrentSession } from '@/lib/auth-utils';
import KkudaHeader from "@/components/ui/KkudaHeader";
import KkudaFooter from '@/components/ui/KkudaFooter';
import SearchUrl from '@/components/ui/SearchUrl';
import { toast } from 'sonner';
import { url } from 'node:inspector';




export default function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [urlPath, seturlPath] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  // 로그인 여부 확인
  useEffect(() => {

    const checkSession = async () => {
      const session = await getCurrentSession();
      setIsLoggedIn(!!session);
    };

    checkSession();
  }, []);

  useEffect(() => {

    if (isLoggedIn === null) return; // 세션 확인 아직 안 끝났으면 아무것도 안함

    if (isLoggedIn) {
      setIsLoading(false);
      return;
    }


  }, [isLoggedIn]);

  const isValidUrlPath = () => {
    const regex = /^[a-zA-Z0-9-_\.]+$/;
    return regex.test(urlPath);
  };

  const isUrlSame = async () => {
    const raw = window.sessionStorage.getItem('url_path_search');
    const cache = raw ? JSON.parse(raw) : {};

    if (cache && cache['result']) {
      const filteredNonNull = (cache['result'] ?? []).filter((item: string) => item !== null);
      const filteredResults = filteredNonNull.filter((item: string) =>
        item === urlPath 
      );
      return filteredResults.length > 0;

    } else {
      const result = await showAllUrlPath();
      if (result) {
        const filteredNonNull = (result ?? []).filter((item: string) => item !== null);
        const filteredResults = filteredNonNull.filter((item: string) =>
          item === urlPath 
        );
        cache['result'] = result;
        window.sessionStorage.setItem('url_path_search', JSON.stringify(cache));
        return filteredResults.length > 0;
      }
      return false;

    }

  };



  const handleBack = () => {
    router.push('/blog');
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

    if (!isValidUrlPath) {
      toast.error('URL에는 영문자, 숫자, - (하이픈), _ (밑줄), . (점)만 사용할 수 있습니다.')
      return;
    }

    const same = await isUrlSame();
    if (same) {
      toast.error('이미 사용된 하위 URL 경로입니다.')
      return;
    }

    setIsSaving(true);

    //사용되지 않은 사진 URL을 supabase에서 삭제
    deleteUnusedURLs(content);

    const thumbnail = extractImageUrlsFromContent(content)[0];


    try {
      await createBlogPost({
        title: title.trim(),
        content: content,
        thumbnail: thumbnail,
        urlPath: urlPath
      });

      router.push('/blog');
    } catch (error) {
      console.error('글 저장 실패:', error);
      alert('글 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };




  if (!isLoggedIn) {
    return (
      <div>
        <HamburgerWithSidebar />
        <div className="min-h-screen ">

          <div className="bg-white border-b">
            <div className="mobile-container py-4">
              <div className="flex items-center justify-between">
                <div onClick={goHome} className="text-orange-500 text-xl font-bold mt-2 mb-2 cursor-pointer ">
                  꾸다 외상체크
                </div>
              </div>
            </div>
          </div>

          <div className="mobile-container min-h-[calc(150vh/2)] flex items-center justify-center">
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                글을 작성할 권한이 없습니다.
              </p>
            </div>
          </div>
        </div>
        <KkudaFooter />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <HamburgerWithSidebar />


        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (


    <div>
      <HamburgerWithSidebar />
      <div className="min-h-screen ">
        <KkudaHeader />


        {/* Content */}
        <div className="mobile-container py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">글 작성</h1>
            <Button
              onClick={handleSave}
              disabled={isSaving || !title.trim() || !content.trim() || !urlPath.trim()}
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

          <SearchUrl
            searchQuery={urlPath}
            onChange={seturlPath} />

          {/* Content Editor */}
          <div className="bg-white rounded-lg border border-gray-200">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="내용을 입력하세요..."
            />
          </div>
        </div>
      </div>
      <KkudaFooter />
    </div>
  );
}