require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const supabase = require('./supabase');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;


app.post('/produtos', async (req, res) => {
  const { nome, quantidade, preco, categoria } = req.body;

  if (!nome || quantidade === undefined || preco === undefined) {
    return res.status(400).json({ erro: "Nome, quantidade e preço são obrigatórios." });
  }

  const { data, error } = await supabase
    .from('produtos')
    .insert([{ nome, quantidade, preco, categoria }])
    .select();

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  return res.status(201).json(data[0]);
});

app.get('/produtos', async (req, res) => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  return res.status(200).json(data);
});


app.get('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  return res.status(200).json(data);
});


app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, preco, categoria } = req.body;

  const { data, error } = await supabase
    .from('produtos')
    .update({ nome, quantidade, preco, categoria })
    .eq('id', id)
    .select();

  if (error || data.length === 0) {
    return res.status(404).json({ erro: "Erro ao atualizar ou produto não encontrado." });
  }

  return res.status(200).json(data[0]);
});


app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)
    .select();

  if (error || data.length === 0) {
    return res.status(404).json({ erro: "Erro ao deletar ou produto não encontrado." });
  }

  return res.status(200).json({ mensagem: "Produto deletado com sucesso!" });
});

app.listen(PORT, () => {
  console.log(`Servidor http://localhost:${PORT}`);
});