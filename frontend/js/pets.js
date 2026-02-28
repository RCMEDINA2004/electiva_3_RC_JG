const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : '';

const authHeaders = { 'Authorization': `Bearer ${token}` };

async function openAddModal() {
    document.getElementById('petForm').reset();
    document.getElementById('petId').value = '';
    document.getElementById('modalTitle').textContent = '➕ Nueva Mascota';
    await loadOwners();
    document.getElementById('petModal').style.display = 'block';
}

async function loadOwners() {
    const response = await fetch(`${API_URL}/owners`, { headers: authHeaders });
    const owners = await response.json();
    const select = document.getElementById('ownerId');
    select.innerHTML = '<option value="">Seleccione un dueño...</option>';
    owners.forEach(o => {
        select.innerHTML += `<option value="${o.id}">${o.firstName} ${o.lastName}</option>`;
    });
}

async function fetchPets() {
    try {
        const response = await fetch(`${API_URL}/pets`, { headers: authHeaders });
        const pets = await response.json();
        renderPets(pets);
    } catch (error) {
        console.error('Error fetching pets:', error);
    }
}

function renderPets(pets) {
    const grid = document.getElementById('petGrid');

    if (pets.length === 0) {
        grid.innerHTML = `
            <div class="empty-message" style="grid-column: 1/-1;">
                <div class="empty-icon">🐕</div>
                <p>No hay mascotas registradas.</p>
            </div>`;
        return;
    }

    grid.innerHTML = pets.map(pet => {
        const photoSrc = pet.photoUrl ? `${API_BASE}${pet.photoUrl}` : 'https://via.placeholder.com/100?text=🐾';
        const ownerName = pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : 'Sin dueño';
        return `
            <div class="card">
                <img src="${photoSrc}" alt="${pet.name}">
                <h3>${pet.name}</h3>
                <p>🐾 ${pet.species} ${pet.breed ? '- ' + pet.breed : ''}</p>
                <p>📅 ${pet.age ? pet.age + ' años' : 'Edad no registrada'}</p>
                <p>👤 ${ownerName}</p>
                <div class="card-actions">
                    <button class="primary sm" onclick="editPet(${pet.id})">✏️</button>
                    <button class="danger sm" onclick="deletePet(${pet.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('petForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('petId').value;
    const formData = new FormData();
    formData.append('name', document.getElementById('petName').value);
    formData.append('species', document.getElementById('species').value);
    formData.append('breed', document.getElementById('breed').value);
    formData.append('age', document.getElementById('age').value);
    formData.append('ownerId', document.getElementById('ownerId').value);

    const photo = document.getElementById('petPhoto').files[0];
    if (photo) formData.append('photo', photo);

    const url = id ? `${API_URL}/pets/${id}` : `${API_URL}/pets`;
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (response.ok) {
            document.getElementById('petModal').style.display = 'none';
            fetchPets();
        } else {
            const err = await response.json();
            alert('Error: ' + err.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

async function editPet(id) {
    try {
        const response = await fetch(`${API_URL}/pets/${id}`, { headers: authHeaders });
        const pet = await response.json();
        await loadOwners();
        document.getElementById('petId').value = pet.id;
        document.getElementById('petName').value = pet.name;
        document.getElementById('species').value = pet.species;
        document.getElementById('breed').value = pet.breed || '';
        document.getElementById('age').value = pet.age || '';
        document.getElementById('ownerId').value = pet.ownerId;
        document.getElementById('modalTitle').textContent = '✏️ Editar Mascota';
        document.getElementById('petModal').style.display = 'block';
    } catch (error) {
        alert('Error al cargar mascota');
    }
}

async function deletePet(id) {
    if (!confirm('¿Está seguro de eliminar esta mascota?')) return;
    try {
        await fetch(`${API_URL}/pets/${id}`, { method: 'DELETE', headers: authHeaders });
        fetchPets();
    } catch (error) {
        alert('Error al eliminar');
    }
}

fetchPets();
