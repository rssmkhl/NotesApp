package com.notesapp.service;

import com.notesapp.model.Note;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NoteService {
    private List<Note> notes = new ArrayList<>();
    private Long nextId = 1L;

    public List<Note> getAllNotes() {
        return new ArrayList<>(notes);
    }

    public Optional<Note> getNoteById(Long id) {
        return notes.stream().filter(note -> note.getId().equals(id)).findFirst();
    }

    public Note createNote(Note note) {
        note.setId(nextId++);
        note.setCreatedAt(LocalDateTime.now());
        notes.add(note);
        return note;
    }

    public Optional<Note> updateNote(Long id, Note noteDetails) {
        return getNoteById(id).map(note -> {
            note.setTitle(noteDetails.getTitle());
            note.setContent(noteDetails.getContent());
            return note;
        });
    }

    public boolean deleteNote(Long id) {
        return notes.removeIf(note -> note.getId().equals(id));
    }

    public List<Note> searchNotes(String title) {
        if (title == null || title.trim().isEmpty()) {
            return getAllNotes();
        }
        return notes.stream()
                .filter(note -> note.getTitle().toLowerCase().contains(title.toLowerCase()))
                .collect(Collectors.toList());
    }
}
