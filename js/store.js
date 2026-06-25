// ════════════════════════════════════════════════════════════════════════════
// STORE — in-memory runtime state + persistence glue. Avoids circular imports
// between feature modules (workout, editor, library, templates).
// ════════════════════════════════════════════════════════════════════════════

import {
  loadConfig, saveConfig, loadProfile, saveProfile,
  loadFavorites, saveFavorites, deepClone,
} from './state.js';

let _config    = loadConfig();
let _profile   = loadProfile();
let _favorites = loadFavorites();

export function getConfig()  { return _config; }
export function getProfile() { return _profile; }

export function setConfig(cfg) {
  _config = cfg;
  saveConfig(_config);
}

export function persistConfig() { saveConfig(_config); }

export function setProfile(p) {
  _profile = p;
  saveProfile(_profile);
}

// ─── Favorites ───────────────────────────────────────────────────────────────
export function getFavorites() { return _favorites; }

export function addFavorite(name, config) {
  const fav = {
    id: 'f' + Date.now().toString(36),
    name: (name || config.name || 'Allenamento').trim(),
    config: deepClone(config),
    createdAt: Date.now(),
  };
  _favorites = [fav, ..._favorites];
  saveFavorites(_favorites);
  return fav;
}

export function removeFavorite(id) {
  _favorites = _favorites.filter(f => f.id !== id);
  saveFavorites(_favorites);
}
