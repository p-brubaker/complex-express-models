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

    static async getById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM ANIMALS WHERE animal_id=$1;',
            [id]
        );
        return new Animal(rows[0]);
    }

    static async getAll() {
        const { rows } = await pool.query(`SELECT 
            animal_id, animal_name, animals.species_id, species_name
            FROM animals LEFT JOIN species
            ON animals.species_id=species.species_id`);
        return rows.map((row) => {
            const animal = new Animal(row);
            animal.species = row.species_name;
            return animal;
        });
    }
}
