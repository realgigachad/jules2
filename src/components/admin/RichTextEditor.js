'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex gap-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        List
      </button>
      <style jsx>{`
        button {
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        button.is-active {
          background-color: #34d399;
          color: white;
        }
        button:disabled {
          opacity: 0.5;
        }
      `}</style>
    </div>
  )
}

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose lg:prose-xl max-w-none p-4 h-full border border-gray-300 border-t-0 rounded-b-lg focus:outline-none',
      },
    },
  })

  return (
    <div className="h-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="h-[calc(100%-42px)]" />
    </div>
  )
}

export default RichTextEditor
