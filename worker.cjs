// worker.cjs
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);

const input = process.argv[2];
const out = process.argv[3] || 'out.mp4';
if (!input) { console.error('Usage: node worker.cjs input.mp4 [out.mp4]'); process.exit(1); }

ffmpeg(input)
  .setStartTime(0)
  .setDuration(8)
  .videoCodec('libx264')
  .audioCodec('aac')
  .outputOptions('-preset veryfast', '-crf 23')
  .on('start', cmd => console.log('cmd:', cmd))
  .on('progress', p => console.log('progress:', p.percent ? p.percent.toFixed(1) + '%' : p))
  .on('end', () => console.log('done ->', out))
  .on('error', e => console.error('ffmpeg error', e))
  .save(out);
