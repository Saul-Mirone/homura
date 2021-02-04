import { Database } from 'better-sqlite3';

export const updateSourceNameById = `
UPDATE sources SET name = :name, updatedAt = CURRENT_TIMESTAMP WHERE id = :id ;`;

export type UpdateSourceOptions = {
    name: string;
    id: number;
};

export function updateSource(db: Database, options: UpdateSourceOptions) {
    db.prepare<UpdateSourceOptions>(updateSourceNameById).run(options);
}
