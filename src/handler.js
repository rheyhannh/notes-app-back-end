// Package 'nanoid' untuk generate random id
const { nanoid } = require('nanoid');
// Package 'notes' untuk simpan notes
const notes = require('./notes');
// Package 'path' untuk locate dir
const path = require('path');
// Package 'fs' untuk tulis output notes
const fs = require('fs');

const addNotesHandler = (request, h) =>{
    // Title, Tag, Notes dari payload
    const { title, tags, body } = request.payload;

    // Id notes generate random dari nanoid
    const id = nanoid(10);
    // Contoh Date.toISOString = 2022-11-05T02:17:37.071Z
    // Contoh Date.toDateString = Sat Nov 05 2022 
    const createdAt = new Date().toISOString(); // Now
    const updatedAt = createdAt;

    // Buat object notenya
    const newNote = {
        id, title, tags, body, createdAt, updatedAt
    }

    // Push notes baru ke array notes 'notes.js'
    notes.push(newNote);
    // Cetak semua notes
    // console.log(notes); 

    // Apakah ada notes dengan id yang sama
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    // Jika tidak ada notes dengan id yang sama
    if(isSuccess){
        // Tulis notes ke notes.txt
        const jsonNotes = JSON.stringify(notes);
        fs.writeFile(path.resolve(__dirname, 'notes.txt'), jsonNotes, (err) =>{
            if(err){
                throw err;
            }
            console.log(`New Note Writed! Note Id : ${id}`);
        });
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            }
        });
        response.code(201); // 201(created)

        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500); // 500(error)
    return response;
}

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    }
});

const getNotesByIdHandler = (request, h) =>{
    const { id } = request.params;

    const note = notes.filter((x) => x.id === id)[0];

    if(note !== undefined){
        return{
            status: 'success',
            data: {
                note,
            }
        }
    }
}

const editNotesByIdHandler = (request, h) =>{
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1){
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        // Tulis notes (setelah edit notes tertentu) ke notes.txt
        const jsonNotes = JSON.stringify(notes);
        fs.writeFile(path.resolve(__dirname, 'notes.txt'), jsonNotes, (err) =>{
            if(err){
                throw err;
            }
            console.log(`Note Edited! Note Id : ${id}`);
        })
        const response = h.response({
           status: 'success',
           message: 'Catatan berhasil diperbaharui' 
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan'
    })
    response.code(404);
    return response;
}

const deleteNotesByIdHandler = (request, h) =>{
    const { id } = request.params;
    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1){
        notes.splice(index,1);
        // Tulis notes (setelah hapus notes tertentu) ke notes.txt
        const jsonNotes = JSON.stringify(notes);
        fs.writeFile(path.resolve(__dirname, 'notes.txt'), jsonNotes, (err) =>{
            if(err){
                throw err;
            }
            console.log(`Note Deleted! Note Id : ${id}`);
        })
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id catatan tidak ditemukan'
    });
    response.code(404);
    return response;
}

// Export function handler
module.exports = { 
    addNotesHandler, 
    getAllNotesHandler,
    getNotesByIdHandler,
    editNotesByIdHandler,
    deleteNotesByIdHandler,
};