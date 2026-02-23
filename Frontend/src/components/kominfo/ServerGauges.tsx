/**
 * ServerGauges — Render 3 MiniGauge (CPU, Memory, Storage) dari data server
 * Dipakai di ServerPanel (card kecil) dan ServerExpandModal (modal besar)
 */
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { calcPercent, formatGB, formatMHz, getUsageColor } from '../../services/serverApi';
import type { ServerResources } from '../../services/serverApi';

/** Mini Donut Chart untuk satu metrik */
export const MiniGauge = ({ label, percent, used, total, color, isDark, expanded = false }: {
    label: string; percent: number; used: string; total: string; color: string; isDark: boolean; expanded?: boolean;
}) => {
    const data = [
        { name: 'used', value: percent },
        { name: 'free', value: 100 - percent },
    ];
    const size = expanded ? 120 : 52;
    const inner = expanded ? 38 : 15;
    const outer = expanded ? 52 : 22;
    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data} cx="50%" cy="50%"
                            innerRadius={inner} outerRadius={outer}
                            startAngle={90} endAngle={-270}
                            dataKey="value" strokeWidth={0}
                        >
                            <Cell fill={color} />
                            <Cell fill={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold text-white ${expanded ? 'text-lg' : 'text-[9px]'}`}>{percent}%</span>
                </div>
            </div>
            <p className={`font-semibold text-white ${expanded ? 'text-sm mt-2' : 'text-[8px] mt-0.5'}`}>{label}</p>
            <p className={`${expanded ? 'text-xs mt-0.5' : 'text-[7px]'} ${isDark ? 'text-slate-400' : 'text-blue-200'}`}>{used} / {total}</p>
        </div>
    );
};

/** Render 3 gauges (CPU + Memory + Storage) */
export const ServerGauges = ({ resources, isDark, expanded = false }: {
    resources: ServerResources; isDark: boolean; expanded?: boolean;
}) => (
    <div className={`flex items-center ${expanded ? 'justify-around gap-4' : 'justify-around'}`}>
        <MiniGauge
            label="CPU"
            percent={calcPercent(resources.cpu.usedMHz, resources.cpu.capacityMHz)}
            used={formatMHz(resources.cpu.usedMHz)}
            total={formatMHz(resources.cpu.capacityMHz)}
            color={getUsageColor(calcPercent(resources.cpu.usedMHz, resources.cpu.capacityMHz))}
            isDark={isDark}
            expanded={expanded}
        />
        <MiniGauge
            label="Memory"
            percent={calcPercent(resources.memory.usedGB, resources.memory.capacityGB)}
            used={formatGB(resources.memory.usedGB)}
            total={formatGB(resources.memory.capacityGB)}
            color={getUsageColor(calcPercent(resources.memory.usedGB, resources.memory.capacityGB))}
            isDark={isDark}
            expanded={expanded}
        />
        <MiniGauge
            label="Storage"
            percent={calcPercent(resources.storage.usedGB, resources.storage.capacityGB)}
            used={formatGB(resources.storage.usedGB)}
            total={formatGB(resources.storage.capacityGB)}
            color={getUsageColor(calcPercent(resources.storage.usedGB, resources.storage.capacityGB))}
            isDark={isDark}
            expanded={expanded}
        />
    </div>
);
