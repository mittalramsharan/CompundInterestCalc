import React, { useState, useEffect } from "react";

const CompoundInterestCalculator = () => {
  const [values, setValues] = useState({
    A: "",
    P: "",
    r: "",
    n: ""
  });
  const [calculatedField, setCalculatedField] = useState(null);
  const [message, setMessage] = useState("Please enter any three values");
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateMissingValue = (values) => {
    const { A, P, r, n } = values;
    const filledValues = Object.values(values).filter(v => v !== "").length;

    if (filledValues !== 3) return null;

    // Convert string inputs to numbers
    const numA = parseFloat(A);
    const numP = parseFloat(P);
    const numR = parseFloat(r) / 100; // Convert percentage to decimal
    const numN = parseFloat(n);

    try {
      if (!A) return { variable: 'A', value: numP * Math.pow(1 + numR, numN) };
      if (!P) return { variable: 'P', value: numA / Math.pow(1 + numR, numN) };
      if (!r) return { variable: 'r', value: (Math.pow(numA / numP, 1 / numN) - 1) * 100 };
      if (!n) return { variable: 'n', value: Math.log(numA / numP) / Math.log(1 + numR) };
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const filledCount = Object.values(values).filter(v => v !== "").length;
    
    if (filledCount >= 3) {
      const result = calculateMissingValue(values);
      if (result) {
        setCalculatedField(result.variable);
        setValues(prev => ({
          ...prev,
          [result.variable]: result.value.toFixed(2)
        }));
        setIsCalculated(true);
        setMessage("Value calculated! Change any input to recalculate.");
      }
    } else {
      if (isCalculated) {
        // Reset calculated field when a value is cleared
        const emptyField = Object.keys(values).find(key => !values[key]);
        if (emptyField) {
          setCalculatedField(emptyField);
        }
      }
      setIsCalculated(false);
      setMessage(`Please enter ${3 - filledCount} more value${filledCount === 2 ? '' : 's'}`);
    }
  }, [values, isCalculated]);

  const handleChange = (name, value) => {
    if (value !== "" && isNaN(value)) return;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClear = (field) => {
    // Clear the selected field and trigger recalculation
    setValues(prev => {
      const newValues = {
        ...prev,
        [field]: ""
      };
      
      // Find which field should be calculated based on remaining values
      const filledFields = Object.entries(newValues)
        .filter(([_, value]) => value !== "")
        .map(([key]) => key);

      if (filledFields.length === 3) {
        const fieldToCalculate = Object.keys(newValues)
          .find(key => !filledFields.includes(key));
        setCalculatedField(fieldToCalculate);
      }

      return newValues;
    });
  };

  const getFieldLabel = (field) => {
    switch(field) {
      case 'A': return 'Final Amount';
      case 'P': return 'Principal Amount';
      case 'r': return 'Interest Rate (%)';
      case 'n': return 'Time in Years';
      default: return '';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Compound Interest Calculator</h1>
      
      <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-600 text-center font-medium">
        {message}
      </div>

      <div className="space-y-4">
        {Object.keys(values).map(field => (
          <div key={field} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              {getFieldLabel(field)}
              {calculatedField === field && 
                <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  Calculated Result
                </span>
              }
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={`Enter ${getFieldLabel(field)}`}
                className={`w-full p-2 border rounded transition-all duration-300 ${
                  calculatedField === field 
                    ? 'bg-green-100 border-green-500 text-green-700 font-medium ring-4 ring-green-200 shadow-lg scale-105'
                    : isCalculated 
                      ? field === calculatedField
                        ? 'bg-green-50 border-green-300'
                        : 'opacity-75'
                      : ''
                }`}
                value={values[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={calculatedField === field}
                style={calculatedField === field ? { 
                  cursor: 'not-allowed',
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease'
                } : {}}
              />
              {values[field] && calculatedField !== field && (
                <button
                  onClick={() => handleClear(field)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;