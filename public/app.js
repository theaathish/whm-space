// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const filenameInput = document.getElementById('filename-input');
    const saveNoteBtn = document.getElementById('save-note-btn');
  
    // Fetch and display the list of notes
    const loadNotesList = async () => {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      notesList.innerHTML = ''; // Clear the list
      notes.forEach(note => {
        const li = document.createElement('li');
        li.classList.add('note-list-item', 'list-group-item', 'list-group-item-dark');
        li.textContent = note;
        li.addEventListener('click', () => loadNoteContent(note));
        notesList.appendChild(li);
      });
    };
  
    // Load the content of a selected note
    const loadNoteContent = async (filename) => {
      const response = await fetch(`/api/notes/${filename}`);
      const { content } = await response.json();
      filenameInput.value = filename;
      editor.setValue(content); // Set editor content
    };
  
    // Save the current note
    saveNoteBtn.addEventListener('click', async () => {
      const filename = filenameInput.value.trim();
      const content = editor.getValue();
  
      if (!filename) {
        alert('Please enter a filename');
        return;
      }
  
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content }),
      });
  
      if (response.ok) {
        alert('Note saved successfully');
        loadNotesList(); // Reload notes list
      } else {
        const error = await response.json();
        alert('Error saving note: ' + error.error); // Show server error message
      }
    });
  
    // Load the initial list of notes
    loadNotesList();
  });
  
