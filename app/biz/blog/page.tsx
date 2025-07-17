'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogPosts, deleteBlogPost, deleteImageFromSupabase, type BlogPost } from '@/lib/blog-utils';
import { formatDate, isNewPost } from '@/lib/format-utils';
import HamburgerWithSidebar from '@/components/ui/HamburgerWithSidebar';
import DOMPurify from 'dompurify';
import { createClient } from '@/lib/supabaseClient';
import KkudaHeader from "@/components/ui/KkudaHeader";
import KkudaFooter from '@/components/ui/KkudaFooter';
import {extractImageUrlsFromContent} from '@/components/ui/rich-text-editor';
import defaultThumbnail from '@/src/image/image.png';
import { isCurrentSessionAdmin } from '@/lib/auth-utils';

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
      const currentSession = await isCurrentSessionAdmin();
      setIsAdmin(currentSession);
    };

    checkAdmin();

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.push('/biz');
  };

  const handlePostClick = (postId: number) => {
    
        router.push(`/biz/blog/${postId}`);
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
            <div className="min-h-screen">
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

                    {/* Blog Posts Grid */}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                                    onClick={() => handlePostClick(post.id)}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative">
                                        {post.thumbnail ? (<img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                                        />) : (<img
                                            src={defaultThumbnail.src}
                                            alt={post.title}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                                        />)}

                                        {isNewPost(post.createdAt) && (
                                            <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                NEW
                                            </span>
                                        )}
                                        {isAdmin && (
                                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                                    onClick={(e) => handleEditPost(post.id)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-800"
                                                    onClick={(e) => handleDeletePost(post.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col justify-between h-[125px]">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                                                {post.title}
                                            </h3>
                                        </div>

                                        {/* 날짜 영역 */}
                                        <div className="flex items-center space-x-1 text-gray-600 text-sm mt-2">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDate(post.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <KkudaFooter />
        </div>
    );
}