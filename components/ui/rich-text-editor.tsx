'use client';

const MAX_HTML_LENGTH = 10000;

import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Minus,
  Type,
  Palette,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import purifier from '@/lib/purifier';
import { uploadImageToSupabase, deleteImageFromSupabase } from '@/lib/blog-utils'
import { getCurrentSession, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

function isHtmlEquivalent(html1: string, html2: string): boolean {
  const parser = new DOMParser();

  const doc1 = parser.parseFromString(html1, 'text/html');
  const doc2 = parser.parseFromString(html2, 'text/html');

  return doc1.body.isEqualNode(doc2.body);
}

function checkIfSanitized(originalHtml: string): boolean {
  const sanitized = purifier(originalHtml);
  console.log("전: ", originalHtml)
  console.log("후: ", sanitized )
  return isHtmlEquivalent(originalHtml, sanitized);
}

const finalImageURLs: string[] = [];

export function extractImageUrlsFromContent(htmlContent: string): string[] {
  const div = document.createElement('div');
  div.innerHTML = htmlContent;
  const imgs = div.querySelectorAll('img');
  return Array.from(imgs).map(img => img.src);
}


export function deleteUnusedURLs(content: string){
  const usedImages = extractImageUrlsFromContent(content);
  
  const unusedImages = finalImageURLs.filter(url => !usedImages.includes(url));
 
  for (const url of unusedImages) {
    deleteImageFromSupabase(url);
  }
}



export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<{ src: string; alt: string }[]>([]);
  const [imageAlt, setImageAlt] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [showHtmlDialog, setShowHtmlDialog] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');
  

  const fontSizes = [
    { label: '매우 작게', value: '1' },
    { label: '작게', value: '2' },
    { label: '보통', value: '3' },
    { label: '크게', value: '4' },
    { label: '매우 크게', value: '5' },
    { label: '특대', value: '6' },
    { label: '최대', value: '7' }
  ];

  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
    '#ff0000', '#ff6600', '#ffcc00', '#ffff00', '#ccff00', '#66ff00',
    '#00ff00', '#00ff66', '#00ffcc', '#00ffff', '#00ccff', '#0066ff',
    '#0000ff', '#6600ff', '#cc00ff', '#ff00ff', '#ff00cc', '#ff0066',
    '#8b4513', '#a0522d', '#cd853f', '#daa520', '#b8860b', '#ffd700'
  ];

  useEffect(() => {
    if (editorRef.current && !isFocused && content && editorRef.current.innerHTML !== content) {
      const clean = purifier(content);
      editorRef.current.innerHTML = clean;
    }
  }, [content, isFocused]);

  

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      const before = editorRef.current.innerHTML;
      const clean = purifier(before);

      if (clean.length > MAX_HTML_LENGTH) {
        alert(`글이 너무 깁니다. ${MAX_HTML_LENGTH}자 이내로 작성해주세요.`);
        return;
      }

      onChange(clean);
    }
  };

  const handleFontSize = (size: string) => {
    handleCommand('fontSize', size);
    setShowFontSizeDropdown(false);
  };

  const handleTextColor = (color: string) => {
    handleCommand('foreColor', color);
    setShowColorPalette(false);
  };


  const openLinkDialog = () => {
    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      !selection.isCollapsed &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      const range = selection.getRangeAt(0);
      const text = range.toString().trim();

      if (text.length === 0) {
        alert("빈 텍스트에는 링크를 걸 수 없습니다.");
        return;
      }

      const refinedRange = document.createRange();
      refinedRange.setStart(range.startContainer, range.startOffset);
      refinedRange.setEnd(range.endContainer, range.endOffset);
      setSavedRange(refinedRange);
      setShowLinkDialog(true);
    } else {
      alert("링크를 적용할 텍스트를 먼저 드래그로 선택하세요.");
    }
  };

  const insertLink = () => {
    if (!linkUrl || !savedRange || !editorRef.current) return;

    const anchor = document.createElement('a');
    anchor.href = linkUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.className = 'text-blue-600 hover:text-blue-800 underline';

    anchor.appendChild(savedRange.extractContents());
    savedRange.insertNode(anchor);




    const newRange = document.createRange();
    newRange.selectNode(anchor);




    updateContent();


    setLinkUrl('');
    setShowLinkDialog(false);
    console.log("저장하고 나서 range: ", savedRange);
    setSavedRange(null);


  };



  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    //파일 선택했을 때
    const selectedFiles = Array.from(files);
    setSelectedImageFiles((prev) => [...prev, ...selectedFiles]);

    const previewUrls = selectedFiles.map((file) => ({
  src: URL.createObjectURL(file),
  alt: '',
}));
    setImagePreviews((prev) => [...prev, ...previewUrls]);

    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // 재선택 허용
    }
  };

  //본문에 사진 넣기
  const insertImages = async () => {
    if (selectedImageFiles.length === 0 || !editorRef.current) return;

    editorRef.current.focus();
    const imageHtmls: string[] = [];
    for (let i = 0; i < selectedImageFiles.length; i++) {
      const file = selectedImageFiles[i];
      
      const imageUrl = await uploadImageToSupabase(file);

      const imageHtml = `<img src="${imageUrl}" alt="${imagePreviews[i].alt || 'image'}" class="max-w-full h-auto rounded-lg my-2" />`;
      handleCommand('insertHTML', imageHtml);
      imageHtmls.push(imageUrl);
    }
    //업로드 시 최종 업로드 이미지 검증을 위해 저장
    
    for (const url of imageHtmls) {
    finalImageURLs.push(url);
  }
  console.log("insert finalImageUrls: ", finalImageURLs)

    // 초기화
    setSelectedImageFiles([]);
    setImagePreviews([]);
    setImageAlt('');
    setShowImageDialog(false);
  };

  const handlePreviewImageDelete = (index: number) => {
    setSelectedImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
    const item = prev[index];
    if (item.src) {
      URL.revokeObjectURL(item.src);
    }
    return prev.filter((_, i) => i !== index);
  });
    
  };

