import React from "react";

export default function AppSafe() {
  return (
    <div className="box">
      <h1>Safe Mode </h1>
      <p>If you can read this, React has mounted correctly.</p>
      <ul>
        <li>Next, we’ll re-enable the Router.</li>
        <li>Then we’ll re-enable AuthContext.</li>
        <li>Finally, we’ll restore your real <code>App.jsx</code>.</li>
      </ul>
    </div>
  );
}
