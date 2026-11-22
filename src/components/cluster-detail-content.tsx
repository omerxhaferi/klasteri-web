"use client";

import type { Article, Beat, EditionLink, StoryAngle } from "@/lib/api";
import { SOURCE_COLORS, CategoryColors, CategoryKey } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import { hideIfBroken, hideOnError } from "@/lib/images";
import { useEffect, useState } from "react";
import { ClusterTimeline } from "@/components/cluster-timeline";
import { TabHeading } from "@/components/tab-heading";
import { EditionsLine } from "@/components/editions-line";

function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString.replace("Z", ""));
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "tani";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} orë`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ditë`;
    return date.toLocaleDateString("sq-AL", { day: "numeric", month: "short" });
}

type ClusterDetailContentProps = {
    mainArticle: Article | undefined;
    otherArticles: Article[];
    allArticles: Article[];
    beats?: Beat[];
    articleCount: number;
    categoryKey: CategoryKey;
    editions?: EditionLink[];
    angles?: StoryAngle[];
};

export function ClusterDetailContent({
    mainArticle,
    otherArticles,
    allArticles,
    beats,
    articleCount,
    categoryKey,
    editions,
    angles,
}: ClusterDetailContentProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isDarkMode =
        mounted &&
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");

    const categoryColor = CategoryColors[categoryKey] || CategoryColors.vendi;
    const baseMainColor = mainArticle
        ? SOURCE_COLORS[mainArticle.source_name] || categoryColor
        : categoryColor;
    const mainSourceColor = getAccessibleColor(baseMainColor, isDarkMode);

    // Each angle with its articles, minus the lead shown at the top. Null when
    // the story is one piece, so the page renders exactly as it always has.
    const byId = new Map(allArticles.map((a) => [a.id, a]));
    const groups =
        angles && angles.length > 1
            ? angles.map((angle) => ({
                  angle,
                  articles: angle.article_ids
                      .filter((id) => id !== mainArticle?.id)
                      .map((id) => byId.get(id))
                      .filter((a): a is Article => a !== undefined),
              }))
            : null;

    return (
        <>
            {/* The lead article: the feed's card, at reading size */}
            {mainArticle && (
                <div className="pb-5">
                    <div className="flex gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-[22px] md:text-[26px] font-bold leading-[1.2]">
                                <a
                                    href={mainArticle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-headline"
                                >
                                    {mainArticle.title}
                                </a>
                            </h1>

                            <div className="mt-1.5 text-[13px] text-muted-foreground">
                                <span className="font-bold" style={{ color: mainSourceColor }}>
                                    {mainArticle.source_name}
                                </span>
                                {" - "}
                                {getTimeAgo(mainArticle.crawled_at)}
                            </div>
                        </div>

                        {/* Max 100x100 — larger article images are not allowed (NMK rules) */}
                        {mainArticle.image_url && (
                            <img
                                src={mainArticle.image_url}
                                alt=""
                                className="w-[100px] h-[100px] shrink-0 object-cover bg-muted border border-border"
                                ref={hideIfBroken}
                                onError={hideOnError}
                            />
                        )}
                    </div>

                    {mainArticle.content && (
                        <p className="mt-3 text-[15px] leading-[1.5]">
                            {mainArticle.content}...
                        </p>
                    )}

                    <a
                        href={mainArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center h-9 px-4 rounded-sm bg-primary text-primary-foreground text-[14px] font-bold hover:no-underline"
                    >
                        Lexo artikullin »
                    </a>

                    <EditionsLine editions={editions} className="mt-3 text-[13px]" />
                </div>
            )}

            {/* The parts of a big story, each a jump to its group below */}
            {groups && (
                <section className="mt-2">
                    <TabHeading title="Këndet e lajmit" />
                    <ol>
                        {groups.map((group, i) => (
                            <li
                                key={group.angle.lead_article_id}
                                className="py-2 flex items-baseline gap-2.5 border-b border-dotted border-border last:border-b-0"
                            >
                                <span className="w-5 shrink-0 font-display text-[16px] font-extrabold text-hot">
                                    {i + 1}
                                </span>
                                <a href={`#kendi-${i + 1}`} className="min-w-0 flex-1 text-[14px] font-bold leading-[1.3] text-headline">
                                    {group.angle.title}
                                </a>
                                <span className="shrink-0 text-[12px] text-muted-foreground whitespace-nowrap">
                                    {group.angle.article_count} lajme
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {/* Story timeline (only renders if there are 2+ beats) */}
            {beats && beats.length > 1 && (
                <ClusterTimeline beats={beats} articles={allArticles} />
            )}

            {/* Other Articles List — grouped by angle when the story has them */}
            {otherArticles.length > 0 && (
                <section className="mt-6">
                    <TabHeading title={`${articleCount - 1} lajme tjera`} />

                    {groups ? (
                        groups.map((group, i) => (
                            <div key={group.angle.lead_article_id} id={`kendi-${i + 1}`} className="scroll-mt-14">
                                <div className="mt-4 mb-0.5 pb-1 border-b-2 border-border font-display text-[13px] font-bold uppercase text-muted-foreground">
                                    <span className="text-hot">{i + 1}</span>
                                    {` · ${group.angle.article_count} lajme`}
                                </div>
                                <ul>
                                    {group.articles.map((article) => (
                                        <ArticleRow key={article.id} article={article} isDarkMode={isDarkMode} />
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <ul>
                            {otherArticles.map((article) => (
                                <ArticleRow key={article.id} article={article} isDarkMode={isDarkMode} />
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </>
    );
}

/** One article in the list under the lead. */
function ArticleRow({ article, isDarkMode }: { article: Article; isDarkMode: boolean }) {
    const sourceColor = getAccessibleColor(SOURCE_COLORS[article.source_name] || "#3b82f6", isDarkMode);
    return (
        <li className="py-2.5 flex gap-3 border-b border-dotted border-border last:border-b-0">
            <div className="flex-1 min-w-0">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-headline">
                    <h3 className="text-[15px] font-bold leading-[1.3]">{article.title}</h3>
                </a>
                <div className="mt-0.5 text-[12px] text-muted-foreground">
                    <span className="font-bold" style={{ color: sourceColor }}>
                        {article.source_name}
                    </span>
                    {" - "}
                    {getTimeAgo(article.crawled_at)}
                </div>
            </div>
            {article.image_url && (
                <img
                    src={article.image_url}
                    alt=""
                    className="w-16 h-16 shrink-0 object-cover bg-muted border border-border"
                    ref={hideIfBroken}
                    onError={hideOnError}
                />
            )}
        </li>
    );
}
