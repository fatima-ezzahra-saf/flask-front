import React, { useState } from 'react';
import axios from 'axios';

function Performance({ models }) {
  const { accuracies, modelNames } = models; // Vous recevez un objet avec accuracies et modelNames

  const [inputValues, setInputValues] = useState({
    x1: '', x2: '', x3: '', x4: '', x5: '', x6: '',
    x7: '', x8: '', x9: '', x10: '', x11: '', x12: '',
    x13: '', x14: '', x15: '', x16: ''
  });
  const [predictedY, setPredictedY] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [error, setError] = useState('');

  const handleGenerateAPI = (modelName) => {
    setSelectedModel(modelName);
    setIsFormVisible(true);
    setPredictedY(null);
    setInputValues({
      x1: '', x2: '', x3: '', x4: '', x5: '', x6: '',
      x7: '', x8: '', x9: '', x10: '', x11: '', x12: '',
      x13: '', x14: '', x15: '', x16: ''
    }); // Reset input values when a new model is selected
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handlePrediction = (e) => {
    e.preventDefault();
    if (Object.values(inputValues).some(value => value === '')) {
      setError('Please fill in all X variable values.');
      return;
    }
    setError('');

    axios.post('http://localhost:5000/predict', { modelName: selectedModel, inputValues })
      .then(res => {
        setPredictedY(res.data.predictedY);
      })
      .catch(err => {
        console.error('Error making prediction:', err);
        setError('Failed to make prediction.');
      });
  };

  return (
    <div className="container mt-5">
      <h2>Models Performance</h2>

      {accuracies && accuracies.map((accuracy, index) => (
        <div key={index}>
          <h3>For {modelNames[index]} model</h3>
          <h4>Accuracy: {accuracy * 100}%</h4> {/* Multiplie accuracy par 100 pour obtenir un pourcentage */}
          <button
            className='btn btn-success'
            onClick={() => handleGenerateAPI(modelNames[index])}
          >
            Generate API with this model
          </button>
        </div>
      ))}

      {isFormVisible && (
        <form onSubmit={handlePrediction} className="mt-4">
          <h3>Enter values for X variables:</h3>
          <div className="container">
            <div className="row">
              {Object.keys(inputValues).map((key, index) => (
                <div className="col-md-3" key={index}>
                  <input
                    type="text"
                    name={key}
                    value={inputValues[key]}
                    className="form-control mb-2"
                    onChange={handleInputChange}
                    placeholder={`Enter ${key.toUpperCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">Predict Y</button>
        </form>
      )}

      {predictedY !== null && (
        <div className="mt-4">
          <h4>Predicted Y: {predictedY}</h4>
        </div>
      )}
    </div>
  );
}

export default Performance;