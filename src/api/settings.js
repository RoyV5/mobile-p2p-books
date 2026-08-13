import api from '../config/api';

export async function getSettings(token) {
    const response = await api.get('/settings', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}

export async function updateSettings(settings, token) {
    const response = await api.patch(
        '/settings',
        settings,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
}

export async function uploadProfilePicture(token, formData) {
    const response = await api.put(
        '/settings/profile-picture',
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
}