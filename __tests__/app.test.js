import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

async function saveSpecies() {
    const testSpecies = [{ speciesName: 'velociraptor' }];
    return Promise.all(
        testSpecies.map(async (species) => {
            return request(app).post('/api/species').send(species);
        })
    );
}

describe('demo routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('should add a new species to the species table', async () => {
        const res = await saveSpecies();
        expect(res[0].body).toEqual({
            id: '1',
            speciesName: 'velociraptor',
        });
    });

    afterAll(() => {
        pool.end();
    });
});
