import Image from "next/image";
import { motion, HTMLMotionProps } from "framer-motion";

interface StickerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  /** Murphy's Law: If the image still has a white background due to heavy JPEG artifacts, 
   * this forcefully removes the white background visually using CSS blending. */
  forceTransparentBlend?: boolean;
}

export default function Sticker({ 
  src, 
  alt, 
  width = 200, 
  height = 200, 
  className = "", 
  imageClassName = "",
  forceTransparentBlend = true,
  ...props 
}: StickerProps) {
  return (
    <motion.div 
      className={`relative inline-block ${className}`}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`
          object-contain drop-shadow-xl select-none pointer-events-none
          ${forceTransparentBlend ? "mix-blend-multiply dark:mix-blend-screen dark:brightness-200 dark:contrast-125 dark:grayscale" : ""}
          ${imageClassName}
        `}
        sizes={`(max-width: 768px) ${width}px, ${width * 1.5}px`}
        quality={85}
      />
    </motion.div>
  );
}
