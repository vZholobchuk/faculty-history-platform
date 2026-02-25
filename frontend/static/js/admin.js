
const API_URL = '/api';

let tempFiles = [];

async function checkDatabaseConnection() {
    try {
        const response = await fetch('/api/check_connection', {
            method: 'GET',
            credentials: 'include' // This ensures that cookies (like JWTs) are included in the request
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data.message); // Logs: "Connection to the database is successful!"
        } else {
            console.error(data.error); // Logs the error message if the connection fails
        }
    } catch (error) {
        console.error('Error checking database connection:', error);
    }
}

// Call the function to check the connection
checkDatabaseConnection();

// --- AUTHENTICATION ---

async function checkAuth() {
    const isAccessTokenValid = await checkAccessToken();

    if (!isAccessTokenValid) {
        const refreshSuccess = await refreshToken();

        if (!refreshSuccess) {
            window.location.replace('/login');
        } else {
            loadEvents();
        }

    } else {
        loadEvents();
    }
}

async function checkAccessToken() {
    const accessToken = getCookie('access_token');

    if (!accessToken) {
        return false;
    }

    return true;
}

async function refreshToken() {
    const csrf = getCookie('csrf_refresh_token');

    try {
        const response = await fetch(`${API_URL}/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRF-TOKEN': csrf
            }
        });

        return response.ok;

    } catch (err) {
        console.error('Refresh failed:', err);
        return false;
    }
}

function getCookie(name) {
    const cookies = document.cookie;
    const cookieArr = cookies.split(';');

    for (let i = 0; i < cookieArr.length; i++) {
        const cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// --- Login --- 

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            loadEvents();
        } else {
            document.getElementById('loginError').classList.remove('d-none');
        }
    } catch (err) {
        console.error('Login error:', err);
    }
});

async function logout() {
    await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
    });

    window.location.replace('/login');
}

function renderPagination(page, totalPages, loadFunctionString) {
    if (totalPages <= 1) return '';
    let html = '<nav><ul class="pagination justify-content-center">';
    html += `<li class="page-item ${page === 1 ? 'disabled' : ''}">
        <button class="page-link" onclick="${loadFunctionString}(${page - 1})">&laquo;</button>
    </li>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${page === i ? 'active' : ''}">
            <button class="page-link" onclick="${loadFunctionString}(${i})">${i}</button>
        </li>`;
    }
    html += `<li class="page-item ${page === totalPages ? 'disabled' : ''}">
        <button class="page-link" onclick="${loadFunctionString}(${page + 1})">&raquo;</button>
    </li>`;
    html += '</ul></nav>';
    return html;
}

// --- NAVIGATION ---

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(el => el.classList.add('d-none'));
    document.getElementById(`section-${sectionId}`).classList.remove('d-none');

    document.querySelectorAll('.list-group-item').forEach(el => el.classList.remove('active'));
    event.target.closest('.list-group-item').classList.add('active');

    if (sectionId === 'events') loadEvents();
    if (sectionId === 'persons') loadPersons();
    if (sectionId === 'photo-gallery') loadPhotoAlbums();
    if (sectionId === 'video-gallery') loadVideoAlbums();
    if (sectionId === 'documents') loadDocuments();
}

// --- EVENTS ---

async function loadEvents(page = 1) {
    const res = await fetch(`${API_URL}/events?page=${page}&limit=10`, {
        method: 'GET',
        credentials: 'include'
    });

    const data = await res.json();

    const events = data.events;
    const categories = data.categories;
    const tbody = document.getElementById('events-table-body');
    tbody.innerHTML = '';

    const rows = events.map(e => {
        const userCategory = categories[e.category] ? categories[e.category].label : e.category;

        return `
            <tr>
            <td>${e.year}</td>
            <td>${e.title}</td>
            <td><span class="badge bg-secondary">${userCategory}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-warning" onclick="editEvent(${e.id})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${e.id})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `}).join('');

    tbody.innerHTML = rows;
    document.getElementById('events-pagination').innerHTML = renderPagination(data.page, data.total_pages, 'loadEvents');
}

function openEventModal() {
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    new bootstrap.Modal(document.getElementById('eventModal')).show();
}

document.getElementById('eventModal')
    .addEventListener('hidden.bs.modal', cleanupTempFiles);

document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('eventId').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/events/${id}` : `${API_URL}/events`;

    const data = {
        year: document.getElementById('eventYear').value,
        title: document.getElementById('eventTitle').value,
        category: document.getElementById('eventCategory').value,
        short_description: document.getElementById('eventShortDesc').value,
        full_description: document.getElementById('eventFullDesc').value,
        media_url: document.getElementById('eventMediaUrl').value,
        gallery: document.getElementById('eventGalleryUrls').value.split(',').map(s => s.trim()).filter(s => s)
    };

    const res = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        loadEvents();
    } else {
        alert('Помилка збереження!');
    }
});

