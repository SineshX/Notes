// Get elements from the DOM
const accessButton = document.getElementById('access-button');
const noteEditor = document.querySelector('.note-editor');
const saveNoteButton = document.getElementById('save-note');
const existingNote = document.querySelector('.existing-note');
const noteTextarea = document.getElementById('note-textarea');

class NotesApp {
    notesRef = db.collection("notes");

    async addOrUpdateNote(key, text) {
        const note = { text };

        try {
            await this.notesRef.doc(key).set(note, { merge: true });
            console.log('Note Added/Updated for Key: ', key);
        } catch (error) {
            console.error('Error Adding/Updating Note: ', error);
        }
    }

    async getNoteByKey(key) {
        let note;

        try {
            const doc = await this.notesRef.doc(key).get();
            
            if (doc.exists) 
                note = { key: doc.id, ...doc.data() };
            else
                console.log('No note found with key: ', key);
        } 
        catch (error) {
            console.error('Error in getting note: ', error);
        }

        return note;
    }
}

async function main() {
    const notesApp = new NotesApp();

    // Load and display the example note with the key "exampleKey"
    const exampleNote = await notesApp.getNoteByKey("exampleKey");
    if (exampleNote) {
        noteTextarea.value = exampleNote.text;
        existingNote.innerHTML = `<p>${exampleNote.text}</p>`;
        existingNote.style.display = 'block';
    }

    accessButton.addEventListener('click', async () => {
        // ... Existing access button code ...
    });

    saveNoteButton.addEventListener('click', async () => {
        // ... Existing save note button code ...
    });
}

main();


class NotesApp {
    notesRef = db.collection("notes");

    async addOrUpdateNote(key, text) {
        const note = { text };

        try {
            await this.notesRef.doc(key).set(note, { merge: true });
            console.log('Note Added/Updated for Key: ', key);
        } catch (error) {
            console.error('Error Adding/Updating Note: ', error);
        }
    }

    async getNoteByKey(key) {
        let note;

        try {
            const doc = await this.notesRef.doc(key).get();
            
            if (doc.exists) 
                note = { key: doc.id, ...doc.data() };
            else
                console.log('No note found with key: ', key);
        } 
        catch (error) {
            console.error('Error in getting note: ', error);
        }

        return note;
    }
}

async function main() {
    const notesApp = new NotesApp();

    accessButton.addEventListener('click', async () => {
        const key = prompt('Enter access key:');
        if (key) {
            const note = await notesApp.getNoteByKey(key);
            if (note) {
                noteTextarea.value = note.text;
            } else {
                noteTextarea.value = '';
            }
            noteEditor.style.display = 'block';
        }
    });

    saveNoteButton.addEventListener('click', async () => {
        const key = prompt('Enter access key:');
        const text = noteTextarea.value.trim();

        if (key !== '' && text !== '') {
            await notesApp.addOrUpdateNote(key, text);
            noteEditor.style.display = 'none';
        }
    });

    // Example: Load and display a note with the key "exampleKey"
    const exampleNote = await notesApp.getNoteByKey("exampleKey");
    if (exampleNote) {
        noteTextarea.value = exampleNote.text;
        existingNote.innerHTML = `<p>${exampleNote.text}</p>`;
        existingNote.style.display = 'block';
    }
}

main();
