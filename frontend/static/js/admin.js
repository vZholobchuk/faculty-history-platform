
const API_URL = '/api';
let token = localStorage.getItem('access_token');

// --- AUTHENTICATION ---

function checkAuth() {
    if (!token) {
        let loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    } else {
        loadEvents(); // Load default tab
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            token = data.access_token;
            localStorage.setItem('access_token', token);
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            loadEvents();
        } else {
            document.getElementById('loginError').classList.remove('d-none');
        }
    } catch (err) {
        console.error(err);
    }
});

function logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/';
}

// --- NAVIGATION ---

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(el => el.classList.add('d-none'));
    // Show selected
    document.getElementById(`section-${sectionId}`).classList.remove('d-none');

    // Update active button
    document.querySelectorAll('.list-group-item').forEach(el => el.classList.remove('active'));
    event.target.closest('.list-group-item').classList.add('active');

    if (sectionId === 'events') loadEvents();
    if (sectionId === 'persons') loadPersons();
    if (sectionId === 'photo-gallery') loadPhotoAlbums();
    if (sectionId === 'video-gallery') loadVideoAlbums();
}

// --- EVENTS ---

async function loadEvents() {
    const res = await fetch(`${API_URL}/events`);
    const events = await res.json();
    const tbody = document.getElementById('events-table-body');
    tbody.innerHTML = '';

    events.forEach(event => {
        tbody.innerHTML += `
            <tr>
                <td>${event.year}</td>
                <td>${event.title}</td>
                <td><span class="badge bg-secondary">${event.category}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-warning" onclick="editEvent(${event.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function openEventModal() {
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    new bootstrap.Modal(document.getElementById('eventModal')).show();
}

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
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        loadEvents();
    } else {
        alert('Помилка збереження!');
    }
});

async function deleteEvent(id) {
    if (!confirm('Видалити цю подію?')) return;
    await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadEvents();
}

async function editEvent(id) {
    // Fetch event details
    // In a real app we might fetch specifically /events/id, but for now we can just find it in the list if we stored it,
    // or fetch it. Let's fetch it to be safe and accurate.
    const res = await fetch(`${API_URL}/events/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    // Note: GET /api/events/id wasn't explicitly created in app.py snippet I made?
    // Wait, typical pattern. Let's check app.py.
    // app.py has @app.route('/event/<int:id>') which renders template.
    // It DOES NOT have @app.route('/api/events/<int:id>', methods=['GET']).
    // It has PUT and DELETE.

    // Workaround: We can filter from the full list since pagination isn't huge yet.
    // Or add the route. Adding route is better practice but modifying app.py again might be tedious.
    // Let's rely on loadEvents data if possible? No, scope is local.

    // Let's implement client-side find for now, assuming we reload list often.
    const allEventsRes = await fetch(`${API_URL}/events`); // We just re-fetch all
    const allEvents = await allEventsRes.json();
    const event = allEvents.find(e => e.id === id);

    if (!event) return;

    document.getElementById('eventId').value = event.id;
    document.getElementById('eventYear').value = event.year;
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventCategory').value = event.category;
    document.getElementById('eventShortDesc').value = event.short_description || '';
    document.getElementById('eventFullDesc').value = event.full_description || '';
    document.getElementById('eventMediaUrl').value = event.media_url || '';

    // Gallery is array of URLs in event.gallery
    document.getElementById('eventGalleryUrls').value = (event.gallery || []).join(', ');

    new bootstrap.Modal(document.getElementById('eventModal')).show();
}

// --- PERSONS ---
async function loadPersons() {
    const res = await fetch(`${API_URL}/persons`);
    const persons = await res.json();
    const tbody = document.getElementById('persons-table-body');
    tbody.innerHTML = '';

    persons.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${p.photo_url || '#'}" height="40" width="40" class="rounded-circle object-fit-cover"></td>
                <td>${p.name}</td>
                <td>${p.role}</td>
                <td>
                    <button class="btn btn-sm btn-outline-warning" onclick="editPerson(${p.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePerson(${p.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function openPersonModal() {
    document.getElementById('personForm').reset();
    document.getElementById('personId').value = '';
    new bootstrap.Modal(document.getElementById('personModal')).show();
}

async function editPerson(id) {
    const res = await fetch(`${API_URL}/persons`);
    const persons = await res.json();
    const person = persons.find(p => p.id === id);

    if (!person) return;

    document.getElementById('personId').value = person.id;
    document.getElementById('personName').value = person.name;
    document.getElementById('personRole').value = person.role;
    document.getElementById('personPhotoUrl').value = person.photo_url || '';
    document.getElementById('personShortBio').value = person.short_bio || '';
    document.getElementById('personFullBio').value = person.full_bio || '';
    document.getElementById('personLifeYears').value = person.life_years || '';
    document.getElementById('personSphere').value = person.profession_sphere || '';

    new bootstrap.Modal(document.getElementById('personModal')).show();
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
            'Authorization': `Bearer ${token}`
        },
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
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadPersons();
}


// --- PHOTO ALBUMS ---

async function loadPhotoAlbums() {
    const res = await fetch(`${API_URL}/gallery/albums`);
    const albums = await res.json();
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
            'Authorization': `Bearer ${token}`
        },
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
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadPhotoAlbums();
}


// --- VIDEO ALBUMS ---

async function loadVideoAlbums() {
    const res = await fetch(`${API_URL}/gallery/video_albums`);
    const albums = await res.json();
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
            'Authorization': `Bearer ${token}`
        },
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
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadVideoAlbums();
}


// --- FILE UPLOAD ---

async function uploadFile(input, targetId) {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // Usually auth needed
        body: formData
    });

    if (res.ok) {
        const data = await res.json();
        document.getElementById(targetId).value = data.url; // Fill the text input
    } else {
        alert('Upload failed');
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
            headers: { 'Authorization': `Bearer ${token}` },
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
