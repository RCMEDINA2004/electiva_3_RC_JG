const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

function resetForm() {
    document.getElementById('ownerForm').reset();
    document.getElementById('ownerId').value = '';
    document.getElementById('modalTitle').textContent = '➕ Nuevo Dueño';
}

async function fetchOwners() {
    try {
        const response = await fetch(`${API_URL}/owners`, { headers: { 'Authorization': `Bearer ${token}` } });
        const owners = await response.json();
        renderOwners(owners);
    } catch (error) {
        console.error('Error fetching owners:', error);
    }
}

function renderOwners(owners) {
    const container = document.getElementById('ownerTableContainer');

    if (owners.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <div class="empty-icon">👤</div>
                <p>No hay dueños registrados.</p>
            </div>`;
        return;
    }

    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${owners.map(o => `
                <tr>
                    <td>${o.id}</td>
                    <td>${o.firstName}</td>
                    <td>${o.lastName}</td>
                    <td>${o.phone}</td>
                    <td>${o.email || '-'}</td>
                    <td>${o.address || '-'}</td>
                    <td class="actions">
                        <button class="primary sm" onclick="editOwner(${o.id})">✏️</button>
                        <button class="danger sm" onclick="deleteOwner(${o.id})">🗑️</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    container.innerHTML = '';
    container.appendChild(table);
}

document.getElementById('ownerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('ownerId').value;
    const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
    };

    const url = id ? `${API_URL}/owners/${id}` : `${API_URL}/owners`;
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, { method, headers, body: JSON.stringify(data) });
        if (response.ok) {
            document.getElementById('ownerModal').style.display = 'none';
            fetchOwners();
        } else {
            const err = await response.json();
            alert('Error: ' + err.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

async function editOwner(id) {
    try {
        const response = await fetch(`${API_URL}/owners/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const owner = await response.json();
        document.getElementById('ownerId').value = owner.id;
        document.getElementById('firstName').value = owner.firstName;
        document.getElementById('lastName').value = owner.lastName;
        document.getElementById('phone').value = owner.phone;
        document.getElementById('email').value = owner.email || '';
        document.getElementById('address').value = owner.address || '';
        document.getElementById('modalTitle').textContent = '✏️ Editar Dueño';
        document.getElementById('ownerModal').style.display = 'block';
    } catch (error) {
        alert('Error al cargar dueño');
    }
}

async function deleteOwner(id) {
    if (!confirm('¿Está seguro de eliminar este dueño?')) return;
    try {
        await fetch(`${API_URL}/owners/${id}`, { method: 'DELETE', headers });
        fetchOwners();
    } catch (error) {
        alert('Error al eliminar');
    }
}

fetchOwners();
