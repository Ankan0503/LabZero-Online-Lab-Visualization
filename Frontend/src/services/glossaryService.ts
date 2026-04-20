import { GlossaryTerm, SubjectId } from '../types/types';

export const INITIAL_GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: '1',
    term: 'Atom',
    definition: 'The smallest unit of an element that retains its properties.',
    subject: SubjectId.CHEMISTRY
  },
  {
    id: '2',
    term: 'Molecule',
    definition: 'A group of atoms bonded together, representing the smallest fundamental unit of a chemical compound.',
    subject: SubjectId.CHEMISTRY
  },
  {
    id: '3',
    term: 'Electron',
    definition: 'A stable subatomic particle with a charge of negative electricity.',
    subject: SubjectId.CHEMISTRY
  },
  {
    id: '4',
    term: 'DNA',
    definition: 'Deoxyribonucleic acid, a self-replicating material which is the main constituent of chromosomes. It is the carrier of genetic information.',
    subject: SubjectId.BIOLOGY
  },
  {
    id: '5',
    term: 'Force',
    definition: 'An influence that tends to change the motion of a body or produce motion in a stationary body.',
    subject: SubjectId.PHYSICS
  },
  {
    id: '6',
    term: 'Gravity',
    definition: 'The force that attracts a body toward the center of the earth, or toward any other physical body having mass.',
    subject: SubjectId.PHYSICS
  },
  {
    id: '7',
    term: 'Calculus',
    definition: 'The branch of mathematics that deals with the finding and properties of derivatives and integrals of functions.',
    subject: SubjectId.MATH
  },
  {
    id: '8',
    term: 'Photosynthesis',
    definition: 'The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.',
    subject: SubjectId.BIOLOGY
  }
];

const DB_NAME = 'OmniScienceDB';
const STORE_NAME = 'glossary';
const DB_VERSION = 1;

export class GlossaryService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = async (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        await this.prePopulate();
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async prePopulate(): Promise<void> {
    const terms = await this.getAll();
    if (terms.length === 0) {
      for (const term of INITIAL_GLOSSARY_TERMS) {
        await this.add(term);
      }
    }
  }

  async getAll(): Promise<GlossaryTerm[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve([]);
      const transaction = this.db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async add(term: GlossaryTerm): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB not initialized');
      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(term);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async search(query: string): Promise<GlossaryTerm[]> {
    const all = await this.getAll();
    if (!query) return all;
    const lower = query.toLowerCase();
    return all.filter(t => 
      t.term.toLowerCase().includes(lower) || 
      t.definition.toLowerCase().includes(lower)
    );
  }
}

export const glossaryService = new GlossaryService();
