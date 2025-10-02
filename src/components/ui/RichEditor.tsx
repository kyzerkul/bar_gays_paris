'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

type RichEditorProps = {
  value?: any;
  onChange?: (json: any) => void;
  onImageUpload?: (file: File) => Promise<string>; // returns public URL
};

export default function RichEditor({ value, onChange, onImageUpload }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value || { type: 'doc', content: [] },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] rounded border border-blue/30 bg-bg-dark text-text-light p-3 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!editor || !value) return;
    editor.commands.setContent(value);
  }, [editor]);

  if (!editor) return null;

  const addImage = async (file: File) => {
    if (!onImageUpload) return;
    const url = await onImageUpload(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div>
      <Toolbar editor={editor} onAddImage={addImage} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, onAddImage }: { editor: any; onAddImage: (f: File) => void; }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAddImage(file);
  };

  const btn = (active: boolean) => `px-2 py-1 rounded border border-blue/30 text-sm ${active ? 'bg-primary text-text-light' : 'text-text-light'}`;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>Gras</button>
      <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>Italique</button>
      <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>Liste</button>
      <label className="px-2 py-1 rounded border border-blue/30 text-sm cursor-pointer text-text-light">
        Image
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
    </div>
  );
}


