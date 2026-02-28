const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

const headers = { 'Authorization': `Bearer ${token}` };

// Use Promise.all to fetch all stats concurrently
async function loadDashboard() {
    try {
        const [ownersRes, petsRes, vetsRes, appointmentsRes] = await Promise.all([
            fetch(`${API_URL}/owners`, { headers }),
            fetch(`${API_URL}/pets`, { headers }),
            fetch(`${API_URL}/veterinarians`, { headers }),
            fetch(`${API_URL}/appointments`, { headers })
        ]);

        const [owners, pets, vets, appointments] = await Promise.all([
            ownersRes.json(),
            petsRes.json(),
            vetsRes.json(),
            appointmentsRes.json()
        ]);

        document.getElementById('ownerCount').textContent = owners.length;
        document.getElementById('petCount').textContent = pets.length;
        document.getElementById('vetCount').textContent = vets.length;
        document.getElementById('appointmentCount').textContent = appointments.length;

        renderRecentAppointments(appointments);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function renderRecentAppointments(appointments) {
    const container = document.getElementById('recentAppointments');

    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <div class="empty-icon">📅</div>
                <p>No hay citas registradas aún.</p>
            </div>`;
        return;
    }

    const recent = appointments.slice(-10).reverse();
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Mascota</th>
                <th>Veterinario</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            ${recent.map(a => `
                <tr>
                    <td>${a.id}</td>
                    <td>${a.pet ? a.pet.name : 'N/A'}</td>
                    <td>${a.veterinarian ? `${a.veterinarian.firstName} ${a.veterinarian.lastName}` : 'N/A'}</td>
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td>${a.reason}</td>
                    <td><span class="status ${a.status}">${a.status}</span></td>
                </tr>
            `).join('')}
        </tbody>
    `;
    container.appendChild(table);
}

loadDashboard();