async function cleanupTempFiles() {
    for (let url of tempFiles) {
        await fetch(`${API_URL}/cleanup-temp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ url })
        });
    }
    tempFiles = [];
}

async function deleteEvent(id) {
    if (!confirm('Видалити цю подію?')) return;
    await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    loadEvents();
}

async function editEvent(id) {
    try {
        const res = await fetch(`${API_URL}/events/${id}`, {
            credentials: 'include'
        });

        if (!res.ok) {
            alert('Не вдалося отримати подію');
            return;
        }

        const event = await res.json();

        document.getElementById('eventId').value = event.id;
        document.getElementById('eventYear').value = event.year;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventShortDesc').value = event.short_description || '';
        document.getElementById('eventFullDesc').value = event.full_description || '';
        document.getElementById('eventMediaUrl').value = event.media_url || '';
        document.getElementById('eventGalleryUrls').value = (event.gallery || []).join(', ');

        new bootstrap.Modal(document.getElementById('eventModal')).show();
    } catch (err) {
        console.error(err);
        alert('Помилка завантаження');
    }
}

// --- PERSONS ---

async function loadPersons(page = 1) {
    const res = await fetch(`${API_URL}/persons?page=${page}&limit=10`, {
        credentials: 'include'
    });

    if (!res.ok) return;

    const data = await res.json();
    const persons = data.persons;
    const tbody = document.getElementById('persons-table-body');
    tbody.innerHTML = '';

    const rows = persons.map(p => `
        <tr>
            <td>
                <img src="${p.photo_url || '/static/img/default-avatar.png'}"
                     height="40"
                     width="40"
                     class="rounded-circle object-fit-cover">
            </td>
            <td>${p.name}</td>
            <td>${p.role}</td>
            <td>
                <button class="btn btn-sm btn-outline-warning" onclick="editPerson(${p.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletePerson(${p.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tbody.innerHTML = rows;
    document.getElementById('persons-pagination').innerHTML = renderPagination(data.page, data.total_pages, 'loadPersons');
}

function openPersonModal() {
    document.getElementById('personForm').reset();
    document.getElementById('personId').value = '';
    new bootstrap.Modal(document.getElementById('personModal')).show();
}

async function editPerson(id) {
    try {
        const res = await fetch(`${API_URL}/persons/${id}`, {
            credentials: 'include'
        });

        if (!res.ok) {
            alert('Не вдалося отримати персону');
            return;
        }

        const person = await res.json();

        document.getElementById('personId').value = person.id;
        document.getElementById('personName').value = person.name;
        document.getElementById('personRole').value = person.role;
        document.getElementById('personPhotoUrl').value = person.photo_url || '';
        document.getElementById('personShortBio').value = person.short_bio || '';
        document.getElementById('personFullBio').value = person.full_bio || '';
        document.getElementById('personLifeYears').value = person.life_years || '';
        document.getElementById('personSphere').value = person.profession_sphere || '';

        new bootstrap.Modal(document.getElementById('personModal')).show();
    } catch (err) {
        console.error(err);
        alert('Помилка завантаження');
    }
}

document.getElementById('personForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('personId').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/persons/${id}` : `${API_URL}/persons`;

    const data = {
        name: document.getElementById('personName').value,
        role: document.getElementById('personRole').value,
        photo_url: document.getElementById('personPhotoUrl').value,
        short_bio: document.getElementById('personShortBio').value,
        full_bio: document.getElementById('personFullBio').value,
        life_years: document.getElementById('personLifeYears').value,
        profession_sphere: document.getElementById('personSphere').value,
    };

    const res = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('personModal')).hide();
        loadPersons();
    } else {
        alert('Помилка збереження!');
    }
});

