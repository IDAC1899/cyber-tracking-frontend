const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

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
    return data.users;
  } catch (err) {
    console.log(err);
    throw formatError(err);
  }
};

export { index };