import { createContentLoader } from 'vitepress';
import type { ContentData } from 'vitepress';
import { getGitTimestamp } from '../utils/getGitTimestamp';

export type ContentDataExtra = ContentData & {
    lastUpdated: number;
    title: string;
    readingTime: number;
    html?: string;
};

declare const data: ContentDataExtra[];
export { data };

export default createContentLoader<ContentDataExtra[]>('posts/*.md', {
    includeSrc: true,
    excerpt(file) {
        file.excerpt = file.content
            .split('\n')
            .filter((c) => !!c.trim() && !c.startsWith('# '))
            .slice(0, 4)
            .join(' ');
    },
    async transform(rawData) {
        const _rawData: ContentDataExtra[] = [];
        for (const file of rawData) {
            const fmDate = file.frontmatter.date;
            const lastUpdated = fmDate
                ? new Date(fmDate).getTime()
                : (await getGitTimestamp(file.url.slice(1).replace(/\.html$/, '.md'))) || 0;
            let title = '',
                readingTime = 0;
            if (file.src) {
                // 匹配出现的第一行一级标题
                title = file.src.match(/^#\s+(.*)/m)?.[1] || '';
                // 阅读时间，按照 200 字/分钟计算
                readingTime = Math.ceil(file.src.length / 200);
            }

            _rawData.push({
                ...file,
                lastUpdated,
                title,
                readingTime,
            });
        }
        return _rawData.sort((a, b) => {
            return b.lastUpdated - a.lastUpdated;
        });
    },
});
