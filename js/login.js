/* * ARQUIVO: js/login.js
 * Lógica SIMULADA para a tela de login (sem back-end)
 */

$(document).ready(function() {

    // --- USUÁRIOS FIXOS PARA SIMULAÇÃO ---
    // (Você pode mudar os emails e senhas aqui)
    const users = {
        'admin@clinica.com': { password: 'admin', type: 'admin', name: 'Administrador' },
        'medico@clinica.com': { password: 'medico', type: 'medico', name: 'Dr. João Silva' },
        'atendente@clinica.com': { password: 'atendente', type: 'atendente', name: 'Maria Oliveira' }
    };
    // ------------------------------------

    // Referências aos elementos do formulário e mensagem de erro
    const $loginForm = $('#loginForm');
    const $usernameInput = $('#username');
    const $passwordInput = $('#password');
    const $errorMessage = $('#errorMessage');

    // Evento de submit do formulário
    $loginForm.on('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Limpa mensagens de erro anteriores
        $errorMessage.hide().text('');

        // Pega os valores dos campos
        const username = $usernameInput.val().trim();
        const password = $passwordInput.val().trim();

        // Validação simples: verifica se os campos não estão vazios
        if (!username || !password) {
            showError('Por favor, preencha o usuário e a senha.');
            return; 
        }

        // --- LÓGICA DE LOGIN SIMULADA ---
        const userFound = users[username]; // Procura o usuário no objeto 'users'

        // Verifica se o usuário existe e a senha está correta
        if (userFound && userFound.password === password) {
            console.log('Login simulado bem-sucedido para:', userFound.type);

            // Guarda o TIPO de usuário e o NOME no localStorage
            localStorage.setItem('userType', userFound.type);
            localStorage.setItem('userName', userFound.name); // Guarda o nome para exibir no dashboard

            // Redireciona para o dashboard
            window.location.href = 'dashboard.html'; 
        
        } else {
            // Usuário não encontrado ou senha incorreta
            showError('Usuário ou senha inválidos.');
            console.log('Tentativa de login falhou para:', username);
        }
        // --- FIM DA LÓGICA SIMULADA ---
    });

    // Função auxiliar para exibir mensagens de erro
    function showError(message) {
        $errorMessage.text(message).show();
    }

}); 