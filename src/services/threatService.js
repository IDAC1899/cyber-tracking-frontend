// src/services/threatService.js

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/threats`;

const formatError = (err) => {
  const message = err instanceof Error ? err.message : String(err);
  return new Error(message, { cause: err });
};

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data.threats;
  } catch (err) {
    console.log(err);
    throw formatError(err);
  }
};

const show = async (threatId) => {
  try {
    const res = await fetch(`${BASE_URL}/${threatId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data.threat;
  } catch (err) {
    console.log(err);
    throw formatError(err);
  }
};

const create = async (formData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data.threat;
  } catch (err) {
    console.log(err);
    throw formatError(err);
  }
};

const update = async (threatId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${threatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data.threat;
  } catch (err) {
    console.log(err);
    throw formatError(err);
  }
};

const deleteThreat = async (threatId) => {
  try {
    const res = await fetch(`${BASE_URL}/${threatId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.log(err);
    throw formatError(err);
  }
};

export { index, show, create, update, deleteThreat };