'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogPost, deleteBlogPost, deleteImageFromSupabase, type BlogPost } from '@/lib/blog-utils';
import { formatDate, isNewPost } from '@/lib/format-utils';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar';
import DOMPurify from 'dompurify';
import { getCurrentSession } from '@/lib/auth-utils';
import KkudaHeader from "@/components/ui/KkudaHeader";
import KkudaFooter from '@/components/ui/KkudaFooter';
import { extractImageUrlsFromContent } from '@/components/ui/rich-text-editor';
import { isCurrentSessionAdmin } from '@/lib/auth-utils';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  //const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [notFound, setNotFound] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);
  const postId = Number(params.postId);

  /*
  // 로그인 여부 확인
  useEffect(() => {
    const checkSession = async () => {
      const session = await getCurrentSession();
      setIsLoggedIn(!!session); // true 또는 false로 설정됨
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn === null) return; // 세션 확인 아직 안 끝났으면 아무것도 안함

    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const fetchPost = async () => {
        const blogPost = await getBlogPost(postId);
        if (blogPost) {
          setPost(blogPost);
        } else {
          setNotFound(true);
        }
        setIsLoading(false);
      };

      fetchPost();
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, postId]);
  */

  useEffect(() => {
      const timer = setTimeout(() => {
      const fetchPost = async () => {
        const blogPost = await getBlogPost(postId);
        if (blogPost) {
          setPost(blogPost);
        } else {
          setNotFound(true);
        }
        setIsLoading(false);
      };

      fetchPost();
    }, 500);
  
      
      const checkAdmin = async () => {
        const currentSession = await isCurrentSessionAdmin();
        setIsAdmin(currentSession);
      };
  
      checkAdmin();
  
      return () => clearTimeout(timer);
    }, []);






  const handleBack = () => {
    router.push('/blog');
  };

  const handleEdit = () => {
    router.push(`/blog/edit/${postId}`);
  };

  const handleDelete = async () => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      if (post) {
        const usedImages = extractImageUrlsFromContent(post.content);
        for (const url of usedImages) {
          await deleteImageFromSupabase(url);
        }
      }
      
      await deleteBlogPost(postId);
      router.push('/blog');
    }
  };

  if (isLoading) {
    return (
      <div>
        <HamburgerWithSidebar />
        <div className="flex items-center justify-center h-screen">
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
      <div>
        <HamburgerWithSidebar />
        <div className="min-h-screen">
          <KkudaHeader />
          <div className="mobile-container py-8">
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-4">존재하지 않는 게시글입니다.</p>
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>목록으로 돌아가기</span>
              </Button>
            </div>
          </div>
        </div>
        <KkudaFooter />
      </div>
    );
  }

  return (
    <div>
      <HamburgerWithSidebar />
      <div className="min-h-screen">
        <KkudaHeader />

        {/* Content */}
        <div className="mobile-container py-6 space-y-6">
          {/* Back Button */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>목록으로</span>
            </Button>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>수정</span>
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="flex items-center space-x-2 text-red-600 hover:text-red-800 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>삭제</span>
                </Button>
              </div>
            )}
          </div>

          {/* Post Content */}
          <article className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Thumbnail */}
            {post.thumbnail && (
              <div className="relative">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                {isNewPost(post.createdAt) && (
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                    NEW
                  </span>
                )}
              </div>
            )}

            {/* Post Header */}
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>

            </div>

            {/* Post Content */}
            <div className="p-6">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />
            </div>
          </article>

          {/* Navigation */}
          <div className="flex justify-center">
            <Button
              onClick={handleBack}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-2"
            >
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
      <KkudaFooter />
    </div>
  );
}