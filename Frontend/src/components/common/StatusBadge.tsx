/**
 * StatusBadge — Reusable status indicator badge.
 * Replaces repeated inline badge strings for Online/Offline/Live status.
 *
 * Size variants:
 *  - 'xs'  → tiny badge inside dense list items (e.g. ServerPanel row)
 *  - 'sm'  → default, used in modal headers
 */

interface StatusBadgeProps {
    /** Label displayed inside the badge (e.g. 'Online', 'Offline', 'Live') */
    status: string;
    /** Visual variant: 'xs' for compact rows, 'sm' for standard modals */
    size?: 'xs' | 'sm';
}

export const StatusBadge = ({ status, size = 'sm' }: StatusBadgeProps) => {
    const isPositive = ['online', 'live'].includes(status.toLowerCase());

    const sizeClass =
        size === 'xs'
            ? 'text-[7px] sm:text-[8px] px-1.5 py-0.5'
            : 'text-xs px-3 py-1';

    return isPositive ? (
        <span
            className={`${sizeClass} rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-semibold`}
        >
            {status}
        </span>
    ) : (
        <span
            className={`${sizeClass} rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold`}
        >
            {status}
        </span>
    );
};
