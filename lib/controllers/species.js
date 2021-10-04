import { Router } from 'express';
import Species from '../models/Species.js';

export default Router()
    .post('/', async (req, res, next) => {
        try {
            const speciesObj = req.body;
            const species = await Species.insert(speciesObj);
            res.send(species);
        } catch (err) {
            next(err);
        }
    })
    .get('/', async (req, res, next) => {
        try {
            const species = await Species.getAll();
            res.send(species);
        } catch (err) {
            next(err);
        }
    });
