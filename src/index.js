const express = require('express');
const fs = require('fs/promises');
const path = require('path');

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

    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } catch (error) {
    console.error(error);
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

app.listen(PORT, () => {
  console.log('Online');
});
