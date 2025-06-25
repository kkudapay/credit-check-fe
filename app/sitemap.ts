//sitemap.xml을 생성하는 코드를 담은 파일. changeFrequency 수정해야할듯?
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://kkudacheck.kr/biz',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}