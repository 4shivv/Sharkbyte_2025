import React, { useRef, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faStickyNote,
  faEraser,
  faPen,
  faRulerCombined,
  faPalette,
  faSquare,
  faBorderAll,
} from "@fortawesome/free-solid-svg-icons";

const CollaborationBoard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState("pen");
  const [penType, setPenType] = useState("pencil");
  const [penColor, setPenColor] = useState("#1a1a1a");
  const [eraserSize, setEraserSize] = useState(15);
  const [showGrid, setShowGrid] = useState(true);
  const [frames, setFrames] = useState([]);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;
    ctxRef.current = ctx;
  }, []);

  // Resize canvas dynamically
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctxRef.current.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smooth zoom with trackpad/mouse wheel
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((z) => Math.min(Math.max(z + delta, 0.5), 3));
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Mouse position helper
  const getMousePosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  // Drawing logic
  const startDrawing = (e) => {
    if (tool !== "pen" && tool !== "eraser") return;
    const { x, y } = getMousePosition(e);
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    if (!isDrawing) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getMousePosition(e);
    const ctx = ctxRef.current;

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = eraserSize;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = penColor;
      ctx.globalAlpha =
        penType === "marker" ? 0.7 : penType === "highlighter" ? 0.4 : 1.0;
      ctx.lineWidth =
        penType === "pencil" ? 2 : penType === "marker" ? 6 : 10;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Frames
  const addFrame = () => {
    const newFrame = {
      id: Date.now(),
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight / 2 - 100,
      width: 400,
      height: 300,
      title: "New Frame",
    };
    setFrames((prev) => [...prev, newFrame]);
  };

  // Sticky Notes
  const addStickyNote = () => {
    const newNote = {
      id: Date.now(),
      x: window.innerWidth / 2 - 60,
      y: window.innerHeight / 2 - 60,
      width: 160,
      height: 140,
      text: "New Note",
    };
    setStickyNotes((prev) => [...prev, newNote]);
  };

  const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#E6F1FF]"
      onMouseMove={handleMouseMove}
    >
      {/* Optional Grid */}
      {showGrid && (
        <svg
          className="absolute inset-0"
          width="100%"
          height="100%"
          style={{ pointerEvents: "none", transform: `scale(${zoom})` }}
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <React.Fragment key={i}>
              <line
                x1={i * 50}
                y1={0}
                x2={i * 50}
                y2="100%"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
              />
              <line
                x1={0}
                y1={i * 50}
                x2="100%"
                y2={i * 50}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
              />
              <text
                x={i * 50 + 2}
                y={12}
                fontSize="8"
                fill="rgba(0,0,0,0.4)"
              >
                {i * 50}
              </text>
            </React.Fragment>
          ))}
        </svg>
      )}

      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        className="absolute inset-0 cursor-none"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
          width: "100%",
          height: "100%",
        }}
      />

      {/* Frames */}
      {frames.map((frame) => (
        <Rnd
          key={frame.id}
          bounds="parent"
          size={{ width: frame.width, height: frame.height }}
          position={{ x: frame.x, y: frame.y }}
          onDragStop={(e, d) =>
            setFrames((prev) =>
              prev.map((f) =>
                f.id === frame.id ? { ...f, x: d.x, y: d.y } : f
              )
            )
          }
          onResizeStop={(e, dir, ref, delta, pos) =>
            setFrames((prev) =>
              prev.map((f) =>
                f.id === frame.id
                  ? {
                      ...f,
                      width: ref.offsetWidth,
                      height: ref.offsetHeight,
                      ...pos,
                    }
                  : f
              )
            )
          }
          className="bg-white border-2 border-gray-300 rounded-md shadow-lg"
        >
          <div className="p-2 text-gray-600 text-sm font-medium">
            {frame.title}
          </div>
        </Rnd>
      ))}

      {/* Sticky Notes */}
      {stickyNotes.map((note) => (
        <Rnd
          key={note.id}
          bounds="parent"
          size={{ width: note.width, height: note.height }}
          position={{ x: note.x, y: note.y }}
          onDragStop={(e, d) =>
            setStickyNotes((prev) =>
              prev.map((n) =>
                n.id === note.id ? { ...n, x: d.x, y: d.y } : n
              )
            )
          }
          onResizeStop={(e, dir, ref, delta, pos) =>
            setStickyNotes((prev) =>
              prev.map((n) =>
                n.id === note.id
                  ? {
                      ...n,
                      width: ref.offsetWidth,
                      height: ref.offsetHeight,
                      ...pos,
                    }
                  : n
              )
            )
          }
          className="rounded-xl shadow-md p-3 bg-[#FFF6AA]/80 backdrop-blur-md border border-yellow-200"
        >
          <textarea
            className="w-full h-full bg-transparent resize-none outline-none text-gray-700 text-sm font-medium"
            value={note.text}
            onChange={(e) =>
              setStickyNotes((prev) =>
                prev.map((n) =>
                  n.id === note.id ? { ...n, text: e.target.value } : n
                )
              )
            }
          />
        </Rnd>
      ))}

      {/* Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md flex items-center gap-3 p-3 rounded-full shadow-lg z-20">
        <button
          onClick={addFrame}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Add Frame"
        >
          <FontAwesomeIcon icon={faSquare} />
        </button>
        <button
          onClick={addStickyNote}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Add Sticky Note"
        >
          <FontAwesomeIcon icon={faStickyNote} />
        </button>
        <button
          onClick={() => setTool("pen")}
          className={`p-2 rounded-full ${
            tool === "pen" ? "bg-blue-200" : "hover:bg-gray-100"
          }`}
          title="Draw"
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`p-2 rounded-full ${
            tool === "eraser" ? "bg-blue-200" : "hover:bg-gray-100"
          }`}
          title="Erase"
        >
          <FontAwesomeIcon icon={faEraser} />
        </button>
        <select
          value={penType}
          onChange={(e) => setPenType(e.target.value)}
          className="text-sm border rounded px-2 py-1 bg-transparent"
        >
          <option value="pencil">Pencil</option>
          <option value="marker">Marker</option>
          <option value="highlighter">Highlighter</option>
        </select>
        <input
          type="color"
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
          title="Color"
        />
        <select
          value={eraserSize}
          onChange={(e) => setEraserSize(Number(e.target.value))}
          className="text-sm border rounded px-2 py-1 bg-transparent"
        >
          <option value={10}>Small</option>
          <option value={20}>Medium</option>
          <option value={30}>Large</option>
        </select>
        <button
          onClick={() => setShowGrid((s) => !s)}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Toggle Grid"
        >
          <FontAwesomeIcon icon={faBorderAll} />
        </button>
      </div>

      {/* Custom Cursor */}
      <FontAwesomeIcon
        icon={faLocationArrow}
        className="absolute text-[#1a1a1a] opacity-80 pointer-events-none -rotate-90"
        style={{
          left: cursorPos.x - 8,
          top: cursorPos.y - 8,
          fontSize: "16px",
        }}
      />
    </div>
  );
};

export default CollaborationBoard;
