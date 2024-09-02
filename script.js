// JavaScript ที่เกี่ยวข้อง

function toggleList(header) {
    const ul = header.nextElementSibling;
    ul.classList.toggle('active');
    header.classList.toggle('completed', ul.querySelectorAll('input[type="checkbox"]:checked').length === ul.querySelectorAll('input[type="checkbox"]').length);
    updatePercentage(header.parentElement.id);
}

function updatePercentage(sectionId) {
    const ul = document.getElementById(sectionId);
    const totalItems = ul.querySelectorAll('li').length;
    const checkedItems = ul.querySelectorAll('input[type="checkbox"]:checked').length;
    const percentage = (totalItems > 0) ? (checkedItems / totalItems) * 100 : 0;
    const percentageSpan = ul.previousElementSibling.querySelector('.percentage');
    percentageSpan.textContent = `${Math.round(percentage)}%`;
    updateOverallPercentage();
    updateHeaderColor(ul.previousElementSibling);
}

function updateOverallPercentage() {
    const sections = document.querySelectorAll('ul');
    let totalItems = 0;
    let checkedItems = 0;
    sections.forEach(section => {
        totalItems += section.querySelectorAll('li').length;
        checkedItems += section.querySelectorAll('input[type="checkbox"]:checked').length;
    });
    const overallPercentage = (totalItems > 0) ? (checkedItems / totalItems) * 100 : 0;
    document.getElementById('overall-percentage').textContent = `เปอร์เซ็นต์รวม: ${Math.round(overallPercentage)}%`;
}

function updateHeaderColor(header) {
    const ul = header.nextElementSibling;
    const totalItems = ul.querySelectorAll('input[type="checkbox"]').length;
    const checkedItems = ul.querySelectorAll('input[type="checkbox"]:checked').length;
    if (totalItems > 0 && checkedItems === totalItems) {
        header.style.backgroundColor = 'lightgreen'; // เปลี่ยนสีพื้นหลังเมื่อครบ
    } else {
        header.style.backgroundColor = ''; // คืนค่ากลับเป็นสีพื้นหลังเดิม
    }
}

function addItem(sectionId, event) {
    event.stopPropagation(); // Prevent triggering the section's toggle function
    const ul = document.getElementById(sectionId);
    const newItemText = prompt("กรุณาใส่รายละเอียดรายการใหม่:");
    if (newItemText) {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" onchange="updatePercentage('${sectionId}')">${newItemText} <button class="remove-btn" onclick="removeItem(this)">ลบ</button>`;
        ul.appendChild(li);
    }
}

function removeItem(button) {
    const li = button.parentElement;
    li.parentElement.removeChild(li);
    updatePercentage(li.parentElement.id);
}

// script.js

// ฟังก์ชันสำหรับการบันทึกข้อมูลไปยัง LocalStorage
function saveData() {
    const sections = document.querySelectorAll('ul');
    const data = {};

    sections.forEach(section => {
        const sectionId = section.id;
        data[sectionId] = [];
        const items = section.querySelectorAll('li');
        items.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const text = item.textContent.replace('ลบ', '').trim();
            data[sectionId].push({
                text: text,
                checked: checkbox.checked
            });
        });
    });

    localStorage.setItem('websiteData', JSON.stringify(data));
}

// ฟังก์ชันสำหรับการโหลดข้อมูลจาก LocalStorage
function loadData() {
    const data = JSON.parse(localStorage.getItem('websiteData'));
    if (!data) return;

    for (const sectionId in data) {
        const ul = document.getElementById(sectionId);
        if (ul) {
            ul.innerHTML = ''; // ล้างรายการเก่า
            data[sectionId].forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<input type="checkbox" ${item.checked ? 'checked' : ''} onchange="updatePercentage('${sectionId}')">${item.text} <button class="remove-btn" onclick="removeItem(this)">ลบ</button>`;
                ul.appendChild(li);
            });
            updatePercentage(sectionId);
        }
    }
    updateOverallPercentage();
}

// ปรับปรุงฟังก์ชัน existing เพื่อเรียกใช้ saveData()
function toggleList(header) {
    const ul = header.nextElementSibling;
    ul.classList.toggle('active');
    header.classList.toggle('completed', ul.querySelectorAll('input[type="checkbox"]:checked').length === ul.querySelectorAll('input[type="checkbox"]').length);
    updatePercentage(header.parentElement.id);
    saveData(); // บันทึกข้อมูลเมื่อเปิด/ปิดรายการ
}

function updatePercentage(sectionId) {
    const ul = document.getElementById(sectionId);
    const totalItems = ul.querySelectorAll('li').length;
    const checkedItems = ul.querySelectorAll('input[type="checkbox"]:checked').length;
    const percentage = (totalItems > 0) ? (checkedItems / totalItems) * 100 : 0;
    const percentageSpan = ul.previousElementSibling.querySelector('.percentage');
    percentageSpan.textContent = `${Math.round(percentage)}%`;
    updateOverallPercentage();
    updateHeaderColor(ul.previousElementSibling);
    saveData(); // บันทึกข้อมูลเมื่อเปลี่ยนแปลงสถานะของ checkbox
}

function updateOverallPercentage() {
    const sections = document.querySelectorAll('ul');
    let totalItems = 0;
    let checkedItems = 0;
    sections.forEach(section => {
        totalItems += section.querySelectorAll('li').length;
        checkedItems += section.querySelectorAll('input[type="checkbox"]:checked').length;
    });
    const overallPercentage = (totalItems > 0) ? (checkedItems / totalItems) * 100 : 0;
    document.getElementById('overall-percentage').textContent = `เปอร์เซ็นต์รวม: ${Math.round(overallPercentage)}%`;
    saveData(); // บันทึกข้อมูลเมื่ออัปเดตเปอร์เซ็นต์รวม
}

function updateHeaderColor(header) {
    const ul = header.nextElementSibling;
    const totalItems = ul.querySelectorAll('input[type="checkbox"]').length;
    const checkedItems = ul.querySelectorAll('input[type="checkbox"]:checked').length;
    if (totalItems > 0 && checkedItems === totalItems) {
        header.style.backgroundColor = 'lightgreen'; // เปลี่ยนสีพื้นหลังเมื่อครบ
    } else {
        header.style.backgroundColor = ''; // คืนค่ากลับเป็นสีพื้นหลังเดิม
    }
    saveData(); // บันทึกข้อมูลเมื่อเปลี่ยนแปลงสีหัวข้อ
}

function addItem(sectionId, event) {
    event.stopPropagation(); // Prevent triggering the section's toggle function
    const ul = document.getElementById(sectionId);
    const newItemText = prompt("กรุณาใส่รายละเอียดรายการใหม่:");
    if (newItemText) {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" onchange="updatePercentage('${sectionId}')">${newItemText} <button class="remove-btn" onclick="removeItem(this)">ลบ</button>`;
        ul.appendChild(li);
        updatePercentage(sectionId); // Ensure percentage is updated after adding new item
        saveData(); // บันทึกข้อมูลเมื่อเพิ่มรายการใหม่
    }
}

function removeItem(button) {
    const li = button.parentElement;
    const sectionId = li.parentElement.id;
    li.parentElement.removeChild(li);
    updatePercentage(sectionId);
    saveData(); // บันทึกข้อมูลเมื่อลบรายการ
}

// เรียกใช้ loadData() เมื่อหน้าเว็บโหลดเสร็จ
window.onload = loadData;
