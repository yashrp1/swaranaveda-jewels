/* ===================================================================
   SWARANAVEDA JEWELS — AMBIENT LUXURY SOUND GENERATOR
   Procedural Web Audio API: Harmonic Warm Drone & Crystalline Shimmer
   =================================================================== */

window.SwaranavedaAudio = (function () {
  'use strict';

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let filter = null;

  function initAudio() {
    if (audioCtx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();

    // Master Gain
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Warm Low-pass Filter
    filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, audioCtx.currentTime);
    filter.Q.setValueAtTime(2, audioCtx.currentTime);
    filter.connect(masterGain);

    // Root Tone 108Hz (sacred ratio & warm resonant drone)
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(108, audioCtx.currentTime);

    // Perfect Fifth harmonic (162Hz) with subtle detune for warmth
    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'triangle';
    droneOsc2.frequency.setValueAtTime(162, audioCtx.currentTime);
    droneOsc2.detune.setValueAtTime(4, audioCtx.currentTime);

    const droneGain1 = audioCtx.createGain();
    droneGain1.gain.setValueAtTime(0.18, audioCtx.currentTime);
    droneOsc1.connect(droneGain1);
    droneGain1.connect(filter);

    const droneGain2 = audioCtx.createGain();
    droneGain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
    droneOsc2.connect(droneGain2);
    droneGain2.connect(filter);

    droneOsc1.start();
    droneOsc2.start();
  }

  // Play subtle crystalline shimmer note on luxury interactions
  function triggerChime() {
    if (!isPlaying || !audioCtx) return;

    const freqs = [864, 1080, 1296, 1728];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];

    const osc = audioCtx.createOscillator();
    const chimeGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    chimeGain.gain.setValueAtTime(0, audioCtx.currentTime);
    chimeGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

    osc.connect(chimeGain);
    chimeGain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.8);
  }

  function toggle() {
    if (!audioCtx) {
      initAudio();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 2.5);
      triggerChime();
    } else {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 1.2);
    }

    return isPlaying;
  }

  return {
    toggle: toggle,
    triggerChime: triggerChime,
    isPlaying: function () {
      return isPlaying;
    }
  };
})();
