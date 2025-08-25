/**
 * @fileoverview This file defines the RichTextEditor component, a wrapper around the
 * Tiptap editor that provides a customized toolbar for text formatting and media uploads.
 */
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import { useState } from 'react'
import MediaLibrary from './MediaLibrary' // Import the MediaLibrary component

/**
 * The toolbar component for the Tiptap editor.
 * It provides buttons for text formatting, alignment, and media insertion.
 * @param {{editor: object}} props - The component props, containing the Tiptap editor instance.
 */
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  /**
   * Inserts media into the editor based on its file extension from the URL.
   * @param {string} url - The URL of the media file.
   */
  const addMediaFromUrl = (url) => {
    if (!url) return;
    const extension = url.split('.').pop().toLowerCase();
    const imageName = url.split('/').pop();

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      editor.chain().focus().setImage({ src: url }).run();
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      const videoHtml = `<video controls src="${url}" width="100%"></video>`;
      editor.chain().focus().insertContent(videoHtml).run();
    } else if (extension === 'pdf') {
      const pdfHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="pdf-embed">${imageName}</a>`;
      editor.chain().focus().insertContent(pdfHtml).run();
    } else {
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">Download ${imageName}</a>`;
      editor.chain().focus().insertContent(linkHtml).run();
    }
  };

  const handleSelectFileFromGallery = (url) => {
    addMediaFromUrl(url);
  };

  /**
   * Prompts the user for an image URL and inserts it into the editor.
   */
  const addImageFromPrompt = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <>
      <MediaLibrary
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectFile={handleSelectFileFromGallery}
      />
      <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-2">
        {/* Formatting buttons */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>Quote</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>Bullets</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>Numbers</button>
        <button type="button" onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')}>Indent</button>
        <button type="button" onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')}>Outdent</button>

        {/* Text alignment buttons */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>Left</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>Center</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>Right</button>

        {/* Heading and color buttons */}
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
        <input type="color" onInput={event => editor.chain().focus().setColor(event.target.value).run()} value={editor.getAttributes('textStyle').color || '#000000'} />

        {/* Media buttons */}
        <button type="button" onClick={addImageFromPrompt}>Image URL</button>
        <button type="button" onClick={() => setIsGalleryOpen(true)}>Media Library</button>

        {/* Scoped styles for the menu bar buttons */}
        <style jsx>{`
          button { padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc; background: white; font-size: 0.875rem; }
          button.is-active { background-color: #0891b2; color: white; border-color: #06b6d4; }
          button:disabled { opacity: 0.5; }
          input[type="color"] { width: 2.5rem; padding: 2px; border-radius: 4px; border: 1px solid #ccc; background: white; }
        `}</style>
      </div>
    </>
  )
}

/**
 * The main RichTextEditor component.
 * It initializes the Tiptap editor with a set of extensions and provides the MenuBar and EditorContent.
 * @param {{content: string, onChange: Function}} props - The component props.
 * @returns {JSX.Element} The complete rich text editor component.
 */
const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [ StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] }), TextStyle, Color, Image ],
    content: content,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()) },
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
