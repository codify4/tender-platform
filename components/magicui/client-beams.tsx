"use client"

import { AnimatedBeam } from "./animated-beam";
import { useRef } from "react";

export default function ClientBeams() {
    const containerRef = useRef<HTMLDivElement>(null);
    const step1Ref = useRef<HTMLDivElement>(null);
    const step2Ref = useRef<HTMLDivElement>(null);
    const step3Ref = useRef<HTMLDivElement>(null);
    
    return (
      <div ref={containerRef} className="absolute inset-0 pointer-events-none">
        {containerRef.current && step1Ref.current && step2Ref.current && (
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={step1Ref}
            toRef={step2Ref}
            curvature={-20}
            duration={3}
            gradientStopColor="#d42e4e"
            gradientStartColor="#1a3c70"
          />
        )}
        {containerRef.current && step2Ref.current && step3Ref.current && (
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={step2Ref}
            toRef={step3Ref}
            curvature={-20}
            duration={3}
            gradientStopColor="#d42e4e"
            gradientStartColor="#1a3c70"
          />
        )}
        
        {/* References to steps */}
        <div ref={step1Ref} className="absolute top-4 left-[16.6%]" />
        <div ref={step2Ref} className="absolute top-4 left-[50%]" />
        <div ref={step3Ref} className="absolute top-4 left-[83.3%]" />
      </div>
    );
  }