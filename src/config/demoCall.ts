/**
 * Hero iPhone Demo Call Configuration
 * Single source of truth for the hero phone audio file and version.
 */

const rawBase = import.meta.env.BASE_URL || '/';
const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export const DEMO_AUDIO_SRC = `${baseUrl}audio/appsian-demo-call.mp3`;
export const DEMO_AUDIO_VERSION = 'v1';
