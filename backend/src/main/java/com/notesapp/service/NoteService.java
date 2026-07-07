package com.notesapp.service;

import com.notesapp.model.Note;
import com.notesapp.repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NoteService {
    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getNotes(String view, String search, String sort) {
        return noteRepository.findAll().stream()
                .filter(note -> applyViewFilter(note, view))
                .filter(note -> applySearchFilter(note, search))
                .sorted((a, b) -> applySort(a, b, sort))
                .collect(Collectors.toList());
    }

    private boolean applyViewFilter(Note note, String view) {
        boolean trashed = Boolean.TRUE.equals(note.getTrashed());
        boolean archived = Boolean.TRUE.equals(note.getArchived());

        if ("favorites".equalsIgnoreCase(view)) {
            return !trashed && Boolean.TRUE.equals(note.getFavorite());
        }
        if ("archive".equalsIgnoreCase(view)) {
            return archived && !trashed;
        }
        if ("trash".equalsIgnoreCase(view)) {
            return trashed;
        }
        return !trashed && !archived;
    }

    private boolean applySearchFilter(Note note, String search) {
        if (search == null || search.trim().isEmpty()) {
            return true;
        }
        String normalizedSearch = search.toLowerCase();
        return note.getTitle() != null && note.getTitle().toLowerCase().contains(normalizedSearch)
                || note.getContent() != null && note.getContent().toLowerCase().contains(normalizedSearch);
    }

    private int applySort(Note a, Note b, String sort) {
        if ("oldest".equalsIgnoreCase(sort)) {
            return a.getCreatedAt().compareTo(b.getCreatedAt());
        }
        return b.getCreatedAt().compareTo(a.getCreatedAt());
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public Note createNote(Note note) {
        LocalDateTime now = LocalDateTime.now();
        note.setCreatedAt(now);
        note.setUpdatedAt(now);
        note.setPinned(Boolean.TRUE.equals(note.getPinned()));
        note.setFavorite(Boolean.TRUE.equals(note.getFavorite()));
        note.setArchived(false);
        note.setTrashed(false);
        return noteRepository.save(note);
    }

    public Optional<Note> updateNote(Long id, Note noteDetails) {
        return noteRepository.findById(id).map(note -> {
            note.setTitle(noteDetails.getTitle());
            note.setContent(noteDetails.getContent());
            note.setUpdatedAt(LocalDateTime.now());
            return noteRepository.save(note);
        });
    }

    public Optional<Note> updateNoteStatus(Long id, Map<String, Boolean> statuses) {
        return noteRepository.findById(id).map(note -> {
            if (statuses.containsKey("pinned")) {
                note.setPinned(statuses.get("pinned"));
            }
            if (statuses.containsKey("favorite")) {
                note.setFavorite(statuses.get("favorite"));
            }
            if (statuses.containsKey("archived")) {
                note.setArchived(statuses.get("archived"));
            }
            if (statuses.containsKey("trashed")) {
                note.setTrashed(statuses.get("trashed"));
            }
            note.setUpdatedAt(LocalDateTime.now());
            return noteRepository.save(note);
        });
    }

    public boolean deleteNotePermanently(Long id) {
        if (noteRepository.existsById(id)) {
            noteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Map<String, Long> getSummary() {
        List<Note> notes = noteRepository.findAll();
        long total = notes.stream().filter(note -> !Boolean.TRUE.equals(note.getTrashed())).count();
        long pinned = notes.stream().filter(note -> !Boolean.TRUE.equals(note.getTrashed()) && Boolean.TRUE.equals(note.getPinned())).count();
        long favorites = notes.stream().filter(note -> !Boolean.TRUE.equals(note.getTrashed()) && Boolean.TRUE.equals(note.getFavorite())).count();
        long archived = notes.stream().filter(note -> Boolean.TRUE.equals(note.getArchived()) && !Boolean.TRUE.equals(note.getTrashed())).count();
        long trashed = notes.stream().filter(note -> Boolean.TRUE.equals(note.getTrashed())).count();

        Map<String, Long> summary = new HashMap<>();
        summary.put("total", total);
        summary.put("pinned", pinned);
        summary.put("favorites", favorites);
        summary.put("archived", archived);
        summary.put("trashed", trashed);
        return summary;
    }
}
