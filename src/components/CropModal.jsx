import React, { useReducer, useRef } from "react";
import './CropModal.css';
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const initialCropState = { imgDisplay: { w: 0, h: 0 }, imgNatural: { w: 0, h: 0 }, crop: { x: 0, y: 0, w: 220, h: 220 } };
function cropReducer(state, action) { if (action.type === 'INIT_IMAGE') return { ...state, ...action.payload }; if (action.type === 'SET_CROP') return { ...state, crop: action.payload }; return state; }
export default function CropModal({ src, onConfirm, onCancel, cropTarget = 'avatar' }) {
  const [state, dispatch] = useReducer(cropReducer, initialCropState); const dragRef = useRef(null); const { imgDisplay, imgNatural, crop } = state;
  const onImgLoad = (e) => { const img = e.currentTarget; const maxW = Math.min(window.innerWidth - 56, 620); const maxH = Math.min(window.innerHeight * 0.62, 520); const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1); const dw = Math.round(img.naturalWidth * scale); const dh = Math.round(img.naturalHeight * scale); const initW = Math.round(dw * 0.78); const initH = Math.round(dh * 0.78); dispatch({ type: 'INIT_IMAGE', payload: { imgNatural: { w: img.naturalWidth, h: img.naturalHeight }, imgDisplay: { w: dw, h: dh }, crop: { x: Math.round((dw - initW) / 2), y: Math.round((dh - initH) / 2), w: initW, h: initH } } }); };
  const handleDown = (e, mode) => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); dragRef.current = { mode, px: e.clientX, py: e.clientY, snap: { ...crop } }; };
  const handleMove = (e) => { if (!dragRef.current) return; const { mode, px, py, snap } = dragRef.current; const dx = e.clientX - px; const dy = e.clientY - py; if (mode === 'move') return dispatch({ type: 'SET_CROP', payload: { x: clamp(snap.x + dx, 0, imgDisplay.w - snap.w), y: clamp(snap.y + dy, 0, imgDisplay.h - snap.h), w: snap.w, h: snap.h } }); dispatch({ type: 'SET_CROP', payload: { ...crop, w: clamp(snap.w + dx, 60, imgDisplay.w - snap.x), h: clamp(snap.h + dy, 60, imgDisplay.h - snap.y) } }); };
  const confirmCrop = () => { if (!imgDisplay.w) return; const sx = Math.round(crop.x * (imgNatural.w / imgDisplay.w)); const sy = Math.round(crop.y * (imgNatural.h / imgDisplay.h)); const sw = Math.round(crop.w * (imgNatural.w / imgDisplay.w)); const sh = Math.round(crop.h * (imgNatural.h / imgDisplay.h)); const cvs = document.createElement('canvas'); cvs.width = sw; cvs.height = sh; const ctx = cvs.getContext('2d'); const img = new Image(); img.onload = () => { ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh); onConfirm(cvs.toDataURL('image/png')); }; img.src = src; };
  const title = cropTarget === 'background' ? 'Background Crop Studio' : cropTarget === 'overlay' ? 'Overlay Crop Studio' : 'Avatar Crop Studio';
  return <div className='crop-modal-backdrop' onClick={(e) => e.target === e.currentTarget && onCancel()}><div className='crop-modal'>
    <header className='crop-modal__head'><div><h3 className='crop-modal__title'>{title}</h3><p className='crop-modal__desc'>Drag to move, use corner handle to resize, then apply.</p></div><button className='crop-modal__icon-btn' onClick={onCancel}>✕</button></header>
    <section className='crop-stage' onPointerMove={handleMove} onPointerUp={() => (dragRef.current = null)} onPointerLeave={() => (dragRef.current = null)}>
      <div style={{ position: 'relative', width: imgDisplay.w || 'auto', height: imgDisplay.h || 'auto' }}><img src={src} onLoad={onImgLoad} draggable={false} />
        {imgDisplay.w > 0 && <><div className='crop-mask'><div style={{ top: 0, left: 0, right: 0, height: crop.y }} /><div style={{ top: crop.y + crop.h, left: 0, right: 0, bottom: 0 }} /><div style={{ top: crop.y, left: 0, width: crop.x, height: crop.h }} /><div style={{ top: crop.y, left: crop.x + crop.w, right: 0, height: crop.h }} /></div>
          <div className='crop-box' onPointerDown={(e) => handleDown(e, 'move')} style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}><div className='crop-grid'>{Array.from({ length: 9 }).map((_, i) => <span key={i} />)}</div><div className='crop-handle' onPointerDown={(e) => handleDown(e, 'resize')} /></div></>}
      </div>
    </section>
    <footer className='crop-modal__foot'><button className='crop-btn crop-btn--ghost' onClick={onCancel}>Cancel</button><button className='crop-btn crop-btn--accent' onClick={confirmCrop}>Apply Crop</button></footer>
  </div></div>;
}
