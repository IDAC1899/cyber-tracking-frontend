const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/investigations`;

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
        return data.investigations;
    } catch (err) {
        console.log(err);
        throw formatError(err);
    }
};

const show = async (investigationId) => {
    try {
        const res = await fetch(`${BASE_URL}/${investigationId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (data.err) throw new Error(data.err);
        return data.investigation;
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
        return data.investigation;
    } catch (err) {
        console.log(err);
        throw formatError(err);
    }
};

const update = async (investigationId, formData) => {
    try {
        const res = await fetch(`${BASE_URL}/${investigationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.err) throw new Error(data.err);
        return data.investigation;
    } catch (err) {
        console.log(err);
        throw formatError(err);
    }
};
