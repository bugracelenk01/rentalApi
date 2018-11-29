const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Movie = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', (req, res, next) => {
  Movie.find()
    .select('title genre numberInStock dailyRentalRate')
    .sort('title')
    .exec()
    .then(result => {
      res.status(200).json({
        movies: result
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', (req, res, next) => {
  Genre.findById(req.body.genreId)
    .exec()
    .then(genre => {
      if (!genre) return res.status(404).json({
        message: 'Selected Genre ID is invalid'
      });
      const movie = new Movie({
        title: req.body.title,
        genre: genre.name,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      });
      return movie.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Movie Added To The Database',
        request: {
          type: 'GET',
          url: `http://localhost:3000/movies/${result._id}`
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:id', (req, res, next) => {
  Movie.remove({ _id: req.params.id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: `Movie Deleted with the Name ${result.name}`
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:id', (req, res, next) => {
  Movie.findById(req.params.id)
    .select('title genre dailyRentalRate numberInStock')
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;