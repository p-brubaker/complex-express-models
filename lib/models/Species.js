import pool from '../utils/pool.js';

export default class Species {
    constructor(row) {
        this.id = row.id;
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
}
