import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

export default function FilteredPassesChart({ initialData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  let completos = 0;
  let incompletos = 0;

  if (Array.isArray(initialData)) {
    initialData.forEach(e => {
      const tipo = e.event?.toLowerCase();
      if (tipo === "pase filtrado completo") completos++;
      if (tipo === "pase filtrado incompleto") incompletos++;
    });
  }

  useEffect(() => {
    if (!chartRef.current || (completos === 0 && incompletos === 0)) return;

    // ⏳ ESPERAR a que el Magic termine de animarse
    const raf = requestAnimationFrame(() => {
      if (!chartRef.current) return;

      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }

      const chart = chartInstance.current;

      chart.setOption({
        backgroundColor: "transparent",
        tooltip: { trigger: "item" },
        legend: {
          bottom: "0%",
          left: "center",
          textStyle: {
            color: "#cbd5e1",
            fontSize: 11
          }
        },
        color: ["#7c3aed", "#38bdf8"], // 🟣 morado | 🔵 azul
        series: [
          {
            name: "Pases Filtrados",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#020617",
              borderWidth: 2
            },
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 36,
                fontWeight: "bold",
                color: "#ffffff",
                formatter: "{b}\n{c}"
              }
            },
            labelLine: { show: false },
            data: [
              { value: completos, name: "Completos" },
              { value: incompletos, name: "Incompletos" }
            ]
          }
        ]
      });

      // 🔑 FORZAR resize (CRÍTICO)
      setTimeout(() => {
        chart.resize();
      }, 50);
    });

    return () => {
      cancelAnimationFrame(raf);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [initialData, completos, incompletos]);

  return (
    <div style={{ width: "100%", minHeight: 360 }}>
      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          marginBottom: "0.75rem",
          color: "#e5e7eb"
        }}
      >
        Pases Filtrados
      </h3>

      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: 300
        }}
      />
    </div>
  );
}
