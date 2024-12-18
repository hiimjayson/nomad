"use client";

import { cn } from "@/lib/cn";
import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect, ComponentProps } from "react";
import { useInView } from "react-intersection-observer";

const boxVariant = {
  initial: { opacity: 0, translateY: 30 },
  visible: { opacity: 1, translateY: 0, transition: { duration: 0.5 } },
};

interface Props extends ComponentProps<typeof motion.div> {
  /**@default 0.1 */
  threshold?: number;
  /**@default boxVariant */
  animation?: Variants;
}
export function FadeIn({
  className,
  threshold = 0.1,
  animation = boxVariant,
  ...props
}: Props) {
  const control = useAnimation();
  const [ref, inView] = useInView({
    threshold: threshold ? threshold : 0.1,
  });

  useEffect(() => {
    if (inView) {
      control.start("visible");
    }
  }, [control, inView]);

  return (
    <motion.div
      className={cn("relative", className)}
      ref={ref}
      initial="initial"
      variants={animation}
      animate={control}
      {...props}
    />
  );
}
