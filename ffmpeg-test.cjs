const ffmpegPath = require('ffmpeg-static');
const { execFile } = require('child_process');

console.log('ffmpeg path:', ffmpegPath);

execFile(ffmpegPath, ['-version'], (err, stdout, stderr) => {
  if (err) {
    console.error('ffmpeg -version error', err);
    return;
  }
  console.log(stdout.split('\n').slice(0,3).join('\n'));
});
