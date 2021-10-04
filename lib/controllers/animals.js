import { Router } from 'express';
import Animal from '../models/Animal.js';

export default Router()
    .post('/', async (req, res, next) => {
        try {
            const animalObj = req.body;
            const animal = await Animal.insert(animalObj);
            res.send(animal);
        } catch (err) {
            next(err);
        }
    })
    .get('/', async (req, res, next) => {
        try {
            const animals = await Animal.getAll();
            res.send(animals);
        } catch (err) {
            next(err);
        }
    })
    .get('/:id', async (req, res, next) => {
        try {
            const id = req.params.id;
            const animal = await Animal.getById(id);
            res.send(animal);
        } catch (err) {
            next(err);
        }
    });
