const API_URL = AKfycbwZJLKL6Qdacq2Emeou82O3alC_2TiB7pthhVoatJBYqM14kn_bdA8NGcjEcJOvwxwrIg;
const driverSelect = document.getElementById("driverSelect");
const pinInput = document.getElementById("pin");
const startBtn = document.getElementById("startShift");
const endBtn = document.getElementById("endShift");
const statusDiv = document.getElementById("status");

async function fetchDrivers() {
  const res = await fetch(`${API_URL}?action=getDrivers`);
  const data = await res.json();
  if (data.success) {
    driverSelect.innerHTML = data.data.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
  } else {
    statusDiv.textContent = "Ошибка загрузки водителей";
  }
}

async function startShift() {
  const id = driverSelect.value;
  const pin = pinInput.value;
  if (!id || !pin) return alert("Выберите водителя и введите PIN");

  const auth = await fetch(`${API_URL}?action=auth&id=${id}&pin=${pin}`);
  const authData = await auth.json();
  if (!authData.success) return alert("Неверный PIN");

  const res = await fetch(`${API_URL}?action=start&id=${id}`);
  const json = await res.json();
  if (json.success) {
    statusDiv.textContent = `Смена начата: ${new Date(json.data.startTime).toLocaleTimeString()}`;
  } else {
    statusDiv.textContent = `Ошибка: ${json.error}`;
  }
}

async function endShift() {
  const id = driverSelect.value;
  if (!id) return alert("Выберите водителя");

  const res = await fetch(`${API_URL}?action=end&id=${id}`);
  const json = await res.json();
  if (json.success) {
    statusDiv.textContent = `Смена завершена: ${json.data.hours} ч`;
  } else {
    statusDiv.textContent = `Ошибка: ${json.error}`;
  }
}

startBtn.addEventListener("click", startShift);
endBtn.addEventListener("click", endShift);

fetchDrivers();
