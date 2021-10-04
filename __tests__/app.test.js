import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

async function saveSpecies() {
    const testSpecies = [
        { speciesName: 'velociraptor' },
        { speciesName: 'cow' },
    ];
    return Promise.all(
        testSpecies.map(async (species) => {
            const res = await request(app).post('/api/species').send(species);
            return res.body;
        })
    );
}

async function saveAnimals() {
    const testAnimals = [
        { animalName: 'Vinny', speciesId: '1' },
        { animalName: 'Larry', speciesId: '2' },
    ];
    return Promise.all(
        testAnimals.map(async (animal) => {
            const res = await request(app).post('/api/animals').send(animal);
            return res.body;
        })
    );
}

describe('demo routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('should add a new species to the species table', async () => {
        const res = await saveSpecies();
        expect(res[0]).toEqual({
            species_id: '1',
            speciesName: 'velociraptor',
        });
    });

    it('should get all the species', async () => {
        const res = await saveSpecies();
        expect(res).toEqual([
            {
                species_id: '1',
                speciesName: 'velociraptor',
            },
            {
                species_id: '2',
                speciesName: 'cow',
            },
        ]);
    });

    it('should add a new Animal', async () => {
        await saveSpecies();
        const res = await saveAnimals();
        expect(res).toEqual([
            { animalName: 'Vinny', animal_id: '1', speciesId: '1' },
            { animalName: 'Larry', animal_id: '2', speciesId: '2' },
        ]);
    });

    afterAll(() => {
        pool.end();
    });
});
