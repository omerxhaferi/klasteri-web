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

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clusta-8d555484de44.herokuapp.com';
const API_BASE_URL = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

export async function getNews(): Promise<HomePageData> {
    const res = await fetch(`${API_BASE_URL}/api/news`, {
        next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!res.ok) {
        throw new Error('Failed to fetch news');
    }

    return res.json();
}

export async function getNewsByCategory(category: string): Promise<Cluster[]> {
    const res = await fetch(`${API_BASE_URL}/api/news/${category}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch category news');
    }

    return res.json();
}

export async function getCluster(id: string): Promise<Cluster> {
    const res = await fetch(`${API_BASE_URL}/api/clusters/${id}`, {
        next: { revalidate: 300 }, // Cache cluster details for 5 minutes
    });

    if (!res.ok) {
        throw new Error('Failed to fetch cluster');
    }

    return res.json();
}
