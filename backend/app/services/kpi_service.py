import pandas as pd
from fastapi import HTTPException

def kpis_por_periodo(df_input: pd.DataFrame):
    # Usamos .copy() para evitar el SettingWithCopyWarning en Windows
    if df_input is None or df_input.empty:
        raise HTTPException(status_code=422, detail="No hay datos para KPIs")
    
    df = df_input.copy()

    if "periodo" not in df.columns:
        raise HTTPException(status_code=422, detail="Columna 'periodo' no encontrada")

    df["periodo"] = df["periodo"].astype(str)

    # Identificar columna de eventos (event, evento, type)
    event_col = next(
        (c for c in df.columns if c.lower() in ["event", "evento", "type"]),
        None
    )

    if not event_col:
        raise HTTPException(status_code=422, detail="Columna de eventos no encontrada")

    df[event_col] = df[event_col].astype(str)

    result = {}

    # Iterar por cada tiempo (1T, 2T, etc.)
    for periodo in df["periodo"].dropna().unique():
        d = df[df["periodo"] == periodo].copy()
        eventos = d[event_col]

        data = {
            "eventos": int(len(d)),
            "pases": int(eventos.str.contains("pase", case=False, na=False).sum()),
            "tiros": int(eventos.str.contains("shot|tiro|remate", case=False, na=False).sum()),
            # Corregido: Usamos (?:...) para evitar el UserWarning de grupos de captura
            "goles": int(eventos.str.contains(r"\b(?:goal|gol)\b", case=False, na=False, regex=True).sum()),
        }

        # Cálculo de xG si la columna existe
        if "xg" in d.columns:
            xg_values = pd.to_numeric(d["xg"], errors="coerce")
            data["xg_total"] = float(xg_values.fillna(0).sum())
        else:
            data["xg_total"] = 0.0

        result[periodo] = data
    return result


def calcular_kpis(df):
    df = df.copy()

    event_col = next(
        (c for c in df.columns if c.lower() in ["event", "evento", "type"]),
        None
    )

    if not event_col:
        raise HTTPException(status_code=422, detail="Columna de eventos no encontrada")

    result = {
        "general": {},
        "por_periodo": {},
        "por_jugador": {}
    }

    # ===== GENERAL =====
    result["general"] = {
        "eventos": int(len(df)),
        "pases": int(df[event_col].str.contains("pase", case=False, na=False).sum()),
        "tiros": int(df[event_col].str.contains("tiro|shot|remate", case=False, na=False).sum()),
        "goles": int(df[event_col].str.contains(r"\b(?:gol|goal)\b", case=False, na=False).sum()),
        "xg": float(df["xg"].sum()) if "xg" in df.columns else 0.0
    }

    # ===== POR PERIODO =====
    for periodo, d in df.groupby("periodo"):
        result["por_periodo"][periodo] = {
            "eventos": int(len(d)),
            "goles": int(d[event_col].str.contains(r"\b(?:gol|goal)\b", case=False, na=False).sum()),
            "xg": float(d["xg"].sum()) if "xg" in d.columns else 0.0
        }

    # ===== POR JUGADOR =====
    for jugador_id, d in df.groupby("id_jugador"):
        jugador_nombre = (
            d["jugador"].iloc[0]
            if "jugador" in d.columns and d["jugador"].notna().any()
            else "Desconocido"
        )

        imagen_jugador = (
            d["imagen_jugador"].iloc[0]
            if "imagen_jugador" in d.columns and d["imagen_jugador"].notna().any()
            else ""
        )

        result["por_jugador"][int(jugador_id)] = {
            "jugador": jugador_nombre,
            "imagen_jugador": imagen_jugador,
            "eventos": int(len(d)),
            "tiros": int(
                d[event_col].str.contains("tiro|shot|remate", case=False, na=False).sum()
            ),
            "goles": int(
                d[event_col].str.contains(r"\b(?:gol|goal)\b", case=False, na=False).sum()
            ),
            "xg": float(d["xg"].sum()) if "xg" in d.columns else 0.0,
        }

    return result
