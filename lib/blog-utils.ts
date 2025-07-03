export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 더미 데이터
let blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '정말의 미수금, 회수 어떻게하나.',
    content: `<p><strong>🟡 회수 어떻게 받아내나...</strong> 정말의 미수금, 회수 어떻게하나.</p>
    <p>정말의 미수금 회수 어떻게하나.</p>
    <p>다음 내용, 파트, 목록 등을 기준으로 하여 회수를 기준으로 하고, 방법을 정리하면 다음과 같습니다.</p>
    <p>하지만 모든 경우 사례에,</p>
    <p><em>"이런 정말로는 미수금을 수 없다"</em> 라고 정리합니다.</p>
    <p><strong>1. 기본적인 신용정보를 수 있습니다.</strong></p>
    <ul>
      <li>기본적인 신용정보를 수 있습니다.</li>
      <li>그 정보의 신용정보를 수 있습니다.</li>
      <li>그 사업자가 기본 정보 정보, 해당 문의 정리하고 수 있습니다.</li>
    </ul>
    <p><strong>2. 기본적인 정보 국세청 정보</strong></p>
    <ul>
      <li>오전 기본, 사업자 신용정보를 신용정보 정보</li>
      <li>이런 정보가 기본 정보 정보</li>
    </ul>`,
    createdAt: '2025-07-02',
    updatedAt: '2025-07-02'
  },
  {
    id: '2',
    title: '내용정보가 받는다는 방법 정리',
    content: `<p>내용정보가 받는다는 방법 정리에 대한 상세한 설명입니다.</p>
    <p>이 글에서는 다양한 방법들을 소개하고 있습니다.</p>`,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    title: '정말의 미수금, 회수 어떻게하나.',
    content: `<p>정말의 미수금 회수에 대한 또 다른 접근 방법을 설명합니다.</p>`,
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13'
  },
  {
    id: '4',
    title: '내용정보가 받는다는 방법 정리',
    content: `<p>내용정보 수집과 활용에 대한 체계적인 가이드입니다.</p>`,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '5',
    title: '내용정보가 받는다는 방법 정리',
    content: `<p>최신 업데이트된 내용정보 처리 방법론입니다.</p>`,
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11'
  }
];

// 모든 블로그 포스트 가져오기
export const getBlogPosts = (): BlogPost[] => {
  return [...blogPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 특정 블로그 포스트 가져오기
export const getBlogPost = (id: string): BlogPost | null => {
  return blogPosts.find(post => post.id === id) || null;
};

// 새 블로그 포스트 생성
export const createBlogPost = (data: { title: string; content: string }): BlogPost => {
  const newPost: BlogPost = {
    id: Date.now().toString(),
    title: data.title,
    content: data.content,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  blogPosts.unshift(newPost);
  return newPost;
};

// 블로그 포스트 업데이트
export const updateBlogPost = (id: string, data: { title: string; content: string }): BlogPost | null => {
  const postIndex = blogPosts.findIndex(post => post.id === id);
  if (postIndex === -1) return null;
  
  blogPosts[postIndex] = {
    ...blogPosts[postIndex],
    title: data.title,
    content: data.content,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  return blogPosts[postIndex];
};

// 블로그 포스트 삭제
export const deleteBlogPost = (id: string): boolean => {
  const postIndex = blogPosts.findIndex(post => post.id === id);
  if (postIndex === -1) return false;
  
  blogPosts.splice(postIndex, 1);
  return true;
};