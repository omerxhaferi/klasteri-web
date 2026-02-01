export const CategoryColors = {
    top_overall: '#1e3a5f', // Primary theme color
    vendi: '#dc5661ff',    // Reddish
    rajoni: '#f59e0b',   // Amber
    bota: '#8b5cf6',     // Purple
    sport: '#10b981',    // Green
    tech: '#06b6d4',     // Cyan
} as const;

export type CategoryKey = keyof typeof CategoryColors;

export const SOURCE_COLORS: { [key: string]: string } = {
    "Deutsche Welle": "#00A5FF",
    "Zëri i Amerikës": "#0033A0",
    "Evropa e Lire": "#005EB8",

    "Alsat": "#f73434ff",
    "RTM2": "#C8102E",
    "TV21": "#00D1F2",
    "Shenja": "#E60000",
    "MIA": "#252525ff",

    "Telegrafi": "#ce29c0ff",
    "Portalb": "#57804bff",
    "Koha": "#0099e6ff",
    "BotaSot": "#D50000",
    "Zhurnal": "#c63939ff",
    "Almakos": "#2E7D32",
    "Sloboden Pečat": "#D21114",
    "Infoshqip": "#279f24ff",

    "Fol": "#444444",
    "Info7": "#1A237E",
    "Kohanews": "#1F2933",
    "Ina Online": "#1d5fc2ff",
    "Pressonline": "#37474F",
    "Zyrtare": "#263238",
    "Telegrami": "#FFCC00",
    "Lajm": "#E10600",
    "Lideri": "#B71C1C",
    "Medial": "#2E7D32",
    "Tetova1": "#C62828",
    "Tetova Sot": "#a6a6a6ff",
    "Aktuale.mk": "#F9A825"
};
