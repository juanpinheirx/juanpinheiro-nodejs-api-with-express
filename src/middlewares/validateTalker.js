const fs = require('fs/promises');

const readTalkers = async (_path) => {
  try {
    const data = await fs.readFile(_path)
      .then((content) => JSON.parse(content));
    return data;
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
};

const updateTalkers = async (_path, newData) => {
  try {
    const newMovies = JSON.stringify(newData);
    await fs.writeFile(_path, newMovies);
  } catch (err) {
    console.error('Error writing file:', err);
    return null;
  }
};

const validToken = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length !== 16) return res.status(401).json({ message: 'Token inválido' });
  next();
};

const validTalker = (req, res, next) => {
  const { name } = req.body;
  console.log(name);
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validAge = (req, res, next) => {
  const { age } = req.body;
  const message = 'O campo "age" deve ser um número inteiro igual ou maior que 18';

  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (!Number.isInteger(age)) {
    return res.status(400).json({ message });
  }
  if (age < 18) {
    return res.status(400).json({ message });
  }
  next();
};

const validTalk = (req, res, next) => {
  // console.log(body);
  const { talk } = req.body;
  console.log(talk);
  const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
  // console.log(dateRegex.test(talk.watchedAt));
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  if (!('watchedAt' in talk)) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!dateRegex.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validRate = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;
  const message = 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  if (!('rate' in talk)) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!Number.isInteger(rate)) {
    return res.status(400).json({ message });
  }
  if (!(rate >= 1 && rate <= 5)) {
    return res.status(400).json({ message });
  }
  next();
};

module.exports = {
  validToken,
  validTalker,
  validAge,
  validTalk,
  validRate,
  updateTalkers,
  readTalkers,
};