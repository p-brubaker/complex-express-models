import pool from '../utils/pool.js';

export default class Animal {
    constructor(row) {
        this.animal_id = row.animal_id;
        this.animalName = row.animal_name;
        this.speciesId = row.species_id;
    }

    static async insert({ animalName, speciesId }) {
        const { rows } = await pool.query(
            `INSERT INTO animals
            (animal_name, species_id) VALUES ($1, $2)
            RETURNING *;`,
            [animalName, speciesId]
        );
        return new Animal(rows[0]);
    }
}
