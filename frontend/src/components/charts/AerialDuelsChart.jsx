import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

export default function AerialDuelsChart({ initialData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  let ganados = 0;
  let perdidos = 0;

  if (Array.isArray(initialData)) {
    initialData.forEach(e => {
      const tipo = e.event?.toLowerCase();
      if (tipo === "duelo aéreo ganado") ganados++;
      if (tipo === "duelo aéreo perdido") perdidos++;
    });
  }

  useEffect(() => {
    if (!chartRef.current || (ganados === 0 && perdidos === 0)) return;

    chartInstance.current = echarts.init(chartRef.current);

    chartInstance.current.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "item" },
      legend: {
        bottom: 0,
        textStyle: { color: "#94a3b8", fontSize: 11 }
      },
      color: ["#a855f7", "#ef4444"],
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          data: [
            { value: ganados, name: "Ganados" },
            { value: perdidos, name: "Perdidos" }
          ]
        }
      ]
    });

    return () => {
      chartInstance.current?.dispose();
    };
  }, [initialData]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Duelos Aéreos</h3>
      <div ref={chartRef} className="w-full h-[300px]" />
    </div>
  );
}
