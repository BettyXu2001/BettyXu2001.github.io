'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, TagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { BlogPost } from '@/types/page';
import { BlogPageConfig } from '@/types/page';
import { cn, formatDate } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';

interface BlogListProps {
    config: BlogPageConfig;
    posts: BlogPost[];
    embedded?: boolean;
}

export default function BlogList({ config, posts, embedded = false }: BlogListProps) {
    const messages = useMessages();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        posts.forEach(post => {
            post.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.summary.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
            
            return matchesSearch && matchesTag;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [posts, searchQuery, selectedTag]);

    return (
        <div className={cn("w-full", embedded ? "" : "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12")}>
            {!embedded && (
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-serif font-bold text-primary mb-8"
                >
                    {config.title}
                </motion.h1>
            )}

            <div className="mb-8 space-y-4">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent" />
                    <input
                        type="text"
                        placeholder={messages?.blog?.search || "Search posts..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedTag('all')}
                        className={cn(
                            "px-3 py-1 rounded-full text-sm transition-colors",
                            selectedTag === 'all'
                                ? "bg-primary text-white"
                                : "bg-secondary text-accent hover:bg-primary hover:text-white"
                        )}
                    >
                        {messages?.blog?.all || "All"}
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={cn(
                                "px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1",
                                selectedTag === tag
                                    ? "bg-primary text-white"
                                    : "bg-secondary text-accent hover:bg-primary hover:text-white"
                            )}
                        >
                            <TagIcon className="h-3 w-3" />
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {filteredPosts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-accent py-12"
                        >
                            <p className="text-lg">{messages?.blog?.noPosts || "No posts found"}</p>
                        </motion.div>
                    ) : (
                        filteredPosts.map((post, index) => (
                            <motion.article
                                key={post.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center gap-2 text-sm text-accent mb-3">
                                    <CalendarIcon className="h-4 w-4" />
                                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                                </div>

                                <h2 className="text-2xl font-serif font-bold text-primary mb-3">
                                    {post.title}
                                </h2>

                                <p className="text-secondary mb-4 leading-relaxed">
                                    {post.summary}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-secondary text-accent text-xs rounded flex items-center gap-1"
                                        >
                                            <TagIcon className="h-3 w-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.article>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8 text-center text-sm text-accent">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} 
                {selectedTag !== 'all' && ` tagged with "${selectedTag}"`}
            </div>
        </div>
    );
}
