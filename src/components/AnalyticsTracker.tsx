"use client";

import { useEffect } from "react";
import { logRealVisitor } from "@/app/actions/analytics";

export default function AnalyticsTracker() {
  useEffect(() => {
    // Check if the user has already been tracked as a real visitor this session/forever
    const hasBeenTracked = localStorage.getItem("trisage_visitor_tracked");
    
    if (hasBeenTracked) {
      return; // Already tracked, do nothing
    }

    // Set a timer for 120,000 ms (2 minutes)
    // When deploying, keep this at 120000. 
    // For local testing you could temporarily lower this if needed.
    const TIME_TO_QUALIFY_AS_REAL_VISITOR = 120000; 

    const timer = setTimeout(async () => {
      // User has stayed on the page for 2 minutes! They are a "Real Visitor"
      const sessionId = crypto.randomUUID(); // Generate a random session ID
      
      const result = await logRealVisitor(sessionId);
      
      if (result.success) {
        // Flag local storage so we don't double count them on subsequent page loads
        localStorage.setItem("trisage_visitor_tracked", "true");
        console.log("Analytics: Real visitor tracked successfully!");
      } else {
        console.error("Analytics Error:", result.error);
      }
    }, TIME_TO_QUALIFY_AS_REAL_VISITOR);

    // Cleanup timer if they leave before 2 minutes
    return () => clearTimeout(timer);
  }, []);

  return null; // Silent component, no UI
}
