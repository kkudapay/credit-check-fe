'use client'


import { showAllUrlPath, showSearchedUrlPath } from '@/lib/blog-utils';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react'


interface SearchUrlProps {
    searchQuery: string;
    onChange: (content: string) => void;
}

export default function SearchUrl({ searchQuery, onChange }: SearchUrlProps) {
    const [searchResults, setSearchResults] = useState<string[] | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isClicked, setIsClicked] = useState(true)


    const updateUrlPath = (updatedUrlPath: string) => {
        onChange(updatedUrlPath);
    };


    const searchUrlPath = () => {
        const raw = window.sessionStorage.getItem('url_path_search');
        const cache = raw ? JSON.parse(raw) : {};
        if (cache && cache['result']) {
            const filteredNonNull = (cache['result'] ?? []).filter((item: string) => item !== null);
            const filteredResults = (filteredNonNull ?? []).filter((item: string) =>
                item.includes(searchQuery)
            );
            setSearchResults(filteredResults)
        } else {
            const searchFunc = async () => {
                //const result = await showSearchedUrlPath(searchQuery)
                const result = await showAllUrlPath()
                if (result) {
                    const filteredNonNull = (result ?? []).filter((item: string) => item !== null);
                    const filteredResults = (filteredNonNull ?? []).filter((item: string) =>
                item.includes(searchQuery));
                    setSearchResults(filteredResults);
                }
                
                cache['result'] = result;
                window.sessionStorage.setItem('url_path_search', JSON.stringify(cache));
            }
            searchFunc();
        }
    }

    const showAll = () => {
        const raw = window.sessionStorage.getItem('url_path_search');
        const cache = raw ? JSON.parse(raw) : {};

        if (cache && cache['result']) {
            setSearchResults(cache['result'])} else {
        const searchFunc = async () => {
            const result = await showAllUrlPath()
            setSearchResults(result)
        }
        searchFunc();
    }
    }



    return (
        <>
            <div className="flex items-center justify-between ">
                <Input
                    type="text"
                    placeholder="이 포스트의 하위 URL 경로를 입력하세요"
                    value={searchQuery}
                    onChange={(e) => updateUrlPath(e.target.value)}
                    className="flex-1 mr-2 border-gray-300"
                    onKeyDown={(e) => { if (e.key === 'Enter') { searchUrlPath(); } }} />
                <div className="flex gap-2">
                    {isClicked ? (<><Button onClick={() => {
                        searchUrlPath();
                        setIsClicked(true);
                    }}>검색</Button>
                        <Button variant="outline" onClick={() => { showAll(); setIsClicked(false); }}>모두 보기</Button></>)
                        : (<><Button variant="outline" onClick={() => {
                            searchUrlPath();
                            setIsClicked(true);
                        }}>검색</Button>
                            <Button onClick={() => { showAll(); setIsClicked(false); }}>모두 보기</Button></>)}

                </div>
            </div>

            {/* 결과 토글 및 리스트 */}
            {searchResults ? (
                searchResults.length > 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-md pt-3 pb-3 px-2">
                        <div className='flex items-center mb-2'>
                            {searchResults.length > 2 ? (<><button
                                className="flex items-center text-sm text-gray-700"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >

                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}

                            </button> <span className="ml-1 font-medium">검색 결과</span></>) : (<span className="ml-1 px-4 font-medium">검색 결과</span>)}


                        </div>
                        <hr className='mb-3' />
                        <ul className="text-sm text-gray-800 space-y-1 pl-6 ">
                            {(isExpanded ? searchResults : searchResults.slice(0, 3)).map((result, index) => (
                                <li key={index}>{result}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <p>검색 결과가 없습니다.</p>
                    </div>
                )
            ) : null}



        </>

    );

}