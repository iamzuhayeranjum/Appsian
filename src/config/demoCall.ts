/**
 * Hero iPhone Demo Call Configuration
 * Single source of truth for the hero phone audio file and version.
 */

const rawAudioSrc = 'https://cdn.jsdelivr.net/gh/iamzuhayeranjum/Appsian@9f82ecf02aa9c4c39045067d071359542a7a53cf/public/audio/appsian-demo-call.mp3';

const rawBase = import.meta.env.BASE_URL || '/';
const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export const DEMO_AUDIO_SRC = rawAudioSrc.startsWith('http')
  ? rawAudioSrc
  : `${baseUrl}${rawAudioSrc.replace(/^\//, '')}`;

export const DEMO_AUDIO_VERSION = 'v2';
