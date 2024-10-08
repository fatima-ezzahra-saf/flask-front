import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Performance from './performance';

function Flask() {
  const [file, setFile] = useState(null);
  const [x, setX] = useState({
    x1: '', x2: '', x3: '', x4: '', x5: '', x6: '',
    x7: '', x8: '', x9: '', x10: '', x11: '', x12: '',
    x13: '', x14: '', x15: '', x16: ''
  });
  const [y, setY] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleXChange = (e) => {
    const { name, value } = e.target;
    setX(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !y || Object.values(x).some(value => value === '')) {
      setError('Please fill in all fields and upload a file.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    const explicativeVars = Object.keys(x).filter(key => x[key] !== '').join(',');
    formData.append('explicative_vars', explicativeVars);
    formData.append('target_var', y);

    axios.post('http://localhost:5000/train', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        setResponse(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error!', error);
        setError('An error occurred while training the models.');
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Train Multiple Models</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Upload a file:</label>
          <input type="file" className="form-control" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>Enter your input X's values:</label>
          <div className="container">
            <div className="row">
              {Object.keys(x).map((key, index) => (
                <div className="col-md-3" key={index}>
                  <input
                    type="text"
                    name={key}
                    value={x[key]}
                    className="form-control"
                    onChange={handleXChange}
                    placeholder={`Enter ${key.toUpperCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group mb-3">
          <label>Enter the output (Y) name:</label>
          <input
            type="text"
            value={y}
            className="form-control"
            onChange={(e) => setY(e.target.value)}
            placeholder="Enter Y variable"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">Start Training</button>
      </form>

      {loading && <p className="mt-3">Loading accuracies...</p>}
      {!loading && response && <Performance models={response} />}
    </div>
  );
}

export default Flask;
