import React, { useMemo, useReducer, useRef } from "react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const getAspect = (target) => {
  if (target === "avatar") return 1;
  if (target === "background") return 16 / 9;
  return null;
};

const createCrop = ({ w, h, aspect }) => {
  const margin = 18;
  let cw = Math.max(80, w - margin * 2);
  let ch = Math.max(80, h - margin * 2);
  if (aspect) {
    if (cw / ch > aspect) cw = ch * aspect;
    else ch = cw / aspect;
  }
  return { x: Math.round((w - cw) / 2), y: Math.round((h - ch) / 2), w: Math.round(cw), h: Math.round(ch) };
};

const initialState = { imgDisplay: { w: 0, h: 0 }, imgNatural: { w: 0, h: 0 }, crop: { x: 0, y: 0, w: 0, h: 0 }, zoom: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "INIT": return { ...state, ...action.payload };
    case "SET_CROP": return { ...state, crop: action.payload };
    case "SET_ZOOM": return { ...state, zoom: action.payload };
    default: return state;
  }
}

export default function CropModal({ src, onConfirm, onCancel, theme, cropTarget = "avatar" }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dragRef = useRef(null);
  const aspect = useMemo(() => getAspect(cropTarget), [cropTarget]);
  const { imgDisplay, imgNatural, crop, zoom } = state;

  const onImgLoad = (e) => {
    const img = e.currentTarget;
    const maxW = Math.min(window.innerWidth - 64, 760);
    const maxH = Math.min(window.innerHeight * 0.66, 520);
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    const display = { w: Math.round(img.naturalWidth * scale), h: Math.round(img.naturalHeight * scale) };
    dispatch({ type: "INIT", payload: { imgNatural: { w: img.naturalWidth, h: img.naturalHeight }, imgDisplay: display, crop: createCrop({ ...display, aspect }) } });
  };

  const startDrag = (e, mode) => { e.currentTarget.setPointerCapture(e.pointerId); dragRef.current = { mode, px: e.clientX, py: e.clientY, snap: { ...crop } }; };
  const stopDrag = () => { dragRef.current = null; };

  const onDrag = (e) => {
    if (!dragRef.current || !imgDisplay.w) return;
    const { mode, px, py, snap } = dragRef.current;
    const dx = e.clientX - px;
    const dy = e.clientY - py;
    if (mode === "move") {
      dispatch({ type: "SET_CROP", payload: { ...snap, x: clamp(snap.x + dx, 0, imgDisplay.w - snap.w), y: clamp(snap.y + dy, 0, imgDisplay.h - snap.h) } });
      return;
    }
    let nw = clamp(snap.w + dx, 56, imgDisplay.w - snap.x);
    let nh = clamp(snap.h + dy, 56, imgDisplay.h - snap.y);
    if (aspect) {
      if (Math.abs(dx) > Math.abs(dy)) nh = nw / aspect;
      else nw = nh * aspect;
      nw = clamp(nw, 56, imgDisplay.w - snap.x);
      nh = clamp(nh, 56, imgDisplay.h - snap.y);
    }
    dispatch({ type: "SET_CROP", payload: { ...snap, w: Math.round(nw), h: Math.round(nh) } });
  };

  const confirm = () => {
    if (!imgDisplay.w) return;
    const scX = imgNatural.w / imgDisplay.w;
    const scY = imgNatural.h / imgDisplay.h;
    const sx = Math.round(crop.x * scX);
    const sy = Math.round(crop.y * scY);
    const sw = Math.round(crop.w * scX);
    const sh = Math.round(crop.h * scY);
    const cvs = document.createElement("canvas");
    cvs.width = sw; cvs.height = sh;
    const img = new Image();
    img.onload = () => { cvs.getContext("2d")?.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh); onConfirm(cvs.toDataURL("image/png", 0.96)); };
    img.src = src;
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onCancel()} style={{ position: "fixed", inset: 0, zIndex: 20000, display: "grid", placeItems: "center", padding: 24, background: "color-mix(in srgb, var(--theme-bg) 18%, #000)", backdropFilter: "blur(10px)", animation: "fadeIn 180ms ease-out" }}>
      <div style={{ width: "min(860px,96vw)", borderRadius: 22, border: "1px solid var(--theme-border)", background: "color-mix(in srgb, var(--theme-surface) 94%, var(--theme-bg))", boxShadow: "0 28px 60px rgba(0,0,0,.35)", padding: 18, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, color: "var(--theme-text-primary)" }}>Modern Crop Studio</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--theme-text-secondary)" }}>Drag to move. Use corner handle to resize{aspect ? ` (${aspect === 1 ? "1:1" : "16:9"} locked)` : ""}.</p>
          </div>
          <button className="fpill" onClick={onCancel}><span aria-hidden>✕</span> Close</button>
        </div>
        <div onPointerMove={onDrag} onPointerUp={stopDrag} onPointerLeave={stopDrag} style={{ position: "relative", borderRadius: 18, overflow: "hidden", border: "1px solid var(--theme-border)", background: "linear-gradient(140deg, color-mix(in srgb,var(--theme-accent) 10%, #0b1220), #070b15)", minHeight: 120, display: "grid", placeItems: "center" }}>
          <div style={{ position: "relative", width: imgDisplay.w || "auto", height: imgDisplay.h || "auto", transform: `scale(${zoom})`, transition: "transform 140ms ease" }}>
            <img src={src} onLoad={onImgLoad} draggable={false} style={{ display: "block", width: imgDisplay.w || "auto", height: imgDisplay.h || "auto", maxWidth: "100%", userSelect: "none" }} />
            {imgDisplay.w > 0 && <>
              <div style={{ position: "absolute", inset: 0, background: "rgba(1,6,14,.56)", clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${crop.x}px ${crop.y}px,${crop.x}px ${crop.y + crop.h}px,${crop.x + crop.w}px ${crop.y + crop.h}px,${crop.x + crop.w}px ${crop.y}px,${crop.x}px ${crop.y}px)` }} />
              <div onPointerDown={(e) => startDrag(e, "move")} style={{ position: "absolute", left: crop.x, top: crop.y, width: crop.w, height: crop.h, border: `2px solid ${theme?.accent || "var(--theme-accent)"}`, borderRadius: 12, boxShadow: "0 0 0 1px rgba(255,255,255,.55) inset", cursor: "move" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(90deg,transparent 49%,rgba(255,255,255,.25) 50%,transparent 51%),linear-gradient(transparent 49%,rgba(255,255,255,.25) 50%,transparent 51%)", backgroundSize: "33.33% 100%,100% 33.33%", pointerEvents: "none" }} />
                <button onPointerDown={(e) => startDrag(e, "resize")} style={{ position: "absolute", right: -10, bottom: -10, width: 26, height: 26, borderRadius: 999, border: "2px solid #fff", background: theme?.accent || "var(--theme-accent)", cursor: "nwse-resize" }} />
              </div>
            </>}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, alignItems: "center" }}>
          <label style={{ fontSize: 12, color: "var(--theme-text-secondary)", display: "grid", gap: 4 }}>Zoom preview: {Math.round(zoom * 100)}%
            <input type="range" min="1" max="1.45" step="0.05" value={zoom} onChange={(e) => dispatch({ type: "SET_ZOOM", payload: Number(e.target.value) })} />
          </label>
          <button className="fpill" onClick={onCancel}>Cancel</button>
          <button className="fpill" onClick={confirm} style={{ background: "linear-gradient(135deg,var(--theme-accent), color-mix(in srgb,var(--theme-accent) 62%, #fff))", color: "#fff", borderColor: "transparent" }}>Apply Crop</button>
        </div>
      </div>
    </div>
  );
}
