const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { generateRandomToken } = require('./utils/token');
const { validEmail, validPassword } = require('./middlewares/validateEmail');
const {
  validToken,
  validTalker,
  validAge,
  validateId,
} = require('./middlewares/validateTalker');
const {
  validTalk,
  validRate,
  updateTalkers,
  readTalkers,
} = require('./middlewares/validateTalker');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar

const filePath = path.join(__dirname, 'talker.json');

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const parsedTalker = JSON.parse(fileContent);

    const talker = parsedTalker.find((el) => el.id === id);

    if (talker) {
      return res.status(200).json(talker);
    }

    return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' });
  } catch (error) {
    return console.error(error);
  }
});

app.get('/talker', async (req, res) => {
  const body = { ...req.body };
  const allTalker = await fs.readFile(filePath, 'utf8');
  const allTalkers = JSON.parse(allTalker);
  if (body) {
    return res.status(200).json(allTalkers);
  }
  return [];
});

app.post('/login', validEmail, validPassword, (req, res) => {
  const { email, password } = req.body;
  const newToken = generateRandomToken(16);
  if (email && password) return res.status(200).json({ token: newToken });
});

app.post(
  '/talker',
  validToken,
  validTalker,
  validAge,
  validTalk,
  validRate,
  async (req, res) => {
    const talkerData = await readTalkers(filePath);
    const { name, age, talk } = req.body;

    const newTalker = {
      id: talkerData.length + 1,
      name,
      age,
      talk,
    };

    const newData = [...talkerData, newTalker];

    updateTalkers(filePath, newData);

    res.status(201).json(newTalker);
  },
);

app.put('/talker/:id',
  validToken,
  validTalker,
  validAge,
  validTalk,
  validRate,
  validateId,
  async (req, res) => {
    const talkers = await readTalkers(filePath);
    const { name, age, talk } = req.body;
    const { id } = req.params;
    const updatedTalker = {
      id: +id,
      name,
      age,
      talk,
    };
    const findTalkers = talkers.filter((talker) => talker.id !== +id);
    const newTalker = [...findTalkers, updatedTalker];
    updateTalkers(filePath, newTalker);
    return res.status(200).json(updatedTalker);
  });

app.delete('/talker/:id', validToken, async (req, res) => {
  const talkers = await fs.readFile(filePath);
  const { id } = req.params;
  const position = talkers.filter((talker) => Number(talker.id) !== +id);
  updateTalkers(filePath, position);
  return res.status(204).json();
});

app.listen(PORT, () => {
  console.log('Online');
});
