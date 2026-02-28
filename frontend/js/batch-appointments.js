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
let pets = [];
let vets = [];
let entryCount = 0;

// Load pets and vets on page load using Promise.all
async function init() {
    try {
        const [petsRes, vetsRes] = await Promise.all([
            fetch(`${API_URL}/pets`, { headers: authHeaders }),
            fetch(`${API_URL}/veterinarians`, { headers: authHeaders })
        ]);
        [pets, vets] = await Promise.all([petsRes.json(), vetsRes.json()]);
        addEntry();
        addEntry();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function addEntry() {
    entryCount++;
    const container = document.getElementById('batchEntries');
    const entry = document.createElement('div');
    entry.className = 'batch-entry';
    entry.id = `entry-${entryCount}`;
    entry.innerHTML = `
        <h4>📅 Cita #${entryCount}</h4>
        <button class="danger sm remove-entry" onclick="removeEntry('entry-${entryCount}')">✕</button>
        <div class="batch-row">
            <div class="form-group">
                <label>Mascota</label>
                <select class="batch-petId" required>
                    <option value="">Seleccione...</option>
                    ${pets.map(p => `<option value="${p.id}">${p.name}${p.owner ? ` (${p.owner.firstName})` : ''}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Veterinario</label>
                <select class="batch-vetId" required>
                    <option value="">Seleccione...</option>
                    ${vets.map(v => `<option value="${v.id}">${v.firstName} ${v.lastName}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="batch-row">
            <div class="form-group">
                <label>Fecha</label>
                <input type="date" class="batch-date" required>
            </div>
            <div class="form-group">
                <label>Hora</label>
                <input type="time" class="batch-time" required>
            </div>
        </div>
        <div class="form-group">
            <label>Motivo</label>
            <input type="text" class="batch-reason" placeholder="Motivo de la consulta" required>
        </div>
    `;
    container.appendChild(entry);
}

function removeEntry(id) {
    const entry = document.getElementById(id);
    if (entry) entry.remove();
}

async function submitBatch() {
    const entries = document.querySelectorAll('.batch-entry');
    if (entries.length === 0) {
        alert('Agregue al menos una cita');
        return;
    }

    const appointments = [];
    let valid = true;

    entries.forEach(entry => {
        const petId = entry.querySelector('.batch-petId').value;
        const vetId = entry.querySelector('.batch-vetId').value;
        const date = entry.querySelector('.batch-date').value;
        const time = entry.querySelector('.batch-time').value;
        const reason = entry.querySelector('.batch-reason').value;

        if (!petId || !vetId || !date || !time || !reason) {
            valid = false;
            return;
        }

        appointments.push({
            petId: parseInt(petId),
            veterinarianId: parseInt(vetId),
            date,
            time,
            reason,
            status: 'scheduled'
        });
    });

    if (!valid) {
        alert('Complete todos los campos de cada cita');
        return;
    }

    const resultDiv = document.getElementById('batchResult');
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div> Creando citas con Promise.all...</div>';

    try {
        const startTime = performance.now();

        const response = await fetch(`${API_URL}/appointments/batch`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ appointments })
        });

        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(0);

        if (response.ok) {
            const results = await response.json();
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    ✅ ${results.length} citas creadas exitosamente con Promise.all en ${duration}ms
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mascota ID</th>
                            <th>Veterinario ID</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Motivo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.map(r => `
                            <tr>
                                <td>${r.id}</td>
                                <td>${r.petId}</td>
                                <td>${r.veterinarianId}</td>
                                <td>${r.date}</td>
                                <td>${r.time}</td>
                                <td>${r.reason}</td>
                                <td><span class="status ${r.status}">${r.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            const err = await response.json();
            resultDiv.innerHTML = `<div class="alert alert-error">❌ Error: ${err.message}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-error">❌ Error de conexión</div>`;
    }
}

init();
