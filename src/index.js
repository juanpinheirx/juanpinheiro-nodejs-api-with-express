const express = require('express');
const fs = require('fs/promises');
const { join } = require('path');

const app = express();
const path = '/talker.json';
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
<<<<<<< HEAD
  const [body] = req.body;
  const allTalker = await fs.readFile(join(__dirname, path), 'utf8');
  const allTalkers = JSON.parse(allTalker);
  if (body) {
    return res.status(200).json(allTalkers);
  }
  return [];
});
=======
  const body = req.body;
  const allTalker = await fs.readFile(join(__dirname, path), 'utf8');
  const allTalkers = JSON.parse(allTalker);
  if (body) {
    return res.status(200).json(allTalkers)
  } else {
    return [];
  }
})
>>>>>>> 0e0e527cb62290c2661d5c3dd761915bbf4ca8a5

app.listen(PORT, () => {
  console.log('Online');
});
