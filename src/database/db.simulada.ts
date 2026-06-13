import * as fs from 'fs';
import type { Incidente } from '../models/incidente.model';

const DB_PATH = './database.json';

export const leerDB = (): Incidente[] => {
    if (!fs.existsSync(DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};

export const guardarDB = (data: Incidente[]) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

export const limpiarDB = (): void => {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
};