async function deletePerson(id) {
    if (!confirm('Видалити?')) return;
    await fetch(`${API_URL}/persons/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    loadPersons();
}


// --- PHOTO ALBUMS ---

async function loadPhotoAlbums(page = 1) {
    const res = await fetch(`${API_URL}/gallery/albums?page=${page}&limit=9`);
    const data = await res.json();
    const albums = data.albums;
    const container = document.getElementById('photo-albums-container');
    container.innerHTML = '';

    albums.forEach(a => {
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${a.cover_url}" class="card-img-top" style="height: 150px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${a.title}</h5>
                        <p class="card-text small text-muted">${a.description || ''}</p>
                        <button class="btn btn-sm btn-danger w-100" onclick="deletePhotoAlbum(${a.id})">Видалити</button>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById('photo-albums-pagination').innerHTML = renderPagination(data.page, data.total_pages, 'loadPhotoAlbums');
}

function openPhotoAlbumModal() {
    document.getElementById('photoAlbumForm').reset();
    new bootstrap.Modal(document.getElementById('photoAlbumModal')).show();
}

document.getElementById('photoAlbumForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('albumTitle').value,
        description: document.getElementById('albumDesc').value,
        cover_url: document.getElementById('albumCoverUrl').value,
        photos: document.getElementById('albumPhotosUrls').value.split(',').filter(x => x)
    };

    const res = await fetch(`${API_URL}/gallery/albums`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('photoAlbumModal')).hide();
        loadPhotoAlbums();
    }
});

async function deletePhotoAlbum(id) {
    if (!confirm('Видалити альбом?')) return;
    await fetch(`${API_URL}/gallery/albums/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    loadPhotoAlbums();
}


// --- VIDEO ALBUMS ---

async function loadVideoAlbums(page = 1) {
    const res = await fetch(`${API_URL}/gallery/video_albums?page=${page}&limit=9`);
    const data = await res.json();
    const albums = data.video_albums;
    const container = document.getElementById('video-albums-container');
    container.innerHTML = '';

    albums.forEach(a => {
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${a.cover_url}" class="card-img-top" style="height: 150px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${a.title}</h5>
                        <p class="card-text small text-muted">${a.description || ''}</p>
                        <button class="btn btn-sm btn-danger w-100" onclick="deleteVideoAlbum(${a.id})">Видалити</button>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById('video-albums-pagination').innerHTML = renderPagination(data.page, data.total_pages, 'loadVideoAlbums');
}

function openVideoAlbumModal() {
    document.getElementById('videoAlbumForm').reset();
    new bootstrap.Modal(document.getElementById('videoAlbumModal')).show();
}

document.getElementById('videoAlbumForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('videoAlbumTitle').value,
        description: document.getElementById('videoAlbumDesc').value,
        cover_url: document.getElementById('videoAlbumCoverUrl').value,
        videos: [] // Logic to parse video inputs would ideally go here, simplifying for now
    };

    // Quick hack for videos input: Assume user enters comma separated URLs for now in a simple input
    const videoUrls = document.getElementById('videoAlbumUrls').value.split(',').filter(x => x);
    data.videos = videoUrls.map(url => ({ url: url, caption: '' }));

    const res = await fetch(`${API_URL}/gallery/video_albums`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('videoAlbumModal')).hide();
        loadVideoAlbums();
    }
});

