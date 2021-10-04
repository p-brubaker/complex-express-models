DROP TABLE IF EXISTS animals CASCADE;
DROP TABLE IF EXISTS species CASCADE;

CREATE TABLE species (
    species_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    species_name TEXT
);
CREATE TABLE animals (
    animal_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    animal_name TEXT,
    species_id BIGINT NOT NULL,
    FOREIGN KEY (species_id) REFERENCES species (species_id)
);
