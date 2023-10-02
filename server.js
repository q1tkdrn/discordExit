const express = require('express');
const server = express();
server.all('/', (req, res) => {
  res.send('봇상태 : \n온라인');
});
function keepAlive() {
  server.listen(3000, () => { console.log("서버준비됨") });
}
module.exports = keepAlive;