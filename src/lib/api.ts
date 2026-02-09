export interface Article {
    id: number;
    title: string;
    url: string;
    image_url?: string;
    content?: string;
    source_name: string;
    crawled_at: string;
    rank_score?: number;
}

export interface Cluster {
    id: number;
    title: string;
    article_count: number;
    category?: string;
    score: number;
    last_updated: string;
    articles: Article[];
}

export interface HomePageData {
    top_overall: Cluster[];
    vendi: Cluster[];
    rajoni: Cluster[];
    bota: Cluster[];
    sport: Cluster[];
    tech: Cluster[];
}

export interface TonightArticle {
    id: number;
    title: string;
    url: string;
    image_url?: string;
    source_name: string;
    crawled_at: string;
}

export interface TonightCluster {
    id: number;
    title: string;
    today_article_count: number;
    total_article_count: number;
    category: string;
    top_article: TonightArticle;
}

export interface TonightData {
    clusters: TonightCluster[];
    is_active_hours: boolean;
}

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clusta-8d555484de44.herokuapp.com';
const API_BASE_URL = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

/** Resolve image URLs: turn relative proxy paths into absolute API URLs. */
function resolveImageUrl(url?: string): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return url;
}

function resolveArticleImages<T extends { image_url?: string }>(article: T): T {
    return { ...article, image_url: resolveImageUrl(article.image_url) };
}

function resolveClusterImages(cluster: Cluster): Cluster {
    return {
        ...cluster,
        articles: cluster.articles.map(a => resolveArticleImages(a)),
    };
}

export async function getNews(): Promise<HomePageData> {
    const res = await fetch(`${API_BASE_URL}/api/news`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch news');
    }

    const data: HomePageData = await res.json();
    // Resolve proxy image URLs to absolute paths
    for (const key of Object.keys(data) as (keyof HomePageData)[]) {
        data[key] = data[key].map(resolveClusterImages);
    }
    return data;
}

export async function getNewsByCategory(category: string): Promise<Cluster[]> {
    const res = await fetch(`${API_BASE_URL}/api/news/${category}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch category news');
    }

    const data: Cluster[] = await res.json();
    return data.map(resolveClusterImages);
}

export async function getCluster(id: string): Promise<Cluster> {
    const res = await fetch(`${API_BASE_URL}/api/clusters/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch cluster');
    }

    const data: Cluster = await res.json();
    return resolveClusterImages(data);
}

export async function getTonightNews(excludeIds: number[] = []): Promise<TonightData> {
    const params = excludeIds.length > 0
        ? `?exclude_ids=${excludeIds.join(',')}`
        : '';

    const res = await fetch(`${API_BASE_URL}/api/news/tonight${params}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch tonight news');
    }

    const data: TonightData = await res.json();
    data.clusters = data.clusters.map(c => ({
        ...c,
        top_article: resolveArticleImages(c.top_article),
    }));
    return data;
}

export interface SearchResult {
    clusters: Cluster[];
    total_count: number;
    query: string;
}

export async function searchNews(query: string, limit = 20): Promise<SearchResult> {
    const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
    });

    const res = await fetch(`${API_BASE_URL}/api/search?${params}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to search news');
    }

    const data: SearchResult = await res.json();
    data.clusters = data.clusters.map(resolveClusterImages);
    return data;
}

export interface DailySummary {
    id: number;
    summary_date: string;
    summary_text: string;
    cluster_ids: number[];
    created_at: string;
    has_audio: boolean;
    clusters?: { id: number; title: string; category: string }[];
}

export function getSummaryAudioUrl(summaryId?: number): string {
    if (summaryId) {
        return `${API_BASE_URL}/api/summary/today/audio?id=${summaryId}`;
    }
    return `${API_BASE_URL}/api/summary/today/audio`;
}

export async function getDailySummary(): Promise<DailySummary | null> {
    const res = await fetch(`${API_BASE_URL}/api/summary/today`, {
        cache: 'no-store',
    });

    if (res.status === 404) {
        return null; // No summary available
    }

    if (!res.ok) {
        throw new Error('Failed to fetch daily summary');
    }

    return res.json();
}
