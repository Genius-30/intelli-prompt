"use client";

import { Card } from "@/components/ui/card";
import React from "react";

const generateStreakData = () => {
  const totalDays = 20;
  const currentStreak = 12;
  const data = Array.from({ length: totalDays }, (_, i) => ({
    active: i >= totalDays - currentStreak,
  }));
  return data;
};

export default function StreakGraph() {
  const streakData = generateStreakData();
  const angleStep = 360 / streakData.length;

  return (
    <div className="relative w-full flex justify-center items-center py-10">
      <div className="relative w-[300px] h-[300px]">
        {streakData.map((day, index) => {
          const angle = angleStep * index;
          const radius = 120;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={index}
              className={`absolute w-10 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-300 
                ${
                  day.active
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-zinc-700 text-zinc-400"
                }`}
              style={{
                top: `calc(50% + ${y}px - 12px)`,
                left: `calc(50% + ${x}px - 20px)`,
                transform: `rotate(${angle}deg)`,
              }}
            >
              {day.active ? "✔️" : "-"}
            </div>
          );
        })}

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-4xl font-bold">12</h1>
          <p className="text-sm text-zinc-400">Current Streak</p>
          <p className="text-xs text-zinc-500 mt-1">🔥 Longest: 25 days</p>
        </div>
      </div>
    </div>
  );
}
