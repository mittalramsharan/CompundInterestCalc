import React, { useState, useEffect } from "react";

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [timesCompounded, setTimesCompounded] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("lastCompoundResult");
    if (storedResult) {
      setLastResult(parseFloat(storedResult));
    }
  }, []);

  useEffect(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(timesCompounded);
    const t = parseFloat(years);

    if (!isNaN(P) && !isNaN(r) && !isNaN(n) && !isNaN(t)) {
      const A = P * Math.pow(1 + r / n, n * t);
      const roundedA = parseFloat(A.toFixed(2));
      setResult(roundedA);
      localStorage.setItem("lastCompoundResult", roundedA);
      setLastResult(roundedA);
    } else {
      setResult(null);
    }
  }, [years]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Compound Interest Calculator</h1>

      {lastResult && (
        <div className="mb-4 text-sm text-gray-600 text-center">
          Last result: <span className="font-semibold">${lastResult}</span>
        </div>
      )}

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Principal Amount (P)"
          className="w-full p-2 border rounded"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Annual Interest Rate (%)"
          className="w-full p-2 border rounded"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Times Compounded Per Year (n)"
          className="w-full p-2 border rounded"
          value={timesCompounded}
          onChange={(e) => setTimesCompounded(e.target.value)}
        />
        <input
          type="number"
          placeholder="Time in Years (t)"
          className="w-full p-2 border rounded"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />

        {result !== null && (
          <div className="text-center mt-4 text-xl">
            Future Value: <span className="font-bold text-green-600">${result}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;