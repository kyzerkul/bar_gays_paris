import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type PostRow = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
	export async function getPublishedPosts({ limit = 10, offset = 0 }: { limit?: number; offset?: number } = {}) {
	const { data, error } = await supabase
		.from('posts')
		.select('*')
		.eq('published', true)
		.order('published_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) throw error;
	return data as PostRow[];
}

export async function getPostBySlug(slug: string) {
	const { data, error } = await supabase
		.from('posts')
		.select('*')
		.eq('slug', slug)
		.single();
	if (error) throw error;
	return data as PostRow;
}

export async function createPost(post: PostInsert) {
	const { data, error } = await supabase
		.from('posts')
		.insert([post])
		.select('*')
		.single();
	if (error) throw error;
	return data as PostRow;
}

export async function updatePost(id: number, updates: Partial<PostInsert>) {
	const { data, error } = await supabase
		.from('posts')
		.update(updates)
		.eq('id', id)
		.select('*')
		.single();
	if (error) throw error;
	return data as PostRow;
}

export async function deletePost(id: number) {
	const { error } = await supabase
		.from('posts')
		.delete()
		.eq('id', id);
	if (error) throw error;
	return { success: true };
}
