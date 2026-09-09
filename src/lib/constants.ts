export const CategoryColors = {
    top_overall: '#1e3a5f', // Primary theme color
    vendi: '#dc5661ff',    // Reddish
    rajoni: '#f59e0b',   // Amber
    bota: '#8b5cf6',     // Purple
    sport: '#10b981',    // Green
    tech: '#06b6d4',     // Cyan
} as const;

export type CategoryKey = keyof typeof CategoryColors;

/**
 * Publisher brand colours, keyed on `article.source_name` exactly as the API
 * returns it (which is the `sources.name` column the crawler populates from
 * `app/core/sources*.py` — the key strings must match those byte for byte).
 *
 * A missing outlet is not a missing colour, it is the WRONG colour: every call
 * site falls back to `CategoryColors[category]`, so an unlisted publisher takes
 * the colour of its section and every card in that section renders identically.
 * That is why the Kosovo and Albania editions looked monochrome — 60 of their
 * 65 outlets (32 KS + 37 AL, 4 read by both) were absent and shared five
 * section colours between them.
 *
 * Sections below are grouped by edition. An outlet is only ever compared
 * against the others in ITS OWN edition, because a feed never mixes countries;
 * the four pan-Albanian outlets that all three editions read (Telegrafi,
 * BotaSot, Deutsche Welle, Evropa e Lire, plus Koha for MK/KS) are listed once
 * in the shared block above and are counted in every edition's separation
 * check. Note `Koha` (Kosovo, koha.net) and `Koha Jone` (Albania, kohajone.com)
 * are different newsrooms, as are `Telegrafi` (telegrafi.com) and `Telegraf`
 * (telegraf.al) — do not merge them.
 *
 * Each value is the outlet's real brand colour, taken from its logo SVG fill,
 * its `theme-color` meta or its stylesheet's primary variable. Where two
 * newsrooms in one edition genuinely share a colour — Balkan news brands are
 * overwhelmingly red — one is nudged in hue/lightness far enough to read as a
 * different dot while staying the same colour. Two constraints bound that
 * nudge and both are measured, not guessed:
 *
 *  - Contrast. These render as small dots, bars and borders, so a colour must
 *    survive both `--background` values (#faf9f5 and #131211). Every entry
 *    added here clears 2:1 on each. That floor is what darkened Monitor's
 *    yellow (#F7CF14 vanishes on white at 1.44:1).
 *  - Dark mode. `getAccessibleColor()` in lib/utils.ts lightens anything below
 *    0.4 luminance as `channel * 1.6 + 60`, which CLAMPS the red channel of a
 *    saturated red to 255 — so two reds are told apart in dark mode only by
 *    their green and blue channels, and differing in lightness alone does
 *    nothing. Reds are therefore spread by hue, not by shade.
 */
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
    "Aktuale.mk": "#F9A825",

    // ── Kosovo (KS) ──────────────────────────────────────────────────────────
    // Broadcasters
    "Klan Kosova": "#1A4070",
    "RTK":         "#31509D",
    "RTV21":       "#0A4FFA",
    "Teve1":       "#E90F6C",
    "Kosova.info": "#098ADA",

    // Dailies and major portals
    "Gazeta Express": "#F23322",
    "Zeri":           "#1EA9E1",
    "Epoka e Re":     "#DC394B",
    "Indeksonline":   "#B90410",
    "Insajderi":      "#89C33A",
    "Kallxo":         "#AA0E20",
    "Periskopi":      "#69237B",
    "Nacionale":      "#E12A0A",

    // Portals
    "Albinfo":         "#C00B3A",
    "Arbresh":         "#07B5DC",
    "Ballkani":        "#E0AA05",
    "BotaPress":       "#CD1D20",
    "Dukagjini":       "#ED1B35",
    "Ekonomia Online": "#032849",
    "Gazeta Infokus":  "#A51103",
    "KosovaNews":      "#DF2C26",
    "Lajmi":           "#1F35A4",
    "Paparaci":        "#DF4B3F",
    "Reporteri":       "#CCB100",
    "Sinjali":         "#BD1C00",
    "Tesheshi":        "#C40229",
    "Veriu":           "#1B81FF",

    // ── Albania (AL) ─────────────────────────────────────────────────────────
    // Broadcasters
    "Top Channel":      "#142A51",
    "TV Klan":          "#D43521",
    "News24":           "#144DAA",
    "Ora News":         "#9A2010",
    "Report TV":        "#CB2125",
    "Scan TV":          "#1DC4CC",
    "Vizion Plus":      "#006473",
    "A2 CNN":           "#B3261F",
    "ABC News":         "#445D92",
    "RTSH":             "#E90A49",
    "Euronews Albania": "#1675F6",

    // Dailies and magazines
    "Balkanweb":    "#1C425D",
    "Gazeta Dita":  "#E9434C",
    "Gazeta Shqip": "#EC352C",
    "Gazeta Tema":  "#09397B",
    "Shqiptarja":   "#D3293A",
    "Monitor":      "#D3AF07",
    "BusinessMag":  "#E31829",
    "Syri":         "#ED7F22",
    "Koha Jone":    "#2C44B1",
    "Telegraf":     "#EA1000",

    // Portals
    "Albeu":         "#B12202",
    "BoldNews":      "#0096C7",
    "Dosja":         "#F1A230",
    "Gazeta Impakt": "#0280D2",
    "JavaNews":      "#B02F34",
    "JOQ":           "#E15843",
    "Lapsi":         "#085393",
    "Newsbomb":      "#E3470A",
    "Politiko":      "#E86863",
    "Reporter.al":   "#1D6FAF",
    "SportEkspres":  "#F72E11",
    "Tirana Post":   "#29B787"
};
