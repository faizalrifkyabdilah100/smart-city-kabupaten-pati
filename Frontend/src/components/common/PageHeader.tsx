/**
 * PageHeader — Reusable page header component.
 * Handles the consistent title + date-badge layout used across all dashboard pages.
 * Accepts a `children` slot for extra items (back buttons, live indicators, etc.).
 */
import React from 'react';
import { formatTanggal } from '../../utils/formatTanggal';
import { useThemeStyles } from '../../hooks/useThemeStyles';

interface PageHeaderProps {
    /** Main title text (before the accent) */
    title: string;
    /** Colored accent part of the title */
    titleAccent: string;
    /** Tailwind color class for the accent span, e.g. 'text-purple-400' */
    titleAccentColor?: string;
    /** Optional subtitle line below the title */
    subtitle?: string;
    /**
     * Extra elements rendered to the LEFT of the date badge.
     * Use this for back buttons, live indicators, etc.
     */
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    titleAccent,
    titleAccentColor = 'text-white',
    subtitle,
    children,
}) => {
    const { headingStyle, subTextStyle, dateBadgeStyle } = useThemeStyles();

    return (
        <div className="w-full py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 animate-slide-down shrink-0 z-20">
            <div>
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight drop-shadow-lg ${headingStyle}`}>
                    {title} <span className={titleAccentColor}>{titleAccent}</span>
                </h1>
                {subtitle && (
                    <p className={`text-xs sm:text-sm lg:text-base font-light ${subTextStyle}`}>
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {children}
                <div className={dateBadgeStyle}>{formatTanggal()}</div>
            </div>
        </div>
    );
};
