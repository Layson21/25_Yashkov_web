const baseUrl = "http://localhost:8080/api/Order";

function formatOrder(order) {
    return `ID: ${order.id}
  Дата: ${new Date(order.date).toLocaleString()}
  Содержимое заказа: ${order.content}
  Попытки: ${order.attempts}`;
}

async function getOrderById() {
  const id = document.getElementById('orderIdInput').value.trim();
  const resultBox = document.getElementById('orderResult');

  if (!id) {
    resultBox.innerText = "Котик тоже молчал, смотря на вас большими глазами...";
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/${id}`);
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    const order = await response.json();
    resultBox.innerText = formatOrder(order);
  } catch (err) {
    resultBox.innerText = "Котик не нашел такого заказа в списке...";
  }
}


async function makeOrder() {
  const content = document.getElementById('orderContentInput').value.trim();
  const button = document.getElementById('makeOrderBtn');
  const statusLabel = document.getElementById('orderStatusLabel');
  const resultBox = document.getElementById('makeOrderResult');

  if (!content) {
    statusLabel.innerText = "Введите содержимое заказа!";
    return;
  }

  button.disabled = true;
  statusLabel.innerText = "Обрабатываем ваш заказ...";
  resultBox.innerText = "";

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    const message = await response.text();
    resultBox.innerText = message;
    statusLabel.innerText = "Заказ успешно обработан.";
  } 

  catch (err) {
    resultBox.innerText = "Котик пытался понять вас, но котики не понимают язык людей(";
    statusLabel.innerText = "Произошла ошибка при отправке заказа.";
  } 

  finally {
    button.disabled = false;
  }
}

async function getAllOrders() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    const orders = await response.json();
    document.getElementById('ordersList').innerText =
      orders.map(formatOrder).join('\n\n');
  } 

  catch (err) {
    document.getElementById('ordersList').innerText = "Извините, котик со списком заказов потерял его по пути к вам.";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById('orderContentInput').value = "";
  document.getElementById('orderIdInput').value = "";
  document.getElementById('orderResult').innerText = "";
  document.getElementById('makeOrderResult').innerText = "";
  document.getElementById('ordersList').innerText = "";
  document.getElementById('orderStatusLabel').innerText = "";
});