async function deleteVideoAlbum(id) {
    if (!confirm('Видалити відео-альбом?')) return;
    await fetch(`${API_URL}/gallery/video_albums/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    loadVideoAlbums();
}


// --- DOCUMENTS ---

async function loadDocuments(page = 1) {
    const res = await fetch(`${API_URL}/documents?page=${page}&limit=10`, {
        credentials: 'include'
    });
    if (!res.ok) return;

    const data = await res.json();
    const documents = data.documents;
    const tbody = document.getElementById('documents-table-body');
    tbody.innerHTML = '';

    const rows = documents.map(d => `
        <tr>
            <td>${d.year || ''}</td>
            <td>${d.title}</td>
            <td><span class="badge bg-secondary">${d.category || ''}</span></td>
            <td>${d.file_type || ''}</td>
            <td>
                <button class="btn btn-sm btn-outline-warning" onclick="editDocument(${d.id})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteDocument(${d.id})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
    `).join('');

    tbody.innerHTML = rows;
    document.getElementById('documents-pagination').innerHTML = renderPagination(data.page, data.total_pages, 'loadDocuments');
}

function openDocumentModal() {
    document.getElementById('documentForm').reset();
    document.getElementById('documentId').value = '';
    new bootstrap.Modal(document.getElementById('documentModal')).show();
}

async function editDocument(id) {
    try {
        const res = await fetch(`${API_URL}/documents/${id}`, {
            credentials: 'include'
        });

        if (!res.ok) {
            alert('Не вдалося отримати документ');
            return;
        }

        const doc = await res.json();

        document.getElementById('documentId').value = doc.id;
        document.getElementById('documentTitle').value = doc.title;
        document.getElementById('documentSubtitle').value = doc.subtitle || '';
        document.getElementById('documentYear').value = doc.year || '';
        document.getElementById('documentCategory').value = doc.category || '';
        document.getElementById('documentFileType').value = doc.file_type || 'other';
        document.getElementById('documentFileUrl').value = doc.file_url || '';

        new bootstrap.Modal(document.getElementById('documentModal')).show();
    } catch (err) {
        console.error(err);
        alert('Помилка завантаження');
    }
}

document.getElementById('documentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('documentId').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/documents/${id}` : `${API_URL}/documents`;

    const data = {
        title: document.getElementById('documentTitle').value,
        subtitle: document.getElementById('documentSubtitle').value,
        year: document.getElementById('documentYear').value ? parseInt(document.getElementById('documentYear').value) : null,
        category: document.getElementById('documentCategory').value,
        file_type: document.getElementById('documentFileType').value,
        file_url: document.getElementById('documentFileUrl').value
    };

    const res = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('documentModal')).hide();
        loadDocuments();
    } else {
        alert('Помилка збереження!');
    }
});

async function deleteDocument(id) {
    if (!confirm('Видалити цей документ?')) return;
    await fetch(`${API_URL}/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    loadDocuments();
}


// --- FILE UPLOAD ---

async function uploadFile(input, targetId) {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    if (res.ok) {
        const data = await res.json();
        document.getElementById(targetId).value = data.url;
    } else {
        alert('Upload failed');
    }

    if (data.url.includes('/static/temp/')) {
        tempFiles.push(data.url);
    }
}

// Simple multiple file upload logic
async function uploadMultipleFiles(input, targetId) {
    const files = input.files;
    let urls = [];

    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            urls.push(data.url);
        }
    }

    // Append to existing
    const existing = document.getElementById(targetId).value;
    const sep = existing && existing.length > 0 ? ',' : '';
    document.getElementById(targetId).value = existing + sep + urls.join(',');

    // Preview
    const preview = document.getElementById('albumPhotosPreview');
    // preview.innerHTML = ... (simple preview logic)
}


// Init
checkAuth();
