import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, {...body, ...props});

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const errors = Array.isArray(err.response.data.message)
        ? err.response.data.message
        : [err.response.data.message];
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {errors.map(err => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
