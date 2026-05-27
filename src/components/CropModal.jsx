import React, { useEffect, useMemo, useReducer, useRef } from "react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const getAspect = (target) => (target === "avatar" ? 1 : target === "background" ? 16 / 9 : null);
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

const initialState = { imgDisplay: { w: 0, h: 0 }, imgNatural: { w: 0, h: 0 }, crop: { x: 0, y: 0, w: 0, h: 0 } };
function reducer(state, action) {
  switch (action.type) {
    case "INIT": return { ...state, ...action.payload };
    case "SET_CROP": return { ...state, crop: action.payload };
    default: return state;
  }
}

export default function CropModal({ src, onConfirm, onCancel, theme, cropTarget = "avatar" }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dragRef = useRef(null);
  const rafRef = useRef(0);
  const aspect = useMemo(() => getAspect(cropTarget), [cropTarget]);
  const { imgDisplay, imgNatural, crop } = state;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const onImgLoad = (e) => {
    const img = e.currentTarget;
    const maxW = Math.min(window.innerWidth - 64, 900);
    const maxH = Math.min(window.innerHeight * 0.68, 600);
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    const display = { w: Math.round(img.naturalWidth * scale), h: Math.round(img.naturalHeight * scale) };
    dispatch({ type: "INIT", payload: { imgNatural: { w: img.naturalWidth, h: img.naturalHeight }, imgDisplay: display, crop: createCrop({ ...display, aspect }) } });
  };

  const startDrag = (e, mode) => { e.currentTarget.setPointerCapture(e.pointerId); dragRef.current = { mode, px: e.clientX, py: e.clientY, snap: { ...crop } }; };
  const stopDrag = () => { dragRef.current = null; };
  const onDrag = (e) => {
    if (!dragRef.current || !imgDisplay.w || rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const { mode, px, py, snap } = dragRef.current || {};
      if (!mode) return;
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
    });
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

  return <div onWheel={(e) => e.preventDefault()} onClick={(e) => e.target === e.currentTarget && onCancel()} style={{ position: "fixed", inset: 0, zIndex: 20000, display: "grid", placeItems: "center", padding: 24, overflow: 'hidden', background: "color-mix(in srgb, var(--theme-bg) 18%, #000)", backdropFilter: "blur(10px)" }}>
    <div style={{ width: "min(980px,96vw)", borderRadius: 22, border: "1px solid var(--theme-border)", background: "color-mix(in srgb, var(--theme-surface) 94%, var(--theme-bg))", boxShadow: "0 28px 60px rgba(0,0,0,.35)", padding: 18, display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ margin: 0, fontSize: 18, color: "var(--theme-text-primary)" }}>Crop image</h3><button className="fpill" onClick={onCancel}>✕ Close</button></div>
      <div onPointerMove={onDrag} onPointerUp={stopDrag} onPointerLeave={stopDrag} style={{ position: "relative", borderRadius: 18, overflow: "hidden", border: "1px solid var(--theme-border)", minHeight: 140, display: "grid", placeItems: "center" }}>
        <div style={{ position: "relative", width: imgDisplay.w || "auto", height: imgDisplay.h || "auto" }}>
          <img src={src} onLoad={onImgLoad} draggable={false} style={{ display: "block", width: imgDisplay.w || "auto", height: imgDisplay.h || "auto", maxWidth: "100%", userSelect: "none" }} />
          {imgDisplay.w > 0 && <>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(1,6,14,.55)' }} />
            <div style={{ position: 'absolute', left: crop.x, top: crop.y, width: crop.w, height: crop.h, boxShadow: '0 0 0 9999px rgba(0,0,0,.45)', border: `2px solid ${theme?.accent || "var(--theme-accent)"}`, borderRadius: 12, cursor: 'move' }} onPointerDown={(e) => startDrag(e, 'move')}>
              <button onPointerDown={(e) => startDrag(e, "resize")} style={{ position: "absolute", right: -10, bottom: -10, width: 24, height: 24, borderRadius: 999, border: "2px solid #fff", background: theme?.accent || "var(--theme-accent)", cursor: "nwse-resize" }} />
            </div>
          </>}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: 'flex-end', gap: 10 }}><button className="fpill" onClick={onCancel}>Cancel</button><button className="fpill" onClick={confirm} style={{ background: "linear-gradient(135deg,var(--theme-accent), color-mix(in srgb,var(--theme-accent) 62%, #fff))", color: "#fff", borderColor: "transparent" }}>Apply Crop</button></div>
    </div>
  </div>;
}
