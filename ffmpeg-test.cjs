const ffmpegPath = require('ffmpeg-static');
const { execFile } = require('child_process');
console.log('ffmpeg path:', ffmpegPath);
execFile(ffmpegPath, ['-version'], (err, stdout) => {
  if (err) return console.error(err);
  console.log(stdout.split('\n').slice(0,3).join('\n'));
});
const { v4: uuidv4 } = require('uuid');
const { join } = require('path');

app.post('/test-transcode', async (req, res) => {
  // expects rawBuffer (base64) or a file already on disk. This example assumes file on disk for simplicity.
  const input = path.resolve('./test-assets/input.mov');   // put a small file here to test
  const out = path.resolve('./test-assets/out-' + uuidv4() + '.mp4');

  const ffmpeg = require('fluent-ffmpeg');
  ffmpeg(input)
    .outputOptions(['-c:v libx264', '-preset veryfast'])
    .toFormat('mp4')
    .on('start', cmd => console.log('FFMPEG START:', cmd))
    .on('error', (err, stdout, stderr) => {
      console.error('FFMPEG ERR', err.message);
      console.error(stderr);
      return res.status(500).json({ ok: false, error: err.message });
    })
    .on('end', () => {
      console.log('FFMPEG DONE ->', out);
      return res.json({ ok: true, out });
    })
    .save(out);
});