const handleAltChange = (index: number, newAlt: string) => {
  setImagePreviews((prev) =>
    prev.map((item, i) =>
      i === index ? { ...item, alt: newAlt } : item
    )
  );
};
  const insertDivider = () => {
    const dividerHtml = '<hr class="my-4 border-gray-300" />';
    handleCommand('insertHTML', dividerHtml);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex flex-wrap gap-2">
          {/* Text Formatting */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCommand('bold')}
              className="h-8 w-8 p-0"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCommand('italic')}
              className="h-8 w-8 p-0"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCommand('underline')}
              className="h-8 w-8 p-0"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          {/* Font Size Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
              className="h-8 px-2 text-xs flex items-center gap-1"
            >
              <Type className="h-3 w-3" />
              <ChevronDown className="h-3 w-3" />
            </Button>
            {showFontSizeDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleFontSize(size.value)}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Palette */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColorPalette(!showColorPalette)}
              className="h-8 w-8 p-0"
            >
              <Palette className="h-4 w-4" />
            </Button>
            {showColorPalette && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                <div className="grid grid-cols-6 gap-1 w-48">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleTextColor(color)}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lists */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCommand('insertUnorderedList')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCommand('insertOrderedList')}
              className="h-8 w-8 p-0"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          {/* Media */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={openLinkDialog}
              className="h-8 w-8 p-0"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageDialog(true)}
              className="h-8 w-8 p-0"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={insertDivider}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>


            {/* insert code*/}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHtmlDialog(true)}
              className="h-8 w-8 p-0"
            >
              {'</>'}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}

      <div className="relative">
        {/* placeholder는 content가 비어있고 포커스가 없을 때만 표시 */}
        {!isFocused && !content && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder || '내용을 입력하세요...'}
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable

          onInput={(e) => {
            updateContent();

          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          /*
          onMouseDown={() => {
            // 포커스 이동 전에 현재 커서 위치 저장
            handleSaveSelection();
          }}
          onMouseUp={() => { handleSaveSelection(); }}
          */
          className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
          style={{ wordBreak: 'break-word' }}
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 mx-4">
            <h3 className="text-lg font-semibold mb-4">링크 추가</h3>
            <div className="space-y-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  링크 텍스트
                </label>
                <Input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="표시할 텍스트"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <Input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={insertLink}
                  disabled={!linkUrl}// || !linkText}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  추가
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkUrl('');
                    //setLinkText('');
                  }}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 mx-4">
            <h3 className="text-lg font-semibold mb-4">이미지 추가</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이미지 파일 선택
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>

              {imagePreviews.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    미리보기
                  </label>
                  <div className="rounded border p-5 max-h-80 overflow-y-auto space-y-4">
                    {imagePreviews.map((src, idx) => (

                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex-1">
                          <img
                            src={src.src}
                            alt={`미리보기 ${idx}`}
                            className="w-full h-auto max-h-64 object-contain rounded"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Input
                            type="text"
                            value={src.alt}
                            onChange={(e) => handleAltChange(idx, e.target.value)}
                            placeholder="대체 텍스트 (선택)"
                            className="text-[8pt]"
                          />
                          <Button
                            variant="outline"
                            onClick={() => handlePreviewImageDelete(idx)}
                            className="w-[110px] bg-gray-100"
                          >
                            선택 취소
                          </Button>

                          
                        </div>
                      </div>

                    ))}
                  </div>

                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={insertImages}
                  disabled={!imagePreviews}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  추가
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowImageDialog(false);
                    //setSelectedImage(null);
                    setImageAlt('');
                    setImagePreviews([]);
                    setSelectedImageFiles([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*insert code dialog*/}
      {showHtmlDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 mx-4">
            <h3 className="text-lg font-semibold mb-4">HTML 코드 삽입</h3>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="<b>굵게</b> 입력해보세요"
              className="w-full h-40 border rounded p-2 text-sm"
            />
            <div className="flex space-x-2 mt-4">
              <Button
                onClick={() => {
                  if (!editorRef.current) return;
                  {if (checkIfSanitized(htmlInput)) {
                    toast.error('코드에 작성 불가능한 요소가 포함되어 있거나, 형식이 불완전합니다.', {
                      duration: 4000,
                    });

                    return;
                  }}
                  
                  editorRef.current.focus();
                  handleCommand('insertHTML', purifier(htmlInput));
                  setShowHtmlDialog(false);
                  setHtmlInput('');

                  toast.info('위험요소가 있는 코드는 자동으로 삭제됐을 수 있습니다. (ex. 링크, 이미지)', {
                      duration: 5000,
                    });
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                삽입
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowHtmlDialog(false);
                  setHtmlInput('');
                }}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* Click outside handlers */}
      {(showFontSizeDropdown || showColorPalette) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowFontSizeDropdown(false);
            setShowColorPalette(false);
          }}
        />
      )}
    </div>
  );
}