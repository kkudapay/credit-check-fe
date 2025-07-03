'use client';

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

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageAlt, setImageAlt] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  /*
    useEffect(() => {
      if (editorRef.current && content !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = content;
      }
    }, [content]);
  */
  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
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

  const insertLink = () => {
    if (linkUrl && linkText && editorRef.current) {
      editorRef.current.focus();
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${linkText}</a>`;
      handleCommand('insertHTML', linkHtml);
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };


  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImage = () => {
    if (imagePreview && editorRef.current) {
      editorRef.current.focus(); // 📌 포커스 복원
      const imageHtml = `<img src="${imagePreview}" alt="${imageAlt}" class="max-w-full h-auto rounded-lg my-2" />`;
      handleCommand('insertHTML', imageHtml);
      setSelectedImage(null);
      setImagePreview('');
      setImageAlt('');
      setShowImageDialog(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
              onClick={() => setShowLinkDialog(true)}
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
          </div>
        </div>
      </div>

      {/* Editor */}

      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{ wordBreak: 'break-word' }}
        suppressContentEditableWarning={true}
      >
        {!content && (
          <div className="text-gray-400 pointer-events-none">
            {placeholder || '내용을 입력하세요...'}
          </div>
        )}
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 mx-4">
            <h3 className="text-lg font-semibold mb-4">링크 추가</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  링크 텍스트
                </label>
                <Input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="표시할 텍스트"
                />
              </div>
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
                  disabled={!linkUrl || !linkText}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  추가
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkUrl('');
                    setLinkText('');
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
                  onChange={handleImageSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>

              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    미리보기
                  </label>
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="max-w-full h-auto max-h-40 rounded border"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  대체 텍스트 (선택사항)
                </label>
                <Input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="이미지 설명"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={insertImage}
                  disabled={!imagePreview}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  추가
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowImageDialog(false);
                    setSelectedImage(null);
                    setImagePreview('');
                    setImageAlt('');
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