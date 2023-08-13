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
                return doc.data().text;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting note:', error);
            return null;
        }
    }

    async addOrUpdateNote(title, text) {
        const note = { text };

        try {
            await this.notesRef.doc(title).set(note, { merge: true });
            console.log('Note Added/Updated for title:', title);
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
            const noteText = await notesApp.getNoteByTitle(title);
            noteTextarea.value = noteText || '';
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
            await notesApp.addOrUpdateNote(title, text);
            noteEditor.style.display = 'none';
        }
    });

    // Load existing notes
    // You can implement this based on your needs, fetching all notes and displaying them.
}

main();
