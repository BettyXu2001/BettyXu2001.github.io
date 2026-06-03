'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { BlogPost } from '@/types/page';
import { useMessages } from '@/lib/i18n/useMessages';
import { formatDate } from '@/lib/utils';

interface SelectedBlogProps {
    posts: BlogPost[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedBlog({ posts, title, enableOnePageMode = false }: SelectedBlogProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedBlog;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#blog" : "/blog"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="space-y-4">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        <div className="flex items-center gap-2 text-sm text-accent mb-2">
                            <CalendarIcon className="h-4 w-4" />
                            <time dateTime={post.date}>{formatDate(post.date)}</time>
                        </div>
                        <h3 className="font-semibold text-primary mb-2 leading-tight">
                            {post.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2 line-clamp-2">
                            {post.summary}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-accent text-xs rounded flex items-center gap-1"
                                >
                                    <TagIcon className="h-3 w-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
