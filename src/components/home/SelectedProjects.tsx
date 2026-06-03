'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { ProjectItem } from '@/types/page';
import { useMessages } from '@/lib/i18n/useMessages';
import { formatDate } from '@/lib/utils';

interface SelectedProjectsProps {
    projects: ProjectItem[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedProjects({ projects, title, enableOnePageMode = false }: SelectedProjectsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedProjects;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#projects" : "/projects"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="space-y-4">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        {project.date && (
                            <div className="flex items-center gap-2 text-sm text-accent mb-2">
                                <CalendarIcon className="h-4 w-4" />
                                <time dateTime={project.date}>{formatDate(project.date)}</time>
                            </div>
                        )}
                        <h3 className="font-semibold text-primary mb-1 leading-tight">
                            {project.title}
                        </h3>
                        {project.subtitle && (
                            <p className="text-sm text-accent mb-2 font-medium">
                                {project.subtitle}
                            </p>
                        )}
                        {project.summary && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2 line-clamp-2">
                                {project.summary}
                            </p>
                        )}
                        {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-accent text-xs rounded flex items-center gap-1"
                                    >
                                        <TagIcon className="h-3 w-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
