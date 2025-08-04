const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

// Test function để xóa nhiều todos
async function testDeleteSelected() {
    try {
        // Đầu tiên tạo một số todos để test
        console.log('Tạo todos để test...');
        const todos = [];
        
        for (let i = 1; i <= 3; i++) {
            const response = await fetch(`${BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: `Test todo ${i}` })
            });
            
            if (response.ok) {
                const todo = await response.json();
                todos.push(todo._id);
                console.log(`Đã tạo todo: ${todo._id}`);
            }
        }
        
        console.log('Todos đã tạo:', todos);
        
        // Test xóa nhiều todos
        console.log('\nTest xóa nhiều todos...');
        const deleteResponse = await fetch(`${BASE_URL}/todos/selected`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: todos })
        });
        
        console.log('Status:', deleteResponse.status);
        const result = await deleteResponse.json();
        console.log('Result:', result);
        
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// Test function để xóa todos đã hoàn thành
async function testDeleteCompleted() {
    try {
        console.log('\nTest xóa todos đã hoàn thành...');
        const response = await fetch(`${BASE_URL}/todos/completed`, {
            method: 'DELETE'
        });
        
        console.log('Status:', response.status);
        const result = await response.json();
        console.log('Result:', result);
        
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// Chạy tests
async function runTests() {
    console.log('Bắt đầu test API...');
    await testDeleteSelected();
    await testDeleteCompleted();
    console.log('Kết thúc test.');
}

runTests(); 