'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import { useRef } from 'react'

const MenuBar = ({ editor }) => {
  if (!editor) return null
  const fileInputRef = useRef(null);

  const addMedia = (url, type) => {
    if (url) {
      if (type.startsWith('image/')) {
        editor.chain().focus().setImage({ src: url }).run();
      } else if (type.startsWith('video/')) {
        const videoHtml = `<video controls src="${url}" width="100%"></video>`;
        editor.chain().focus().insertContent(videoHtml).run();
      } else if (type === 'application/pdf') {
        const pdfHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">View PDF</a>`;
        editor.chain().focus().insertContent(pdfHtml).run();
      } else {
        const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">View File</a>`;
        editor.chain().focus().insertContent(linkHtml).run();
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        addMedia(data.url, file.type);
      } else {
        throw new Error(data.message || 'File upload failed');
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const addMediaFromUrl = () => {
    const url = window.prompt('Enter URL');
    // We don't know the file type from a URL, so we'll default to image for now.
    // A more advanced implementation might inspect the URL ending.
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-2">
      {/* Text Formatting Buttons */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>Strike</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>Quote</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>Bullets</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>Numbers</button>
      <button type="button" onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')}>Indent</button>
      <button type="button" onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')}>Outdent</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>Left</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>Center</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>Right</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
      <input type="color" onInput={event => editor.chain().focus().setColor(event.target.value).run()} value={editor.getAttributes('textStyle').color || '#000000'} />

      {/* Media Buttons */}
      <button type="button" onClick={addMediaFromUrl}>Image from URL</button>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,.pdf" />
      <button type="button" onClick={() => fileInputRef.current.click()}>Upload File</button>

      <style jsx>{`
        button { padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc; background: white; }
        button.is-active { background-color: #0891b2; color: white; border-color: #06b6d4; }
        button:disabled { opacity: 0.5; }
        input[type="color"] { width: 2.5rem; padding: 2px; border-radius: 4px; border: 1px solid #ccc; background: white; }
      `}</style>
    </div>
  )
}

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 h-full border border-gray-300 border-t-0 rounded-b-lg focus:outline-none overflow-y-auto',
      },
    },
  })

  return (
    <div className="h-full flex flex-col">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-grow overflow-hidden" />
    </div>
  )
}

export default RichTextEditor
