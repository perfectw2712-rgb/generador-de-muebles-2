
import React from 'react';

export const Logo: React.FC = () => (
    <div className="flex flex-col items-center justify-center">
        <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Spark for welding effect */}
            <path d="M56 15 L60 10 L64 15 L60 20 Z" fill="#FFA500" />
            
            {/* R letter - like a metal beam */}
            <path d="M20 10 V 50 H 30" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 10 H 35 C 45 10, 45 30, 35 30 L 20 30" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 30 L 45 50" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            {/* S letter - stylized metal */}
            <path d="M90 10 C 75 10, 75 30, 85 30 C 95 30, 95 50, 80 50" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="text-center mt-[-10px]">
            <span className="text-xl font-bold tracking-widest text-gray-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                RUISANCHEZ.CL
            </span>
        </div>
    </div>
);
