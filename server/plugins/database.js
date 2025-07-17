import { createStorage } from "unstorage";
import dbDriver from "unstorage/drivers/db0";
import lruCacheDriver from "unstorage/drivers/lru-cache";
import { createDatabase } from "db0";
import sqlite from "db0/connectors/node-sqlite";

// Create a single database and storage instance
const database = createDatabase(
  sqlite({
    name: "auth",
  })
);

const storage = createStorage({
  driver: dbDriver({
    database,
  })
});

// Session storage with LRU cache (1GB max)
const sessionStorage = createStorage({
  driver: lruCacheDriver({
    max: 100000
  })
});

export default async (_nitroApp) => {
  //Can leave empty
  const keys = await storage.getKeys();
  console.log(keys);
};

// Storage utility functions
export const userStorageService = {
  // Get a value by key
  async get(key) {
    return await storage.getItem(key);
  },
  
  // Set a value with a key
  async set(key, value) {
    return await storage.setItem(key, value);
  },
  
  // Check if key exists
  async has(key) {
    return await storage.hasItem(key);
  },
  
  // Remove a key
  async remove(key) {
    return await storage.removeItem(key);
  },
  
  // Get all keys
  async getKeys(prefix = "") {
    return await storage.getKeys(prefix);
  },
  
  // Clear all items
  async clear() {
    return await storage.clear();
  },
  
  // Get storage instance directly if needed
  getInstance() {
    return storage;
  }
};

// Session storage utility functions
export const sessionStorageService = {
  // Get a value by key
  async get(key) {
    return await sessionStorage.getItem(key);
  },
  
  // Set a value with a key
  async set(key, value) {
    return await sessionStorage.setItem(key, value);
  },
  
  // Remove a key
  async remove(key) {
    return await sessionStorage.removeItem(key);
  },
  
  // Get all keys
  async getKeys(prefix = "") {
    return await sessionStorage.getKeys(prefix);
  },
  
  // Clear all items
  async clear() {
    return await sessionStorage.clear();
  },
  
  // Get storage instance directly if needed
  getInstance() {
    return sessionStorage;
  }
};