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

function openAddModal() {
    document.getElementById('vetForm').reset();
    document.getElementById('vetId').value = '';
    document.getElementById('modalTitle').textContent = '➕ Nuevo Veterinario';
    document.getElementById('vetModal').style.display = 'block';
}

async function fetchVeterinarians() {
    try {
        const response = await fetch(`${API_URL}/veterinarians`, { headers: { 'Authorization': `Bearer ${token}` } });
        const vets = await response.json();
        renderVets(vets);
    } catch (error) {
        console.error('Error fetching veterinarians:', error);
    }
}

function renderVets(vets) {
    const grid = document.getElementById('vetGrid');

    if (vets.length === 0) {
        grid.innerHTML = `
            <div class="empty-message" style="grid-column: 1/-1;">
                <div class="empty-icon">👨‍⚕️</div>
                <p>No hay veterinarios registrados.</p>
            </div>`;
        return;
    }

    grid.innerHTML = vets.map(vet => `
        <div class="card">
            <h3>👨‍⚕️ ${vet.firstName} ${vet.lastName}</h3>
            <p>🏥 ${vet.specialty}</p>
            <p>📞 ${vet.phone || 'Sin teléfono'}</p>
            <p>📧 ${vet.email || 'Sin email'}</p>
            <div class="card-actions">
                <button class="primary sm" onclick="editVet(${vet.id})">✏️</button>
                <button class="danger sm" onclick="deleteVet(${vet.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

document.getElementById('vetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('vetId').value;
    const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        specialty: document.getElementById('specialty').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
    };

    const url = id ? `${API_URL}/veterinarians/${id}` : `${API_URL}/veterinarians`;
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, { method, headers, body: JSON.stringify(data) });
        if (response.ok) {
            document.getElementById('vetModal').style.display = 'none';
            fetchVeterinarians();
        } else {
            const err = await response.json();
            alert('Error: ' + err.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

async function editVet(id) {
    try {
        const response = await fetch(`${API_URL}/veterinarians/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        const vet = await response.json();
        document.getElementById('vetId').value = vet.id;
        document.getElementById('firstName').value = vet.firstName;
        document.getElementById('lastName').value = vet.lastName;
        document.getElementById('specialty').value = vet.specialty;
        document.getElementById('phone').value = vet.phone || '';
        document.getElementById('email').value = vet.email || '';
        document.getElementById('modalTitle').textContent = '✏️ Editar Veterinario';
        document.getElementById('vetModal').style.display = 'block';
    } catch (error) {
        alert('Error al cargar veterinario');
    }
}

async function deleteVet(id) {
    if (!confirm('¿Está seguro de eliminar este veterinario?')) return;
    try {
        await fetch(`${API_URL}/veterinarians/${id}`, { method: 'DELETE', headers });
        fetchVeterinarians();
    } catch (error) {
        alert('Error al eliminar');
    }
}

fetchVeterinarians();
