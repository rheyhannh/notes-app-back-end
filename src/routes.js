const { 
    addNotesHandler, 
    getAllNotesHandler,
    getNotesByIdHandler,
    editNotesByIdHandler,
    deleteNotesByIdHandler,
} = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/notes',
        handler: addNotesHandler,
    },
    {
        method: 'GET',
        path: '/notes',
        handler: getAllNotesHandler,
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: getNotesByIdHandler,
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: editNotesByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: deleteNotesByIdHandler,
    }
];

module.exports = routes;
