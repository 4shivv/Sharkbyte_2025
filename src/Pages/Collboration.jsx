import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStickyNote,
  faEraser,
  faPen,
  faSquare,
  faLocationArrow,
  faHand,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { UtilityBar } from "../components/UtilityBar";
import { SideBar } from "../components/SideBar";
import { Settings } from "../components/Settings";



const CanvasFrame = ({ width, height, tool, penColor, eraserSize }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;
    ctxRef.current = ctx;
  }, [width, height, penColor]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e) => {
    if (!["pen", "eraser"].includes(tool)) return;
    const { x, y } = getMousePos(e);
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const { x, y } = getMousePos(e);
    const ctx = ctxRef.current;
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = eraserSize;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 2;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!drawing) return;
    ctxRef.current.closePath();
    setDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      className="absolute inset-0 w-full h-full"
    />
  );
};

const InfiniteWhiteboardWithCursor = () => {


  


  const [frames, setFrames] = useState([]);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [activeTool, setActiveTool] = useState("mouse");
  const [penColor, setPenColor] = useState("#1a1a1a");
  const [penSize, setPenSize] = useState(2);
  const [eraserSize, setEraserSize] = useState(15);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [movingFrameId, setMovingFrameId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // NEW: track which tool popup is open
  const [openToolPopup, setOpenToolPopup] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "c") setIsChatOpen((prev) => !prev);
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);

  useEffect(() => {
    const width = 800;
    const height = 500;

    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const centerX = (14000 - width) / 2;
      const centerY = (14000 - height) / 2;

      setFrames([
        {
          id: Date.now(),
          x: centerX,
          y: centerY,
          width,
          height,
          title: "Board 1",
        },
      ]);

      containerRef.current.scrollLeft =
        centerX - containerWidth / 2 + width / 2;
      containerRef.current.scrollTop =
        centerY - containerHeight / 2 + height / 2;
    }
  }, []);

  const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });

  const addFrame = () => {
    const width = 600;
    const height = 400;

    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const x =
        scrollLeft + containerWidth / 2 - width / 2 + (Math.random() * 100 - 50);
      const y =
        scrollTop + containerHeight / 2 - height / 2 + (Math.random() * 100 - 50);

      const newFrame = {
        id: Date.now(),
        x,
        y,
        width,
        height,
        title: `Board ${frames.length + 1}`,
      };
      setFrames((prev) => [...prev, newFrame]);
    }
  };

  const addStickyNote = () => {
    if (!containerRef.current) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const scrollTop = containerRef.current.scrollTop;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const x =
      scrollLeft + containerWidth / 2 - 75 + (Math.random() * 100 - 50);
    const y =
      scrollTop + containerHeight / 2 - 60 + (Math.random() * 100 - 50);

    setStickyNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        x,
        y,
        width: 150,
        height: 120,
        text: "New Note",
        parentFrame: null,
      },
    ]);
  };

  const toggleTool = (toolName) =>
    setActiveTool((prev) => (prev === toolName ? "mouse" : toolName));

  // NEW: handle tool click & popup
  const handleToolClick = (toolName) => {
    toggleTool(toolName);
    setOpenToolPopup((prev) => (prev === toolName ? null : toolName));
  };

  const isInsideFrame = (note, frame) =>
    note.x + note.width / 2 > frame.x &&
    note.x + note.width / 2 < frame.x + frame.width &&
    note.y + note.height / 2 > frame.y &&
    note.y + note.height / 2 < frame.y + frame.height;
    

  const handleNoteDragStop = (note, d) => {
    let movedNote = { ...note, x: d.x, y: d.y };

    const insideFrame = frames.find((frame) => isInsideFrame(movedNote, frame));

    if (insideFrame && note.parentFrame !== insideFrame.id) {
      movedNote.parentFrame = insideFrame.id;
      movedNote.x = d.x - insideFrame.x;
      movedNote.y = d.y - insideFrame.y;
    } else if (!insideFrame && note.parentFrame !== null) {
      const oldFrame = frames.find((f) => f.id === note.parentFrame);
      if (oldFrame) {
        movedNote.x = d.x + oldFrame.x;
        movedNote.y = d.y + oldFrame.y;
      }
      movedNote.parentFrame = null;
    }

    setStickyNotes((prev) =>
      prev.map((n) => (n.id === note.id ? movedNote : n))
    );
  };

  
  

  return (
    <>
    <div className="flex flex-col">
      
      
      <UtilityBar/>
    </div>
    
    <div onMouseMove={handleMouseMove}
    className="relative w-screen h-screen overflow-hidden bg-[#100C08]">
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-scroll cursor-none bg-[#F5F5F5] z-0 "
      
    >
      <div className="relative w-[14000px] h-[14000px] ">
        {/* Frames */}
        {frames.map((frame) => (
          <React.Fragment key={frame.id} className="">
            
            <div
              className="flex justify-between items-center w-[calc(100%)] absolute px-2 py-1 font-normal text-sm font-inter" 
              style={{
                left: frame.x,
                top: frame.y - 28,
                width: frame.width,
              }}
            >
              <input type="text" placeholder={frame.title} className="focus:outline-none focus:ring-0" />
              <FontAwesomeIcon icon={faPlus} onClick={addFrame} className="text-gray-400 hover:text-blue-500"/>
            </div>

            <Rnd
            
              bounds="parent"
              size={{ width: frame.width, height: frame.height }}
              position={{ x: frame.x, y: frame.y }}
              disableDragging={movingFrameId !== frame.id}
              onDoubleClick={() => setMovingFrameId(frame.id)}
              onDragStart={() => setMovingFrameId(frame.id)}
              onDragStop={(e, d) => {
                setFrames((prev) =>
                  prev.map((f) =>
                    f.id === frame.id ? { ...f, x: d.x, y: d.y } : f
                  )
                );
                setMovingFrameId(null);
              }}
              onResizeStart={() => setMovingFrameId(frame.id)}
              onResizeStop={(e, dir, ref, delta, pos) => {
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
                );
                setMovingFrameId(null);
              }}
              onMouseLeave={(e) => {
                if (movingFrameId === frame.id && e.buttons === 0) {
                  setMovingFrameId(null);
                }
              }}
              className={`bg-white border z-0 custom-rnd border-gray-300 rounded-lg relative overflow-hidden cursor-none
              ${movingFrameId === frame.id ? "ring ring-blue-500 ring-offset-2 ring-offset-slate-50" : ""}`}
            >
              <CanvasFrame
                width={frame.width}
                height={frame.height}
                tool={activeTool}
                penColor={penColor}
                penSize={penSize}
                eraserSize={eraserSize}
      
              />

              {/* Sticky Notes INSIDE frame */}
              {stickyNotes
                .filter((n) => n.parentFrame === frame.id)
                .map((note) => (
                  <Rnd
                    key={note.id}
                    bounds="parent"
                    size={{ width: note.width, height: note.height }}
                    position={{ x: note.x, y: note.y }}
                    onDragStop={(e, d) => handleNoteDragStop(note, d)}
                    onResizeStop={(e, direction, ref, delta, position) =>
                      setStickyNotes((prev) =>
                        prev.map((n) =>
                          n.id === note.id
                            ? {
                                ...n,
                                width: ref.offsetWidth,
                                height: ref.offsetHeight,
                                ...position,
                              }
                            : n
                        )
                      )
                    }
                    className="absolute flex no-cursor rounded-xl p-2 bg-yellow-100/80 backdrop-blur-md border border-yellow-200"
                  >
                    <div className="flex items-center justify-center">
                 <textarea
                className="w-full h-full bg-transparent resize-none outline-none text-gray-800 font-medium text-sm"
                value={note.text}
                onChange={(e) =>
                  setStickyNotes((prev) =>
                    prev.map((n) =>
                      n.id === note.id ? { ...n, text: e.target.value } : n
                    )
                  )
                }
              />
               <button onClick={addStickyNote} className="fixed right-2 top-1.5 cursor-pointer text-black/50 rounded-full px-0.5 py-0.2 hover:bg-black/5 transition-colors">
                      <FontAwesomeIcon icon={faPlus} />

                    </button>
               </div>
                  </Rnd>
                ))}
            </Rnd>
          </React.Fragment>
        ))}

        {/* Sticky Notes OUTSIDE frames */}
        {stickyNotes
          .filter((n) => n.parentFrame === null)
          .map((note) => (
            <Rnd
              key={note.id}
              bounds="parent"
              size={{ width: note.width, height: note.height }}
              position={{ x: note.x, y: note.y }}
              onDragStop={(e, d) => handleNoteDragStop(note, d)}
              onResizeStop={(e, direction, ref, delta, position) =>
                setStickyNotes((prev) =>
                  prev.map((n) =>
                    n.id === note.id
                      ? {
                          ...n,
                          width: ref.offsetWidth,
                          height: ref.offsetHeight,
                          ...position,
                        }
                      : n
                  )
                )
              }
              className="absolute rounded-xl p-2 bg-yellow-100/80 backdrop-blur-md border border-yellow-200"
            >

               <div className="flex items-center justify-center">
                 <textarea
                className="w-full h-full bg-transparent resize-none outline-none text-gray-800 font-medium text-sm"
                value={note.text}
                onChange={(e) =>
                  setStickyNotes((prev) =>
                    prev.map((n) =>
                      n.id === note.id ? { ...n, text: e.target.value } : n
                    )
                  )
                }
              />
               <button onClick={addStickyNote} className="fixed right-2 top-1.5 cursor-pointer text-black/50 rounded-full px-0.5 py-0.2 hover:bg-black/5 transition-colors">
                      <FontAwesomeIcon icon={faPlus} />

                    </button>
               </div>
             
            </Rnd>
          ))}
      </div>

      {/* Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white backdrop-blur-xl border border-gray-300 flex items-center gap-2 py-1.5 px-2 rounded-2xl shadow-2xl z-50">
        {/* Frames + Notes */}
        <button
          onClick={() => setActiveTool("mouse")}
          className="px-1.5 py-1 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors active:bg-blue-200"
          title="Mouse"
        >
          <FontAwesomeIcon
        icon={faLocationArrow}
        className="pointer-events-none -rotate-90"/>
        </button>
        
        
        <div className="w-[1px] h-6 bg-gray-400 mx-1 rounded-4xl " />

        <button
          onClick={addFrame}
          className="px-1.5 py-1 rounded-xl cursor-pointer hover:bg-gray-200 transition active:bg-blue-200"
          title="Add Frame"
        >
          <FontAwesomeIcon icon={faSquare} />
        </button>
        <button
          onClick={addStickyNote}
          className="px-1.5 py-1 rounded-xl cursor-pointer hover:bg-gray-200 transition active:bg-blue-200"
          title="Add Sticky Note"
        >
          <FontAwesomeIcon icon={faStickyNote} />
        </button>

        <div className="w-[1px] h-6 bg-gray-400 mx-1 rounded-4xl" />

        {/* Pen Tool */}
        <div className="relative cursor-pointer">
          <button
            onClick={() => handleToolClick("pen")}
            className={`px-1.5 py-1 rounded-xl transition cursor-pointer ${
              activeTool === "pen" ? "bg-blue-200" : "hover:bg-gray-200"
            }`}
            title="Pen / Brush"
          >
            <FontAwesomeIcon icon={faPen} />
          </button>

          {(openToolPopup === "pen" || activeTool === "pen") && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 bg-white w-xs sm:w-[505px] p-3 rounded-2xl border border-gray-300 shadow-lg shadow-black/5">
            {/* Preset Colors */}
            <div className="flex gap-2 overflow-x-auto max-w-xs px-1 overscroll-x-none">
              {[
                "#1a1a1a",
                "#e63946",
                "#f1faee",
                "#a8dadc",
                "#457b9d",
                "#ffb703",
                "#fb8500",
                "#8338ec",
                "#3a86ff",
                "#06d6a0",
              ].map((color) => (
                <div
                  key={color}
                  onClick={() => setPenColor(color)}
                  className={`w-6 h-6 flex-shrink-0 rounded-full border-2 cursor-pointer ${
                    penColor === color ? "border-black/50" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Custom Color Picker */}
            <label
              className="relative w-6 h-6 flex-shrink-0 cursor-pointer rounded-full border-2 border-gray-300 hover:scale-110 transition"
              title="Choose custom color"
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: penColor }}
              />
              <input
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>

            {/* Divider */}
            <div className="w-[1px] h-6 bg-gray-300 mx-2" />

            {/* Brush / Eraser Sizes */}
            <div className="flex items-center gap-2">
              {[2, 5, 10, 20].map((size) => (
                <div
                  key={size}
                  onClick={() => setEraserSize(size)}
                  className={`rounded-full flex-shrink-0 bg-gray-500 hover:scale-110 hover:bg-gray-700 transition cursor-pointer ${
                    size === 2
                      ? "w-2 h-2"
                      : size === 5
                      ? "w-3 h-3"
                      : size === 10
                      ? "w-4 h-4"
                      : "w-5 h-5"
                  }`}
                />
              ))}
            </div>
          </div>

          )}
        </div>

        {/* Eraser Tool */}
        <div className="relative">
          <button
            onClick={() => handleToolClick("eraser")}
            className={`px-1.5 py-1 rounded-xl transition cursor-pointer  ${
              activeTool === "eraser" ? "bg-blue-200" : "hover:bg-gray-200"
            }`}
            title="Eraser"
          >
            <FontAwesomeIcon icon={faEraser} className="" />
          </button>

          {(openToolPopup === "eraser" || activeTool === "eraser") && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 bg-white p-2 rounded-xl border border-gray-300 shadow-lg shadow-black/5">
              {[10, 20, 30].map((size) => (
                <div
                  key={size}
                  onClick={() => setEraserSize(size)}
                  className={`bg-gray-500 rounded-full cursor-pointer hover:scale-110 hover:bg-gray-700 transition ${
                    size === 10
                      ? "w-3 h-3"
                      : size === 20
                      ? "w-4 h-4"
                      : "w-5 h-5"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
      </div>

      

    </div>
      
      {/* Custom Cursor */}
      <FontAwesomeIcon
        icon={faLocationArrow}
        className="fixed text-[#1a1a1a] opacity-100 pointer-events-none -rotate-90 z-0"
        style={{
          left: cursorPos.x -8 ,
          top: cursorPos.y -4.5,
          fontSize: "16px",
        }}
      />
    <div
      className={`transition-all duration-300 ${
        isChatOpen ? "w-[300px] md:w-1/5" : "w-0"
      }`}
    >
      <SideBar 
        isOpen={isChatOpen} 
        onMouseMove={handleMouseMove}
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
  </div>
  
    </div>
    </>
  );
};

export default InfiniteWhiteboardWithCursor;
