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

describe('demo routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('should add a new species to the species table', async () => {
        const res = await saveSpecies();
        expect(res[0]).toEqual({
            id: '1',
            speciesName: 'velociraptor',
        });
    });

    it('should get all the species', async () => {
        const res = await saveSpecies();
        expect(res).toEqual(
            {
                id: '1',
                speciesName: 'velociraptor',
            },
            {
                id: '2',
                speciesName: 'cow',
            }
        );
    });

    afterAll(() => {
        pool.end();
    });
});
