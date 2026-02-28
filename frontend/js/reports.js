const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

const authHeaders = { 'Authorization': `Bearer ${token}` };

let allAppointments = [];
let allPets = [];
let allVets = [];

// Load all data using Promise.all
async function init() {
    try {
        const [appointmentsRes, petsRes, vetsRes] = await Promise.all([
            fetch(`${API_URL}/appointments`, { headers: authHeaders }),
            fetch(`${API_URL}/pets`, { headers: authHeaders }),
            fetch(`${API_URL}/veterinarians`, { headers: authHeaders })
        ]);

        [allAppointments, allPets, allVets] = await Promise.all([
            appointmentsRes.json(),
            petsRes.json(),
            vetsRes.json()
        ]);

        renderReport(allAppointments);
        setupFilters();
    } catch (error) {
        console.error('Error loading report data:', error);
    }
}

function setupFilters() {
    const filterType = document.getElementById('filterType');
    filterType.addEventListener('change', () => {
        const type = filterType.value;
        const filterValueGroup = document.getElementById('filterValueGroup');
        const filterValue = document.getElementById('filterValue');

        if (type === 'all') {
            filterValueGroup.style.display = 'none';
        } else {
            filterValueGroup.style.display = 'block';
            filterValue.innerHTML = '';

            if (type === 'veterinarian') {
                allVets.forEach(v => {
                    filterValue.innerHTML += `<option value="${v.id}">${v.firstName} ${v.lastName}</option>`;
                });
            } else if (type === 'pet') {
                allPets.forEach(p => {
                    filterValue.innerHTML += `<option value="${p.id}">${p.name}</option>`;
                });
            } else if (type === 'status') {
                filterValue.innerHTML = `
                    <option value="scheduled">Programada</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                `;
            }
        }
    });
}

function applyFilter() {
    const type = document.getElementById('filterType').value;
    const value = document.getElementById('filterValue').value;

    let filtered = allAppointments;

    if (type === 'veterinarian' && value) {
        filtered = allAppointments.filter(a => a.veterinarianId === parseInt(value));
    } else if (type === 'pet' && value) {
        filtered = allAppointments.filter(a => a.petId === parseInt(value));
    } else if (type === 'status' && value) {
        filtered = allAppointments.filter(a => a.status === value);
    }

    renderReport(filtered);
}

function renderReport(appointments) {
    // Render stats
    const statsContainer = document.getElementById('reportStats');
    const scheduled = appointments.filter(a => a.status === 'scheduled').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
                <h3>${appointments.length}</h3>
                <p>Total Citas</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
                <h3>${scheduled}</h3>
                <p>Programadas</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
                <h3>${completed}</h3>
                <p>Completadas</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">❌</div>
            <div class="stat-info">
                <h3>${cancelled}</h3>
                <p>Canceladas</p>
            </div>
        </div>
    `;

    // Render table
    const container = document.getElementById('reportTableContainer');

    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <div class="empty-icon">📊</div>
                <p>No hay datos para mostrar con los filtros seleccionados.</p>
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
                <th>Especialidad</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            ${appointments.map(a => `
                <tr>
                    <td>${a.id}</td>
                    <td>${a.pet ? a.pet.name : 'N/A'}</td>
                    <td>${a.pet && a.pet.owner ? `${a.pet.owner.firstName} ${a.pet.owner.lastName}` : 'N/A'}</td>
                    <td>${a.veterinarian ? `${a.veterinarian.firstName} ${a.veterinarian.lastName}` : 'N/A'}</td>
                    <td>${a.veterinarian ? a.veterinarian.specialty : 'N/A'}</td>
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td>${a.reason}</td>
                    <td><span class="status ${a.status}">${a.status}</span></td>
                </tr>
            `).join('')}
        </tbody>
    `;
    container.innerHTML = '';
    container.appendChild(table);
}

init();
