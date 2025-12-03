import React from "react";
export default function Dashboard() {
  const mockStats = { statesVisited: 5, totalCost: 3400 };
  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>States visited: {mockStats.statesVisited}/50</p>
      <p>Total trip cost: ${mockStats.totalCost}</p>
    </div>
  );
}
