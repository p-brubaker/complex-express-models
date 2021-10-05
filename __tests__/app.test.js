import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

async function saveSpecies() {
    const testSpecies = [
        { speciesName: 'velociraptor', extinct: false },
        { speciesName: 'cow', extinct: false },
    ];
    return Promise.all(
        testSpecies.map(async (species) => {
            const res = await request(app).post('/api/species').send(species);
            return res.body;
        })
    );
}

const testAnimals = [
    { animalName: 'Vinny', speciesId: '1' },
    { animalName: 'Larry', speciesId: '2' },
    { animalName: 'Lucy', speciesId: '1' },
    { animalName: 'Oleg', speciesId: '1' },
    { animalName: 'Bob', speciesId: '2' },
];

async function saveAnimals(arr) {
    return Promise.all(
        arr.map(async (animal) => {
            const res = await request(app).post('/api/animals').send(animal);
            return res.body;
        })
    );
}

describe('demo routes', () => {
    beforeEach(async () => {
        return setup(pool);
    });

    it('should add a new species to the species table', async () => {
        const res = await saveSpecies();
        expect(res[0]).toEqual({
            species_id: '1',
            speciesName: 'velociraptor',
            extinct: false,
        });
    });

    it('should get all the species', async () => {
        const res = await saveSpecies();
        expect(res).toEqual(
            expect.arrayContaining([
                {
                    species_id: '1',
                    speciesName: 'velociraptor',
                    extinct: false,
                },
                {
                    species_id: '2',
                    speciesName: 'cow',
                    extinct: false,
                },
            ])
        );
    });

    it('should add a new Animal', async () => {
        await saveSpecies();
        const res = await saveAnimals(testAnimals.slice(0, 2));
        expect(res).toEqual(
            expect.arrayContaining([
                { animalName: 'Vinny', animal_id: '1', speciesId: '1' },
                { animalName: 'Larry', animal_id: '2', speciesId: '2' },
            ])
        );
    });

    it('should get an animal by id', async () => {
        await saveSpecies();
        await saveAnimals(testAnimals.slice(0, 2));
        const res = await request(app).get('/api/animals/1');
        expect(res.body).toEqual({
            animalName: expect.any(String),
            animal_id: expect.any(String),
            speciesId: expect.any(String),
        });
    });

    it('should get all animals and include their species', async () => {
        await saveSpecies();
        await saveAnimals(testAnimals.slice(0, 2));
        const res = await request(app).get('/api/animals');
        expect(res.body).toEqual(
            expect.arrayContaining([
                {
                    animalName: 'Vinny',
                    animal_id: '1',
                    speciesId: '1',
                    species: 'velociraptor',
                },
                {
                    animalName: 'Larry',
                    animal_id: '2',
                    speciesId: '2',
                    species: 'cow',
                },
            ])
        );
    });

    it('should update an animal', async () => {
        const objToUpdate = {
            animalName: 'Larry',
            speciesId: '1',
        };
        await saveSpecies();
        await saveAnimals(testAnimals.slice(0, 2));
        const res = await request(app)
            .patch('/api/animals/2')
            .send(objToUpdate);
        expect(res.body).toEqual({ ...objToUpdate, animal_id: '2' });
    });

    it('should delete an animal', async () => {
        await saveSpecies();
        await saveAnimals(testAnimals.slice(0, 2));
        await request(app).delete('/api/animals/2');
        const res = await request(app).get('/api/animals');
        expect(res.body.length).toEqual(1);
    });

    it('should get a count of Animals by Species', async () => {
        await saveSpecies();
        await saveAnimals(testAnimals);
        const res = await request(app).get('/api/species/count');
        expect(res.body).toEqual(
            expect.arrayContaining([
                {
                    species_id: expect.any(String),
                    speciesName: 'cow',
                    count: '2',
                },
                {
                    species_id: expect.any(String),
                    speciesName: 'velociraptor',
                    count: '3',
                },
            ])
        );
    });

    it('should set a species to extinct', async () => {
        await saveSpecies();
        const res = await request(app)
            .patch('/api/species/extinct/2')
            .send({ extinct: true });
        expect(res.body).toEqual(
            expect.objectContaining({
                species_id: expect.any(String),
                speciesName: expect.any(String),
                extinct: true,
            })
        );
    });

    it('should get all species that are not extinct', async () => {
        await saveSpecies();
        await request(app)
            .patch('/api/species/extinct/2')
            .send({ extinct: true });
        const res = await request(app).get('/api/species/living');
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ extinct: false }),
            ])
        );
        expect(res.body.length).toEqual(1);
    });

    afterAll(() => {
        pool.end();
    });
});
