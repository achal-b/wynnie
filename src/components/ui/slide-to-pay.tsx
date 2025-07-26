import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FiChevronsRight } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { formatCurrency } from "@/lib/currency";

interface SlideToPayProps {
  amount: number;
  currencySymbol?: string;
  label?: string;
  onComplete?: () => void;
  disabled?: boolean;
}

const COMPLETION_PERCENT = 0.7;
const HANDLE_SIZE = 56; // px
const TRACK_HEIGHT = 56; // px
const TRACK_WIDTH = 340; // px (can be responsive)

export const SlideToPay: React.FC<SlideToPayProps> = ({
  amount,
  currencySymbol = "₹",
  label = "Slide to Pay",
  onComplete,
  disabled = false,
}) => {
  const [dragX, setDragX] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [trackWidth, setTrackWidth] = useState(TRACK_WIDTH);

  // Responsive track width
  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.offsetWidth);
    }
  }, []);

  // On tap (not drag), do nothing (no bounce)
  const handleTap = () => {
    // No animation on tap
  };

  // Drag logic
  const handleDrag = (_: any, info: { point: { x: number } }) => {
    if (disabled || isComplete) return;
    let newX =
      info.point.x -
      (trackRef.current?.getBoundingClientRect().left ?? 0) -
      HANDLE_SIZE / 2;
    newX = Math.max(0, Math.min(newX, trackWidth - HANDLE_SIZE));
    setDragX(newX);
    if (newX >= (trackWidth - HANDLE_SIZE) * COMPLETION_PERCENT) {
      setIsComplete(true);
      controls.start({ x: trackWidth - HANDLE_SIZE });
      if (onComplete) setTimeout(onComplete, 300);
    }
  };

  // Reset on amount/label change
  useEffect(() => {
    setDragX(0);
    setIsComplete(false);
    controls.set({ x: 0 });
  }, [amount, label, controls]);

  // Icon transition
  const ChevronIcon = <FiChevronsRight className="w-6 h-6 text-green-600" />;
  const CheckIcon = <FaCheck className="w-6 h-6 text-green-600" />;

  // Shimmer effect (static, no animation)
  const shimmer = (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-full z-10"
      style={{
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)",
      }}
    />
  );

  return (
    <div
      ref={trackRef}
      className="relative w-full max-w-[340px] h-[56px] bg-gradient-to-r from-green-500 to-green-700 rounded-full overflow-hidden select-none shadow-md flex items-center"
      onClick={handleTap}
    >
      {/* Shimmer hint (static) */}
      {!isDragging && !isComplete && shimmer}
      {/* Track label */}
      <div className="absolute left-5 md:left-0 w-full h-full flex items-center justify-center z-20 font-semibold text-sm text-white pointer-events-none select-none tracking-wide">
        {label} | ₹{formatCurrency(amount)}
      </div>
      {/* Draggable handle */}
      <motion.div
        drag={disabled || isComplete ? false : "x"}
        dragConstraints={{ left: 0, right: trackWidth - HANDLE_SIZE }}
        dragElastic={0.1}
        className={`absolute left-0 top-0 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center z-30 touch-pan-x ${
          disabled ? "cursor-not-allowed" : "cursor-grab"
        } border-2 ${isComplete ? "border-green-700" : "border-green-500"}`}
        animate={controls}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          // Snap to start if not complete
          if (!isComplete) {
            controls.start({ x: 0 });
            setDragX(0);
          }
        }}
        onDrag={handleDrag}
        tabIndex={0}
        aria-label={label}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isDragging ? 1.1 : 1,
            rotate: isComplete ? 360 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isComplete ? CheckIcon : ChevronIcon}
        </motion.div>
      </motion.div>
      {/* Invisible hit area for comfort */}
      <div
        className="absolute left-0 top-0 z-20 pointer-events-none"
        style={{ width: HANDLE_SIZE + 32, height: TRACK_HEIGHT }}
      />
    </div>
  );
};

export default SlideToPay;
