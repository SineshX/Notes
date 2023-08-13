// Get elements from the DOM
const accessButton = document.getElementById('access-note');
const noteEditor = document.querySelector('.note-editor');
const saveNoteButton = document.getElementById('save-note');
const existingNote = document.querySelector('.existing-note');
const noteTextarea = document.getElementById('note-textarea');
const titleInput = document.getElementById('title');

class NotesApp {
    constructor() {
        this.notesRef = db.collection("notes");
    }

    async getNoteByTitle(title) {
        try {
            const doc = await this.notesRef.doc(title).get();
            if (doc.exists) {
                return doc.data().encryptedText; // Note: Store encrypted text in the database
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting note:', error);
            return null;
        }
    }

    async addOrUpdateNote(title, encryptedText) { // Update function to store encrypted text
        try {
            await this.notesRef.doc(title).set({ encryptedText }, { merge: true });
            console.log('Note Added/Updated');
        } catch (error) {
            console.error('Error Adding/Updating Note:', error);
        }
    }
}

async function main() {
    const notesApp = new NotesApp();

    const getAndDisplayNote = async () => {
        const title = titleInput.value.trim();
        if (title) {
            const encryptedNote = await notesApp.getNoteByTitle(title);
            if (encryptedNote) {
                const decryptedText = decryptNote(encryptedNote, title);
                if (decryptedText !== null) {
                    noteTextarea.value = decryptedText;
                } else {
                    noteTextarea.value = 'Error decrypting note.';
                }
            } else {
                noteTextarea.value = '';
            }
            noteEditor.style.display = 'block';
        }
    };

    accessButton.addEventListener('click', getAndDisplayNote);

    titleInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            getAndDisplayNote();
        }
    });

    saveNoteButton.addEventListener('click', async () => {
        const title = titleInput.value.trim();
        const text = noteTextarea.value.trim();

        if (title && text) {
            const encryptedText = encryptNote(text, title);
            await notesApp.addOrUpdateNote(title, encryptedText);
            noteEditor.style.display = 'none';
        }
    });

    // Save note on 'Ctrl + S'
    document.addEventListener('keydown', async (event) => {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            const title = titleInput.value.trim();
            const text = noteTextarea.value.trim();

            if (title && text) {
                const encryptedText = encryptNote(text, title);
                await notesApp.addOrUpdateNote(title, encryptedText);
                noteEditor.style.display = 'none';
            }
        }
    });

    // Load existing notes
    // You can implement this based on your needs, fetching all notes and displaying them.
}

// Encrypt function
function encryptNote(text, key) {
    const encrypted = CryptoJS.AES.encrypt(text, key);
    return encrypted.toString();
}

// Decrypt function
function decryptNote(encryptedText, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, key);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    } catch (error) {
        console.error('Error decrypting note:', error);
        return null;
    }
}

main();
