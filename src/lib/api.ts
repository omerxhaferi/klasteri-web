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

export async function getNews(): Promise<HomePageData> {
    const res = await fetch(`${API_BASE_URL}/api/news`, {
        cache: 'no-store', // Always fetch latest data on arrival
    });

    if (!res.ok) {
        throw new Error('Failed to fetch news');
    }

    return res.json();
}

export async function getNewsByCategory(category: string): Promise<Cluster[]> {
    const res = await fetch(`${API_BASE_URL}/api/news/${category}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch category news');
    }

    return res.json();
}

export async function getCluster(id: string): Promise<Cluster> {
    const res = await fetch(`${API_BASE_URL}/api/clusters/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch cluster');
    }

    return res.json();
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

    return res.json();
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

    return res.json();
}

export interface DailySummary {
    id: number;
    summary_date: string;
    summary_text: string;
    cluster_ids: number[];
    created_at: string;
    clusters?: { id: number; title: string; category: string }[];
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
