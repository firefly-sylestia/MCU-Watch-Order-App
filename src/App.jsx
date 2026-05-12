> mcu-viewing-order@2.0.0 build
> vite build

vite v5.4.21 building for production...
transforming...
✓ 5 modules transformed.
x Build failed in 65ms
error during build:
[vite:esbuild] Transform failed with 1 error:
/home/runner/work/mcu-viewing-order/mcu-viewing-order/src/App.jsx:700:6: ERROR: Expected "}" but found "{"
file: /home/runner/work/mcu-viewing-order/mcu-viewing-order/src/App.jsx:700:6

Expected "}" but found "{"
698|        </div>
699|  
700|        {/* ━━ CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
   |        ^
701|        <main ref={mainRef} style={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, WebkitOverflowScrolling: 'touch', width: '100%' }}>
702|          <div style={{ maxWidth: '100vw', overflow: 'hidden', width: '100%' }}>

    at failureErrorWithLog (/home/runner/work/mcu-viewing-order/mcu-viewing-order/node_modules/esbuild/lib/main.js:1472:15)
    at /home/runner/work/mcu-viewing-order/mcu-viewing-order/node_modules/esbuild/lib/main.js:755:50
    at responseCallbacks.<computed> (/home/runner/work/mcu-viewing-order/mcu-viewing-order/node_modules/esbuild/lib/main.js:622:9)
    at handleIncomingPacket (/home/runner/work/mcu-viewing-order/mcu-viewing-order/node_modules/esbuild/lib/main.js:677:12)
    at Socket.readFromStdout (/home/runner/work/mcu-viewing-order/mcu-viewing-order/node_modules/esbuild/lib/main.js:600:7)
    at Socket.emit (node:events:519:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)
    at Pipe.onStreamRead (node:internal/stream_base_commons:189:23)
Error: Process completed with exit code 1.
