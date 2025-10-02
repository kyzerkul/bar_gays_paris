'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import { supabase } from '@/lib/supabase/client';

type TinyEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
};

export default function TinyEditor({ value = '', onChange }: TinyEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      onInit={(_evt, editor) => (editorRef.current = editor)}
      initialValue={value}
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'try63oa6kfx5s5r6h4xi5ru0on2rb2bo16fqdsue4be7hedo'}
      init={{
        height: 400,
        menubar: false,
        skin: 'oxide-dark',
        content_css: 'dark',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar:
          'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image | removeformat | code | help',
        images_upload_handler: async (blobInfo) => {
          const file = blobInfo.blob();
          const fileExt = file.name.split('.').pop() || 'jpg';
          const fileName = `tiny-${Date.now()}.${fileExt}`;
          const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(fileName, file, { upsert: false });
          if (error) throw error;
          const publicUrl = supabase.storage.from('blog-images').getPublicUrl(data.path).data.publicUrl;
          return publicUrl;
        },
        convert_urls: false,
      }}
      onEditorChange={(content) => onChange?.(content)}
    />
  );
}


