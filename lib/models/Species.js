import pool from '../utils/pool.js';

export default class Species {
    constructor(row) {
        this.species_id = row.species_id;
        this.speciesName = row.species_name;
    }

    static async insert({ speciesName }) {
        const { rows } = await pool.query(
            `INSERT INTO species
            (species_name) VALUES ($1)
            RETURNING *;`,
            [speciesName]
        );
        return new Species(rows[0]);
    }

    static async getAll() {
        const { rows } = await pool.query('SELECT * FROM species;');
        return new Species(rows[0]);
    }

    static async getCount() {
        const { rows } = await pool.query(`
        SELECT species.species_id, species_name, count(*)
        FROM species LEFT JOIN animals
        ON animals.species_id=species.species_id
        GROUP BY species.species_id;`);
        const result = rows.map((row) => {
            const species = new Species(row);
            species.count = row.count;
            return species;
        });
        return result;
    }
}
