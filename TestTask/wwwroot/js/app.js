const API_BASE_URL = '/api/user';

async function loadUsers() 
{
    try 
    {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        updateUserTable(data);
    } 
    catch (error) 
    {
        showError(error.message);
    }
}

function updateUserTable(users) 
{
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.surname}</td>
            <td>${user.email}</td>
            <td>${user.age}</td>
        </tr>
    `).join('');
}

async function addUser() 
{
    const userData = 
        {
        name: document.getElementById('addName').value.trim(),
        surname: document.getElementById('addSurname').value.trim(),
        email: document.getElementById('addEmail').value.trim(),
        age: parseInt(document.getElementById('addAge').value)
    };
    
    if (!userData.name || !userData.surname || !userData.email || !userData.age) 
    {
        return showError('Все поля обязательны для заполнения');
    }

    if (!isValidEmail(userData.email)) 
    {
        return showError("Некорректный формат email");
    }

    try 
    {
        const response = await fetch(API_BASE_URL, 
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) 
        {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка сервера');
        }
        
        clearInputFields();
        await loadUsers();
        showSuccess('Пользователь успешно добавлен');
    } 
    catch (error) 
    {
        showError(`Ошибка добавления: ${error.message}`);
    }
}

async function editUser() 
{
    const idInput = document.getElementById('editId').value;
    const id = parseInt(idInput);
    
    if (!idInput || isNaN(id)) 
    {
        return showError("Введите корректный ID");
    }
    
    const userData = 
        {
        id: id,
        name: document.getElementById('editName').value.trim(),
        surname: document.getElementById('editSurname').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        age: parseInt(document.getElementById('editAge').value)
    };
    
    if (!userData.name || !userData.surname || !userData.email || isNaN(userData.age)) 
    {
        return showError("Все поля обязательны для заполнения");
    }

    if (!isValidEmail(userData.email)) 
    {
        return showError("Некорректный формат email");
    }

    try 
    {
        const response = await fetch(`${API_BASE_URL}/${id}`, 
            {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) 
        {
            const errorText = await response.text();
            const error = errorText ? JSON.parse(errorText) : { error: "Неизвестная ошибка" };
            throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }
        
        document.getElementById('editId').value = '';
        document.getElementById('editName').value = '';
        document.getElementById('editSurname').value = '';
        document.getElementById('editEmail').value = '';
        document.getElementById('editAge').value = '';

        await loadUsers();
        showSuccess("Пользователь успешно обновлен");
    } 
    catch (error) 
    {
        showError(`Ошибка редактирования: ${error.message}`);
    }
}

async function deleteUser() 
{
    const id = document.getElementById("deleteId").value;
    if (!id) return showError("Введите ID пользователя");

    try 
    {
        const response = await fetch(`${API_BASE_URL}/${id}`, 
            {
            method: 'DELETE'
        });

        if (!response.ok) 
        {
            const errorText = await response.text();
            const error = errorText ? JSON.parse(errorText) : { error: "Неизвестная ошибка" };
            throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }
        
        document.getElementById("deleteId").value = '';
        
        await loadUsers();
        showSuccess("Пользователь успешно удалён");
    } 
    catch (error) 
    {
        showError(`Ошибка удаления: ${error.message}`);
    }
}

function clearInputFields() 
{
    document.getElementById('addName').value = '';
    document.getElementById('addSurname').value = '';
    document.getElementById('addEmail').value = '';
    document.getElementById('addAge').value = '';
}

function showError(message) 
{
    alert('Ошибка: ' + message);
}

function showSuccess(message)
{
    alert('Успех: ' + message);
}

function isValidEmail(email) 
{
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}

document.addEventListener('DOMContentLoaded', loadUsers);