"use client"

import React from "react";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground rounded-lg shadow-md p-8 border border-border">
      {children}
    </div>
  );
}
