document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note-form');
    const notesContainer = document.getElementById('notes-container');
    const searchInput = document.getElementById('search-input');
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

    const loadNotes = () => {
        notesContainer.innerHTML = '';
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.sort((a, b) => b.pinned - a.pinned); // Sort pinned notes to the top
        notes.forEach(note => {
            const noteElement = createNoteElement(note);
            notesContainer.appendChild(noteElement);
        });
    };

    const createNoteElement = (note) => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');

        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <p class="category">Category: ${note.category}</p>
            <p class="tags">Tags: ${note.tags.join(', ')}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteNote(note.id);
        });

        const pinButton = document.createElement('button');
        pinButton.classList.add('pin-button');
        pinButton.textContent = note.pinned ? 'Unpin' : 'Pin';
        pinButton.addEventListener('click', () => {
            togglePin(note.id);
        });

        noteElement.appendChild(deleteButton);
        noteElement.appendChild(pinButton);
        return noteElement;
    };

    const deleteNote = (id) => {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    };

    const togglePin = (id) => {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    };

    const filterNotes = (query) => {
        notesContainer.innerHTML = '';
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase()) ||
            note.category.toLowerCase().includes(query.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        filteredNotes.forEach(note => {
            const noteElement = createNoteElement(note);
            notesContainer.appendChild(noteElement);
        });
    };

    noteForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const category = document.getElementById('note-category').value;
        const tags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim());

        const newNote = {
            id: Date.now(),
            title,
            content,
            category,
            tags,
            pinned: false
        };

        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push(newNote);
        localStorage.setItem('notes', JSON.stringify(notes));
        
        loadNotes();
        noteForm.reset();
    });

    searchInput.addEventListener('input', (event) => {
        filterNotes(event.target.value);
    });

    toggleDarkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    loadNotes();
});

