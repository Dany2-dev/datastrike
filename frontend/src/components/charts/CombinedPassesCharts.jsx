import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent, TitleComponent, GridComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// Es importante registrar TitleComponent y GridComponent
echarts.use([
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

export default function CombinedPassesCharts({ initialData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // ─────────────────────────────
  // PROCESAMIENTO DE DATOS (FIX REAL)
  // ─────────────────────────────
  let pasesC = 0, pasesI = 0;
  let filtradosC = 0, filtradosI = 0;
  let duelosG = 0, duelosP = 0;

  if (Array.isArray(initialData)) {
    initialData.forEach(e => {
      const t = e.event
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      // Pases normales
      if (t === "pase completo") pasesC++;
      if (t === "pase incompleto") pasesI++;

      // Pases filtrados (en el Excel NO existen completos / incompletos)
      if (t === "pase filtrado") filtradosC++;

      // Balón aéreo (así viene en el Excel)
      if (t === "balon aereo ganado") duelosG++;
      if (t === "balon aereo perdido") duelosP++;
    });
  }

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    const commonSeriesSettings = {
      type: "pie",
      radius: ["28%", "45%"],
      label: { show: false },
      itemStyle: {
        borderRadius: 8,
        borderColor: "#020617",
        borderWidth: 2
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 30,
          fontWeight: "bold",
          color: "#fff",
          formatter: "{d}%"
        }
      }
    };

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        textStyle: { color: "#fff" },
        borderColor: "#334155"
      },
      title: [
        { text: "Pases Totales", left: "center", top: "0%", textStyle: { color: "#e5e7eb", fontSize: 16 } },
        { text: "Pases Filtrados", left: "center", top: "33%", textStyle: { color: "#e5e7eb", fontSize: 16 } },
        { text: "Duelos Aéreos", left: "center", top: "66%", textStyle: { color: "#e5e7eb", fontSize: 16 } }
      ],
      color: ["#7c3aed", "#38bdf8"],
      series: [
        {
          ...commonSeriesSettings,
          center: ["50%", "18%"],
          data: [
            { value: pasesC, name: "Completados" },
            { value: pasesI, name: "Perdidos" }
          ]
        },
        {
          ...commonSeriesSettings,
          center: ["50%", "51%"],
          data: [
            { value: filtradosC, name: "Pases filtrados" },
            { value: filtradosI, name: "—" }
          ]
        },
        {
          ...commonSeriesSettings,
          center: ["50%", "84%"],
          data: [
            { value: duelosG, name: "Ganados" },
            { value: duelosP, name: "Perdidos" }
          ]
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      chartInstance.current = null;
    };
  }, [initialData, pasesC, pasesI, filtradosC, filtradosI, duelosG, duelosP]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        ref={chartRef}
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "800px"
        }}
      />
    </div>
  );
}
