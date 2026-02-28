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
const authHeaders = { 'Authorization': `Bearer ${token}` };

async function loadSelects() {
    const [petsRes, vetsRes] = await Promise.all([
        fetch(`${API_URL}/pets`, { headers: authHeaders }),
        fetch(`${API_URL}/veterinarians`, { headers: authHeaders })
    ]);
    const [pets, vets] = await Promise.all([petsRes.json(), vetsRes.json()]);

    const petSelect = document.getElementById('petId');
    petSelect.innerHTML = '<option value="">Seleccione mascota...</option>';
    pets.forEach(p => {
        const ownerName = p.owner ? ` (${p.owner.firstName} ${p.owner.lastName})` : '';
        petSelect.innerHTML += `<option value="${p.id}">${p.name}${ownerName}</option>`;
    });

    const vetSelect = document.getElementById('veterinarianId');
    vetSelect.innerHTML = '<option value="">Seleccione veterinario...</option>';
    vets.forEach(v => {
        vetSelect.innerHTML += `<option value="${v.id}">${v.firstName} ${v.lastName} - ${v.specialty}</option>`;
    });
}

async function openAddModal() {
    document.getElementById('appointmentForm').reset();
    document.getElementById('appointmentId').value = '';
    document.getElementById('modalTitle').textContent = '➕ Nueva Cita';
    await loadSelects();
    document.getElementById('appointmentModal').style.display = 'block';
}

async function fetchAppointments() {
    try {
        const response = await fetch(`${API_URL}/appointments`, { headers: authHeaders });
        const appointments = await response.json();
        renderAppointments(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

function renderAppointments(appointments) {
    const container = document.getElementById('appointmentTableContainer');

    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <div class="empty-icon">📅</div>
                <p>No hay citas registradas.</p>
            </div>`;
        return;
    }

    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Mascota</th>
                <th>Dueño</th>
                <th>Veterinario</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${appointments.map(a => `
                <tr>
                    <td>${a.id}</td>
                    <td>${a.pet ? a.pet.name : 'N/A'}</td>
                    <td>${a.pet && a.pet.owner ? `${a.pet.owner.firstName} ${a.pet.owner.lastName}` : 'N/A'}</td>
                    <td>${a.veterinarian ? `${a.veterinarian.firstName} ${a.veterinarian.lastName}` : 'N/A'}</td>
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td>${a.reason}</td>
                    <td><span class="status ${a.status}">${a.status}</span></td>
                    <td class="actions">
                        <button class="primary sm" onclick="editAppointment(${a.id})">✏️</button>
                        <button class="danger sm" onclick="deleteAppointment(${a.id})">🗑️</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    container.innerHTML = '';
    container.appendChild(table);
}

document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('appointmentId').value;
    const data = {
        petId: parseInt(document.getElementById('petId').value),
        veterinarianId: parseInt(document.getElementById('veterinarianId').value),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        reason: document.getElementById('reason').value,
        status: document.getElementById('status').value,
    };

    const url = id ? `${API_URL}/appointments/${id}` : `${API_URL}/appointments`;
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, { method, headers, body: JSON.stringify(data) });
        if (response.ok) {
            document.getElementById('appointmentModal').style.display = 'none';
            fetchAppointments();
        } else {
            const err = await response.json();
            alert('Error: ' + err.message);
        }
    } catch (error) {
        alert('Error de conexión');
    }
});

async function editAppointment(id) {
    try {
        const response = await fetch(`${API_URL}/appointments/${id}`, { headers: authHeaders });
        const appt = await response.json();
        await loadSelects();
        document.getElementById('appointmentId').value = appt.id;
        document.getElementById('petId').value = appt.petId;
        document.getElementById('veterinarianId').value = appt.veterinarianId;
        document.getElementById('date').value = appt.date;
        document.getElementById('time').value = appt.time;
        document.getElementById('reason').value = appt.reason;
        document.getElementById('status').value = appt.status;
        document.getElementById('modalTitle').textContent = '✏️ Editar Cita';
        document.getElementById('appointmentModal').style.display = 'block';
    } catch (error) {
        alert('Error al cargar cita');
    }
}

async function deleteAppointment(id) {
    if (!confirm('¿Está seguro de eliminar esta cita?')) return;
    try {
        await fetch(`${API_URL}/appointments/${id}`, { method: 'DELETE', headers });
        fetchAppointments();
    } catch (error) {
        alert('Error al eliminar');
    }
}

fetchAppointments();
