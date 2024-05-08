const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path'); // Módulo para lidar com caminhos de arquivos

const app = express();
const PORT = process.env.PORT || 3000;
const supabaseUrl = 'https://uktpvsbhckvvvfotbibt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdHB2c2JoY2t2dnZmb3RiaWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxMDkzOTIsImV4cCI6MjAzMDY4NTM5Mn0.BpeI3Ol0kcNCQLB1HuI7AxVlyO9j_sGz2meVY8aVhYE';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para criar uma nova rota
app.post('/routes', async (req, res) => {
    try {
        const { name, coordinates } = req.body;
        const { data, error } = await supabase
            .from('routes')
            .insert([{ name, coordinates }]);
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Erro ao adicionar rota:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Endpoint para obter todas as rotas
app.get('/routes', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('routes')
            .select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao obter rotas:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Endpoint para excluir uma rota pelo ID
app.delete('/routes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('routes')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.status(200).send('Rota excluída com sucesso.');
    } catch (error) {
        console.error('Erro ao excluir rota:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
