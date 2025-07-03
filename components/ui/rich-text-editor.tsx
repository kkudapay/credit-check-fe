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
  Palette
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
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

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
  };

  const handleTextColor = (color: string) => {
    handleCommand('foreColor', color);
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${linkText}</a>`;
      handleCommand('insertHTML', linkHtml);
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const insertImage = () => {
    if (imageUrl) {
      const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" class="max-w-full h-auto rounded-lg my-2" />`;
      handleCommand('insertHTML', imageHtml);
      setImageUrl('');
      setImageAlt('');
      setShowImageDialog(false);
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

          {/* Font Size */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFontSize('1')}
              className="h-8 px-2 text-xs"
            >
              작게
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFontSize('3')}
              className="h-8 px-2 text-xs"
            >
              보통
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFontSize('5')}
              className="h-8 px-2 text-xs"
            >
              크게
            </Button>
          </div>

          {/* Text Color */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTextColor('#000000')}
              className="h-8 w-8 p-0"
            >
              <div className="w-4 h-4 bg-black rounded"></div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTextColor('#ef4444')}
              className="h-8 w-8 p-0"
            >
              <div className="w-4 h-4 bg-red-500 rounded"></div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTextColor('#3b82f6')}
              className="h-8 w-8 p-0"
            >
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTextColor('#22c55e')}
              className="h-8 w-8 p-0"
            >
              <div className="w-4 h-4 bg-green-500 rounded"></div>
            </Button>
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
                  onClick={() => setShowLinkDialog(false)}
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
                  이미지 URL
                </label>
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
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
                  disabled={!imageUrl}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  추가
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowImageDialog(false)}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}