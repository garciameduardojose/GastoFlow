"use client";

import { useState } from "react";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function DashboardPage() {
  const [monthIndex, setMonthIndex] = useState(3);
  const [year, setYear] = useState(2026);

  const prevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(y => y - 1);
    } else {
      setMonthIndex(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(y => y + 1);
    } else {
      setMonthIndex(m => m + 1);
    }
  };

  const month = `${MONTHS[monthIndex]} ${year}`;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-3 text-sm text-[#6b7280]">
          <button className="hover:text-white" onClick={prevMonth}>←</button>
          <span className="text-white font-medium">{month}</span>
          <button className="hover:text-white" onClick={nextMonth}>→</button>
        </div>
      </div>
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-4 py-3 text-sm text-[#f59e0b]">
        <span>⚠</span>
        <span>
          <strong>Falta la tasa del dia</strong> — Debes esperar a que se registre la tasa oficial para el 31/03/2026 antes de guardar.
        </span>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] p-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-emerald-100">
            <span>$</span>
            <span>Balance USD</span>
          </div>
          <div className="font-mono text-4xl font-bold text-white">$0.00</div>
        </div>
        <div className="rounded-xl border border-[#f59e0b]/40 bg-[#111111] p-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-[#f59e0b]">
            <span>Bs</span>
            <span>Balance Bolivares</span>
          </div>
          <div className="font-mono text-4xl font-bold text-[#f59e0b]">Bs 0,00</div>
          <div className="mt-1 text-xs text-[#6b7280]">Registra la tasa de hoy para ver equivalente</div>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-[#6b7280]">
            <span>📉</span> Gastos
          </div>
          <div className="font-mono text-xl font-bold text-[#ef4444]">-$0.00</div>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-[#6b7280]">
            <span>📈</span> Ingresos Bs
          </div>
          <div className="font-mono text-xl font-bold text-[#10b981]">+Bs 0,00</div>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-[#6b7280]">
            <span>$</span> Ingresos USD
          </div>
          <div className="font-mono text-xl font-bold text-[#10b981]">+$0.00</div>
        </div>
      </div>
      <div className="mb-6 rounded-xl border border-[#2a2a2a] bg-[#111111] p-6">
        <h2 className="mb-6 font-semibold text-white">Gastos por categoria</h2>
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-[#6b7280]">
          <span className="text-3xl">📊</span>
          <span className="text-sm">Aun no hay gastos este mes</span>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <a href="/transactions/new" className="flex items-center justify-center gap-2 rounded-xl bg-[#10b981] py-4 font-medium text-white hover:bg-[#059669] transition-colors">
          <span>+</span> Agregar movimiento
        </a>
        <a href="/reports" className="flex items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#111111] py-4 font-medium text-[#6b7280] hover:text-white hover:border-[#6b7280] transition-colors">
          <span>📊</span> Reportes
        </a>
      </div>
      <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">Movimientos recientes</h2>
          <a href="/transactions" className="text-sm text-[#10b981] hover:underline">Ver todos</a>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-[#6b7280]">
          <span className="text-sm">No hay movimientos este mes</span>
        </div>
      </div>
    </div>
  );
}
