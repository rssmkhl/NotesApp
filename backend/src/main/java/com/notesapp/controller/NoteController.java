package com.notesapp.controller;

import com.notesapp.model.Note;
import com.notesapp.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public List<Note> getAllNotes(
            @RequestParam(required = false) String view,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "newest") String sort
    ) {
        return noteService.getNotes(view, search, sort);
    }

    @GetMapping("/summary")
    public Map<String, Long> getSummary() {
        return noteService.getSummary();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return noteService.createNote(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        return noteService.updateNote(id, noteDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Note> updateNoteStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> statuses) {
        return noteService.updateNoteStatus(id, statuses)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        var noteOpt = noteService.getNoteById(id);
        if (noteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var note = noteOpt.get();
        if (Boolean.TRUE.equals(note.getTrashed())) {
            noteService.deleteNotePermanently(id);
        } else {
            noteService.updateNoteStatus(id, Map.of("trashed", true));
        }
        return ResponseEntity.noContent().build();
    }
}
