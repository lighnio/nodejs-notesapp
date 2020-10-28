const express = require("express");
const router = express.Router();

const Note = require('../models/Note');

router.get("/notes/add", (req, res) => {
  res.render("notes/new-note");
});


router.post("/notes/new-note", async (req, res) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title) {
    errors.push({ text: "Please write a title" });
  }

  if (!description) {
    errors.push({ text: "Please write a description" });
  }

  if (errors.length > 0) {
    res.render("notes/new-note", {
        errors,
        title,
        description });
  } else {
    const newNote = new Note({title, description});
    await newNote.save();
    res.redirect('/notes');
  }
});

router.get("/notes", async (req, res) => {
  await Note.find().sort({date: 'desc'})
  .then(documentos => {
    let ctx = {
      notes: documentos.map(documento => {
        return {
          title: documento.title,
          description: documento.description,
          _id: documento._id
        }
      })
    }
    res.render('notes/all-notes', {notes: ctx.notes});
  })
});

router.get('/notes/edit/:id', async (req, res) => {
  await Note.findById(req.params.id)
  .then(documentos => {
    let ctx = {
      title: documentos.title,
      description: documentos.description,
      _id: documentos._id
    }
    res.render('notes/edit-note', {ctx});
  })
  .catch(err => console.error(err));
});

router.put('/notes/edit-note/:id', async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  console.log({title}, "--------", {description});
  res.redirect('/notes');
});

module.exports = router;