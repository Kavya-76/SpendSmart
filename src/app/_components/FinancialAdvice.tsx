"use client";

import { useState } from "react";

const FinancialAdvice = () => {
  const [query, setQuery] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/financialAdvice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch advice.");
      }

      const data = await response.json();
      setAdvice(data.advice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your financial question..."
          rows={4}
          cols={50}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Getting Advice..." : "Get Advice"}
        </button>
      </form>
      {advice && (
        <div>
          <h3>Advice:</h3>
          <p>{advice}</p>
        </div>
      )}
    </div>
  );
};

export default FinancialAdvice;
