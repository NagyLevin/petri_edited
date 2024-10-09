// Make the openDialog function accessible outside
let openDialogExternally;

function initDialog() {
    // Create the dialog elements dynamically
    createDialogElements();

    const dialogBox = document.getElementById('dialogBox');
    const dialogOverlay = document.getElementById('dialogOverlay');
    const selectedItemDisplay = document.getElementById('selectedItem');

    // Track the currently pressed button
    let currentPressedButton = null;

    // Function to open the dialog
    function openDialog() {
        dialogBox.style.display = 'block';
        dialogOverlay.style.display = 'block';
    }

    // Expose the openDialog function for external use
    openDialogExternally = openDialog;

    // Function to close the dialog
    function closeDialog() {
        dialogBox.style.display = 'none';
        dialogOverlay.style.display = 'none';
    }

    // Function to handle button press
    function pressButton(button, item) {
        // If another button is already pressed, remove its pressed state
        if (currentPressedButton) {
            currentPressedButton.style.backgroundColor = ''; // Reset the previous button's color
        }

        // Press the new button
        button.style.backgroundColor = 'red'; // Make the pressed button red
        currentPressedButton = button; // Track the currently pressed button

        selectedItemDisplay.textContent = `You selected: ${item}`;
    }

    // Get the item buttons and add event listeners
    const CTRLBtn = document.getElementById('selectCTRL');
    const ALTBtn = document.getElementById('selectALT');
    const MWBtn = document.getElementById('selectMW');
    const DeleteBtn = document.getElementById('selectDelete');

    CTRLBtn.addEventListener('click', () => pressButton(CTRLBtn, 'CTRL'));
    ALTBtn.addEventListener('click', () => pressButton(ALTBtn, 'ALT'));
    MWBtn.addEventListener('click', () => pressButton(MWBtn, 'MouseWheel'));
    DeleteBtn.addEventListener('click', () => pressButton(DeleteBtn, 'Delete'));

    // Add event listener to the overlay to close the dialog when clicking outside
    dialogOverlay.addEventListener('click', closeDialog);
}

// Function to create dialog elements dynamically
function createDialogElements() {
    const body = document.body;

    // Create the dialog background
    const dialogOverlay = document.createElement('div');
    dialogOverlay.id = 'dialogOverlay';
    dialogOverlay.style.display = 'none';
    dialogOverlay.style.position = 'fixed';
    dialogOverlay.style.top = '0';
    dialogOverlay.style.left = '0';
    dialogOverlay.style.width = '100%';
    dialogOverlay.style.height = '100%';
    dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dialogOverlay.style.zIndex = '1000';
    body.appendChild(dialogOverlay);

    // Create the dialog box
    const dialogBox = document.createElement('div');
    dialogBox.id = 'dialogBox';
    dialogBox.style.display = 'none';
    dialogBox.style.position = 'fixed';
    dialogBox.style.top = '50%';
    dialogBox.style.left = '50%';
    dialogBox.style.transform = 'translate(-50%, -50%)';
    dialogBox.style.backgroundColor = 'white';
    dialogBox.style.padding = '20px';
    dialogBox.style.border = '2px solid black';
    dialogBox.style.zIndex = '1001';
    body.appendChild(dialogBox);

    // Add content to the dialog box (buttons for CTRL, ALT, MouseWheel, Delete)
    const CTRLBtn = document.createElement('button');
    CTRLBtn.id = 'selectCTRL';
    CTRLBtn.textContent = 'CTRL';

    const ALTBtn = document.createElement('button');
    ALTBtn.id = 'selectALT';
    ALTBtn.textContent = 'ALT';

    const MWBtn = document.createElement('button');
    MWBtn.id = 'selectMW';
    MWBtn.textContent = 'MouseWheel';

    const DeleteBtn = document.createElement('button');
    DeleteBtn.id = 'selectDelete';
    DeleteBtn.textContent = 'Delete';

    // Append buttons to the dialog box
    dialogBox.appendChild(CTRLBtn);
    dialogBox.appendChild(ALTBtn);
    dialogBox.appendChild(MWBtn);
    dialogBox.appendChild(DeleteBtn);

    // Create paragraph to display the selected item
    const selectedItemDisplay = document.createElement('p');
    selectedItemDisplay.id = 'selectedItem';
    body.appendChild(selectedItemDisplay);
}

// Initialize the dialog functionality after the DOM is loaded
window.addEventListener('load', initDialog);
