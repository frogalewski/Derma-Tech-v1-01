import { HistoryItem, Formula, Product, SavedPrescription } from '../types';

const DB_NAME = 'DermatologicaDB';
const DB_VERSION = 1;
const STORES = {
    HISTORY: 'history',
    SAVED_FORMULAS: 'savedFormulas',
    PRODUCTS: 'products',
    SETTINGS: 'settings', // For key-value pairs
    SAVED_PRESCRIPTIONS: 'savedPrescriptions'
};

let db: IDBDatabase;

// Promise-based wrapper for IDBRequest
function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("Database error:", request.error);
            reject("Error opening database");
        };

        request.onsuccess = (event) => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const tempDb = (event.target as IDBOpenDBRequest).result;
            if (!tempDb.objectStoreNames.contains(STORES.HISTORY)) {
                tempDb.createObjectStore(STORES.HISTORY, { keyPath: 'id' });
            }
            if (!tempDb.objectStoreNames.contains(STORES.SAVED_FORMULAS)) {
                tempDb.createObjectStore(STORES.SAVED_FORMULAS, { keyPath: 'id' });
            }
            if (!tempDb.objectStoreNames.contains(STORES.PRODUCTS)) {
                tempDb.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
            }
            if (!tempDb.objectStoreNames.contains(STORES.SETTINGS)) {
                tempDb.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
            }
            if (!tempDb.objectStoreNames.contains(STORES.SAVED_PRESCRIPTIONS)) {
                tempDb.createObjectStore(STORES.SAVED_PRESCRIPTIONS, { keyPath: 'id' });
            }
        };
    });
};

// Generic CRUD operations
const getStore = (storeName: string, mode: IDBTransactionMode) => {
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
};

const getAll = <T>(storeName: string): Promise<T[]> => {
    const store = getStore(storeName, 'readonly');
    return promisifyRequest(store.getAll());
};

const get = <T>(storeName: string, key: string): Promise<T | undefined> => {
    const store = getStore(storeName, 'readonly');
    return promisifyRequest(store.get(key));
}

const put = (storeName: string, item: any): Promise<IDBValidKey> => {
    const store = getStore(storeName, 'readwrite');
    return promisifyRequest(store.put(item));
};

const remove = (storeName: string, key: string): Promise<void> => {
    const store = getStore(storeName, 'readwrite');
    return promisifyRequest(store.delete(key));
};

const clear = (storeName: string): Promise<void> => {
    const store = getStore(storeName, 'readwrite');
    return promisifyRequest(store.clear());
};

// History functions
export const getAllHistory = () => getAll<HistoryItem>(STORES.HISTORY);
export const addHistoryItem = (item: HistoryItem) => put(STORES.HISTORY, item);
export const updateHistoryItem = (item: HistoryItem) => put(STORES.HISTORY, item);
export const clearHistory = () => clear(STORES.HISTORY);

// Saved Formulas functions
export const getAllSavedFormulas = () => getAll<Formula>(STORES.SAVED_FORMULAS);
export const saveFormula = (formula: Formula) => put(STORES.SAVED_FORMULAS, formula);
export const unsaveFormula = (formulaId: string) => remove(STORES.SAVED_FORMULAS, formulaId);
export const updateSavedFormula = (formula: Formula) => put(STORES.SAVED_FORMULAS, formula);
export const clearSavedFormulas = () => clear(STORES.SAVED_FORMULAS);

// Products functions
export const getAllProducts = () => getAll<Product>(STORES.PRODUCTS);
export const saveProduct = (product: Product) => put(STORES.PRODUCTS, product);
export const deleteProduct = (productId: string) => remove(STORES.PRODUCTS, productId);
export const clearProducts = () => clear(STORES.PRODUCTS);

// Settings functions (for backgroundImage, customIcons, etc.)
export const getSetting = async <T>(key: string): Promise<T | null> => {
    const result = await get<{ key: string, value: T }>(STORES.SETTINGS, key);
    return result ? result.value : null;
};
export const setSetting = (key: string, value: any) => put(STORES.SETTINGS, { key, value });
export const deleteSetting = (key: string) => remove(STORES.SETTINGS, key);

// Saved Prescriptions functions
export const getAllSavedPrescriptions = () => getAll<SavedPrescription>(STORES.SAVED_PRESCRIPTIONS);
export const savePrescription = (item: SavedPrescription) => put(STORES.SAVED_PRESCRIPTIONS, item);
export const deletePrescription = (id: string) => remove(STORES.SAVED_PRESCRIPTIONS, id);
export const clearSavedPrescriptions = () => clear(STORES.SAVED_PRESCRIPTIONS);