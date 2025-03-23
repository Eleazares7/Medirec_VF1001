// src/Services/adminService.js

const fetchAdminData = async (email, token) => {
    try {
        const response = await fetch(`http://localhost:5000/admin/getAdmin/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener datos del admin: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export { fetchAdminData };