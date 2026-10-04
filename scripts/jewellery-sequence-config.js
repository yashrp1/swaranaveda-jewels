window.SWARNAVEDA_SEQUENCE = Object.freeze({
  frameCount: 150,
  prefix: 'gold-necklace-',
  extension: 'webp',
  desktopFolder: 'assets/sequence/gold-necklace/desktop/',
  mobileFolder: 'assets/sequence/gold-necklace/mobile/',
  mobileMaxWidth: 760,
  // A brief, single-pass hero movement, then the editorial page resumes normal scrolling.
  stickyTrackVh: 200,
  // A fixed Blender render is transformed by the master scroll timeline; pose-to-pose
  // sequence frames stay available as source assets but are not scrubbed as the animation.
  themes: [
    { at: 0.00, color: '#0A0908', accent: '#8b714b' },
    { at: 0.19, color: '#21160f', accent: '#b08c58' },
    { at: 0.37, color: '#2c1c10', accent: '#c3a16a' },
    { at: 0.50, color: '#101316', accent: '#88939a' },
    { at: 0.69, color: '#18232d', accent: '#b8c2c7' },
    { at: 0.83, color: '#464c50', accent: '#d1d2cf' },
    { at: 1.00, color: '#9a9d9b', accent: '#f0eee6' }
  ]
});
