/**
 * "Moti" — the hour's weather in the edition's six towns and tomorrow's in
 * its capital, from MET Norway through /api/weather (klasteri-api's
 * weather.ts holds MET's terms and the caching they ask for). The credit line
 * at the bottom is one of those terms; keep it.
 *
 * Towns run down two columns in the order the API sends them, capital first:
 *
 *     Shkup      ☂  8°    Kumanovë   ☁  6°
 *     Tetovë     ☂  7°    Strugë     ☂  9°
 *     Gostivar   ☂  9°    Kërçovë    ☂ 10°
 *     Nesër në Shkup: kthjellët, −3° / 7°
 *
 * No hooks: it renders the same on the server (mobile, in the feed) and inside
 * the client-side left sidebar (desktop). Renders nothing when MET had nothing
 * for the edition, as for US.
 */

import type { LucideIcon } from "lucide-react";
import {
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudHail,
    CloudLightning,
    CloudMoon,
    CloudMoonRain,
    CloudRain,
    CloudSnow,
    CloudSun,
    CloudSunRain,
    Moon,
    Sun,
} from "lucide-react";
import type { TownWeather, WeatherData } from "@/lib/api";
import { TabHeading } from "@/components/tab-heading";

/** −3°, 0°, 12°: rounded, with a real minus sign. String(-0) is "0", so no "-0°". */
function degrees(t: number): string {
    const r = Math.round(t);
    return r < 0 ? `−${-r}°` : `${r}°`;
}

/**
 * MET's symbol code -> icon and colour (globals.css, --wx-*). Light and heavy
 * share an icon, as do the day and night of rain and snow; the words carry
 * the rest.
 */
function iconFor(symbol: string): { Icon: LucideIcon; color: string } {
    const night = symbol.endsWith("_night");
    const code = symbol.replace(/_(day|night|polartwilight)$/, "");

    if (code.includes("thunder")) return { Icon: CloudLightning, color: "var(--wx-sun)" };
    if (code.includes("snow")) return { Icon: CloudSnow, color: "var(--wx-snow)" };
    if (code.includes("sleet")) return { Icon: CloudHail, color: "var(--wx-snow)" };
    if (code.includes("rainshowers")) return { Icon: night ? CloudMoonRain : CloudSunRain, color: "var(--wx-rain)" };
    if (code.startsWith("lightrain")) return { Icon: CloudDrizzle, color: "var(--wx-rain)" };
    if (code.includes("rain")) return { Icon: CloudRain, color: "var(--wx-rain)" };
    if (code === "fog") return { Icon: CloudFog, color: "var(--wx-cloud)" };
    if (code === "fair" || code === "partlycloudy") {
        return night ? { Icon: CloudMoon, color: "var(--wx-cloud)" } : { Icon: CloudSun, color: "var(--wx-sun)" };
    }
    if (code === "clearsky") {
        return night ? { Icon: Moon, color: "var(--wx-cloud)" } : { Icon: Sun, color: "var(--wx-sun)" };
    }
    return { Icon: Cloud, color: "var(--wx-cloud)" };
}

/** "kthjellët, −3° / 7°" */
function tomorrowText(t: NonNullable<TownWeather["tomorrow"]>): string {
    return `${t.description}, ${degrees(t.min)} / ${degrees(t.max)}`;
}

export function WeatherCard({ data, className = "" }: { data: WeatherData; className?: string }) {
    const capital = data.towns[0];
    if (!capital) return null;

    return (
        <section className={className} aria-label="Moti">
            <TabHeading title="Moti" right="tani" />

            <ul className="grid grid-cols-2 grid-flow-col grid-rows-[repeat(3,auto)] gap-x-4">
                {data.towns.map((town) => {
                    const { Icon, color } = iconFor(town.symbol);
                    const hover = town.tomorrow
                        ? `${town.name}: ${town.description}. Nesër: ${tomorrowText(town.tomorrow)}`
                        : `${town.name}: ${town.description}`;
                    return (
                        <li
                            key={town.name}
                            className="flex items-center gap-1.5 py-[5px] border-b border-dotted border-border text-[13px]"
                            title={hover}
                        >
                            <span className="flex-1 min-w-0 truncate">{town.name}</span>
                            <Icon aria-hidden="true" size={17} strokeWidth={1.75} className="shrink-0" style={{ color }} />
                            <span className="sr-only">{town.description},</span>
                            <span className="w-8 text-right font-bold tabular-nums">{degrees(town.temperature)}</span>
                        </li>
                    );
                })}
            </ul>

            {capital.tomorrow && (
                <p className="py-[5px] text-[12px] border-b border-dotted border-border">
                    Nesër në {capital.name}: {tomorrowText(capital.tomorrow)}
                </p>
            )}

            <p className="pt-1.5 text-[11px] text-muted-foreground">
                Parashikimi:{" "}
                <a href="https://www.met.no/en" target="_blank" rel="noopener noreferrer" className="text-primary">
                    MET Norway
                </a>
            </p>
        </section>
    );
}
