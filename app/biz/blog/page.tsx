'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogPosts, deleteBlogPost, deleteImageFromSupabase, type BlogPost } from '@/lib/blog-utils';
import { formatDate, isNewPost } from '@/lib/format-utils';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar';
import DOMPurify from 'dompurify';
import { createClient } from '@/lib/supabaseClient';
import KkudaHeader from "@/components/ui/KkudaHeader";
import KkudaFooter from '@/components/ui/KkudaFooter';
import {extractImageUrlsFromContent} from '@/components/ui/rich-text-editor';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const getContent = async () => {
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
        setIsLoading(false);
      }
      getContent();

    }, 500);

    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const role = session?.user?.app_metadata?.role;
      setIsAdmin(role === 'admin');
    };

    checkAdmin();

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.push('/biz');
  };

  const handleCreatePost = () => {
    router.push('/biz/blog/create');
  };

  const handleEditPost = (postId: number) => {
    router.push(`/biz/blog/edit/${postId}`);
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deleteBlogPost(postId);

      const post = posts.find((p) => p.id === postId);
      if (post) {
  const usedImages = extractImageUrlsFromContent(post.content);
  for (const url of usedImages) {
    deleteImageFromSupabase(url);
  }
} 
      
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const togglePostExpansion = (postId: number) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  if (isLoading) {
    return (
      <div>
        <HamburgerWithSidebar />


        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">블로그를 불러오는 중...</p>
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
        {/* Page Title and Create Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">블로그</h1>
          {isAdmin && (
            <Button
              onClick={handleCreatePost}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>글 작성</span>
            </Button>
          )}
        </div>

        {/* Blog Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
             <div className="mobile-container min-h-[calc(150vh/2)] flex items-center justify-center">
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-4">아직 작성된 글이 없습니다.</p>
              {isAdmin && (
                <Button
                  onClick={handleCreatePost}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-2"
                >
                  첫 번째 글 작성하기
                </Button>
              )}
            </div>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Post Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => togglePostExpansion(post.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{post.title}</h3>
                        {isNewPost(post.createdAt) && (
                          <span className="bg-[#FF8D51] text-white text-[10px] px-1 py-0.5 rounded-full font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {expandedPosts.has(post.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedPosts.has(post.id) && (
                  <div className="border-t border-gray-100">
                    <div className="p-4">
                      <div
                        className="prose prose-sm max-w-none mb-4"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                      />
                      {/* Action Buttons */}
                      {isAdmin && (
                        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPost(post.id);
                            }}
                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                          >
                            <Edit className="h-4 w-4" />
                            <span>수정</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(post.id);
                            }}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>삭제</span>
                          </Button>
                        </div>)}

                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </div>
</div>
      <KkudaFooter/>
    </div>
  );
}