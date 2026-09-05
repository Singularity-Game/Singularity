import { Injectable } from '@angular/core';
import { APP_DB_SCHEMAS } from './indexd-db-schemas/songs';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private readonly dbName = 'SingularityDb';
  private readonly dbVersion = 1;
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.initDb();
  }

  private initDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Iteriere über unsere Schemas und erstelle fehlende Stores & Indizes
        APP_DB_SCHEMAS.forEach(schema => {
          if (!db.objectStoreNames.contains(schema.store)) {
            const store = db.createObjectStore(schema.store, schema.storeConfig);
            schema.storeSchema.forEach(index => {
              store.createIndex(index.name, index.keypath, index.options);
            });
          }
        });
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  public getAll<T>(storeName: string): Observable<T[]> {
    const promise = this.dbPromise.then(db => {
      return new Promise<T[]>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });

    return from(promise);
  }

  public getById<T>(storeName: string, key: any): Observable<T> {
    const promise = this.dbPromise.then(db => {
      return new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });

    return from(promise);
  }

  public add<T>(storeName: string, value: T): Observable<T> {
    const promise = this.dbPromise.then(db => {
      return new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(value); // ggf. .put(value) nutzen für Upsert

        request.onsuccess = () => resolve(value);
        request.onerror = () => reject(request.error);
      });
    });

    return from(promise);
  }

  public delete(storeName: string, key: any): Observable<boolean> {
    const promise = this.dbPromise.then(db => {
      return new Promise<boolean>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    });

    return from(promise);
  }
}
