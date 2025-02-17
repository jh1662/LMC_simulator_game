/*AI WAS USED TO GENERATE THIS SPECIFIC CSS FILE!!*/
/*This CSS is only used to make the hi-fi framework and WILL NOT be used in any sprint of the LMC project!!*/
/*Expecially when the author will be using TS instead of diretly JS*/
function addRowIfNeeded(input) {
    const row = input.parentElement.parentElement;
    const table = document.getElementById('ide-table');
    const lastRow = table.rows[table.rows.length - 1];

    if (row === lastRow) {
        const newRow = table.insertRow();
        const rowNumberCell = newRow.insertCell();
        rowNumberCell.textContent = lastRow.rowIndex;

        for (let i = 0; i < 3; i++) {
            const newCell = newRow.insertCell();
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.className = 'input-box';
            newInput.setAttribute('oninput', 'addRowIfNeeded(this)');
            newInput.setAttribute('onkeydown', 'navigateIDE(event)');
            newCell.appendChild(newInput);
        }
    }
}

function generateTable() {
    const table = document.getElementById('generated-table');
    let counter = 0;

    for (let i = 0; i < 10; i++) {
        let row1 = table.insertRow();
        let row2 = table.insertRow();

        for (let j = 0; j < 10; j++) {
            const cell1 = row1.insertCell();
            cell1.innerHTML = `<b>${counter}</b>`; // Add bold tags to the label

            const cell2 = row2.insertCell();
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'readonly-input';
            input.id = `memoryCell${counter}`;
            input.readOnly = true;
            cell2.appendChild(input);

            counter++;
        }
    }
}

function assembleValues() {
    const table = document.getElementById('ide-table');
    let assembledString = '';

    for (let i = 1; i < table.rows.length; i++) { // Start from 1 to skip the header row
        let rowValues = '';
        for (let j = 1; j < table.rows[i].cells.length; j++) { // Start from 1 to skip the row number column
            const input = table.rows[i].cells[j].querySelector('input');
            if (input) {
                rowValues += input.value.split(' ').join(',') + ',';
            }
        }
        assembledString += rowValues.slice(0, -1) + ';'; // Remove last comma and add semicolon
    }
    alert(assembledString.slice(0, -1)); // Remove last semicolon before alerting
}

function toggleDisplay() {
    const displayBox = document.getElementById('display-box');
    if (displayBox.innerHTML === 'Text or Image') {
        displayBox.innerHTML = '<img src="android.png" alt="Image" style="width: 100%; height: 100%;">';
        //^ image sourced from https://www.pixilart.com/art/android-sr2d969d913e7aws3
    } else {
        displayBox.innerHTML = 'Text or Image';
    }
}

function navigateIDE(event) {
    const inputs = Array.from(document.querySelectorAll('#ide-table input'));
    const currentIndex = inputs.indexOf(event.target);

    switch (event.key) {
        case 'Tab':
            event.preventDefault();
            navigateHorizontal(inputs, currentIndex, event.shiftKey ? -1 : 1);
            break;
        case ' ':
            event.preventDefault();
            navigateHorizontal(inputs, currentIndex, event.shiftKey ? -1 : 1);
            break;
        case 'Enter':
            event.preventDefault();
            navigateVertical(inputs, currentIndex, event.shiftKey ? -1 : 1);
            break;
        case 'ArrowRight':
            event.preventDefault();
            navigateHorizontal(inputs, currentIndex, 1);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            navigateHorizontal(inputs, currentIndex, -1);
            break;
        case 'ArrowUp':
            event.preventDefault();
            navigateVertical(inputs, currentIndex, -1);
            break;
        case 'ArrowDown':
            event.preventDefault();
            navigateVertical(inputs, currentIndex, 1);
            break;
    }
}

function navigateHorizontal(inputs, currentIndex, direction) {
    const newIndex = (currentIndex + direction + inputs.length) % inputs.length;
    inputs[newIndex].focus();
}

function navigateVertical(inputs, currentIndex, direction) {
    const currentRowIndex = Math.floor(currentIndex / 3);
    const currentColIndex = currentIndex % 3;
    const newRowIdx = (currentRowIndex + direction + (inputs.length / 3)) % (inputs.length / 3);
    const newIndex = (newRowIdx * 3) + currentColIndex;
    inputs[newIndex].focus();
}

function openManual() {
    window.open('pop-upManual.html', '_blank', 'width=800,height=600');
}

function resetTextBoxes() {
    // Clear all input textboxes in the IDE table
    document.querySelectorAll('#ide-table input').forEach(input => {
        input.value = '';
    });

    // Clear and update all readonly textboxes in the list-section
    document.querySelectorAll('.list-section input').forEach(input => {
        input.value = '0'; // Example value, replace as needed
    });

    // Clear and update all textboxes in the table-section
    document.querySelectorAll('#generated-table input').forEach(input => {
        input.value = '0'; // Example value, replace as needed
    });
}

window.onload = () => {
    generateTable();
    document.querySelectorAll('#ide-table input').forEach(input => {
        input.addEventListener('keydown', navigateIDE);
    });
};
