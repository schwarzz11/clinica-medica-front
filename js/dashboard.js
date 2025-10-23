/* * ARQUIVO: js/dashboard.js
 * Lógica SIMULADA (v5.9 - Preenche Dados e Foto no Perfil)
 */

$(document).ready(function() {
    console.log("Dashboard JS (v5.9) iniciado.");

    // --- 1. VERIFICAÇÃO DE LOGIN SIMULADO ---
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    const userEmail = userType ? `${userType}@clinica.com` : 'usuario@clinica.com';

    if (!userType) {
        console.warn('Tipo de usuário não encontrado. Redirecionando para login...');
        if (window.location.pathname.indexOf('login.html') === -1) {
             window.location.href = 'login.html';
        }
        return;
    }
    console.log("Usuário logado:", userType, "-", userName, "-", userEmail);

    // --- 2. EXIBIR INFORMAÇÕES DO USUÁRIO ---
    const $userNameSpan = $('#userName');
    const $welcomeUserNameSpan = $('#welcomeUserName');

    let displayName = 'Usuário';
    if (userName) {
        displayName = userName;
    } else {
        displayName = userType.charAt(0).toUpperCase() + userType.slice(1);
    }
    if($userNameSpan.length) $userNameSpan.text(`Olá, ${displayName}`);
    if($welcomeUserNameSpan.length) $welcomeUserNameSpan.text(displayName);

    // --- 3. CONSTRUÇÃO DINÂMAICA DO MENU LATERAL (SIDEBAR - Links por Perfil) ---
    const $sidebarMenu = $('#sidebarMenu');
    if ($sidebarMenu.length === 0) {
        console.error("ERRO CRÍTICO: Elemento #sidebarMenu não encontrado no HTML.");
        return;
    }
    $sidebarMenu.empty();
    console.log("Construindo menu APENAS com links permitidos para:", userType);

    const menuItems = {
        'Painel Principal': { page: 'dashboard.html', icon: 'fas fa-home', allowed: ['admin', 'medico', 'atendente'] },
        'Pacientes': { page: 'pacientes.html', icon: 'fas fa-users', allowed: ['admin', 'atendente'] },
        'Consultas': { page: 'consultas.html', icon: 'fas fa-calendar-alt', allowed: ['admin', 'medico', 'atendente'] },
        'Prontuários': { page: 'prontuarios.html', icon: 'fas fa-file-medical', allowed: ['admin', 'medico'] },
        'Funcionários': { page: 'funcionarios.html', icon: 'fas fa-user-tie', allowed: ['admin'] },
        'Especialidades': { page: 'especialidades.html', icon: 'fas fa-stethoscope', allowed: ['admin'] },
        'Convênios': { page: 'convenios.html', icon: 'fas fa-notes-medical', allowed: ['admin'] },
        'Perfis': { page: 'perfis.html', icon: 'fas fa-user-shield', allowed: ['admin'] },
        'Relatórios': { page: 'relatorios.html', icon: 'fas fa-chart-line', allowed: ['admin', 'medico', 'atendente'] },
        'Meu Perfil': { page: 'perfil_usuario.html', icon: 'fas fa-user-edit', allowed: ['admin', 'medico', 'atendente'] },
        'Configurações': { page: 'configuracoes.html', icon: 'fas fa-cog', allowed: ['admin'] }
    };

    let itemsAdded = 0;
    Object.keys(menuItems).forEach(text => {
        const item = menuItems[text];
        if (item.allowed && item.allowed.includes(userType)) {
            if (item.page) {
                $sidebarMenu.append(`
                    <li>
                        <a href="${item.page}">
                          <i class="${item.icon || 'fas fa-circle'}"></i>
                          <span>${text}</span>
                        </a>
                    </li>
                `);
                itemsAdded++;
            }
        }
    });
    console.log(itemsAdded + " itens adicionados ao menu para", userType);
    if (itemsAdded === 0) {
         $sidebarMenu.append('<li><span style="padding: 15px 25px; color: #aaa;">Nenhuma opção disponível</span></li>');
    }

    // Marcar link ativo
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const $activeLink = $sidebarMenu.find(`a[href$="${currentPage}"]`);
    if ($activeLink.length > 0) {
        $activeLink.addClass('active');
    } else {
         const $dashboardLink = $sidebarMenu.find(`a[href$="dashboard.html"]`);
         if ($dashboardLink.length > 0) $dashboardLink.addClass('active');
    }

    // --- 4. MOSTRAR CONTEÚDO ESTÁTICO / PREENCHER DADOS ---
    console.log("Página atual:", currentPage, "User:", userType);

    $('.user-summary').hide();
    $('.user-reports').hide();

    // DASHBOARD.HTML
    if (currentPage === 'dashboard.html') {
        const $targetSummary = $(`#${userType}-summary`);
        if ($targetSummary.length > 0) $targetSummary.show();
        else console.warn(`#${userType}-summary não encontrado.`);
    }
    // RELATORIOS.HTML
    else if (currentPage === 'relatorios.html') {
        const $targetReports = $(`#${userType}-relatorios`);
        if ($targetReports.length > 0) $targetReports.show();
         else console.warn(`#${userType}-relatorios não encontrado.`);
    }
    // PERFIL_USUARIO.HTML
    else if (currentPage === 'perfil_usuario.html') {
        console.log("Preenchendo dados do perfil...");
        // Preenche campos do formulário
        $('#profileName').val(displayName);
        $('#profileEmail').val(userEmail);
        $('#profileRole').val(userType.charAt(0).toUpperCase() + userType.slice(1));

        // Simula telefone
        let phoneExample = '';
        if(userType === 'admin') phoneExample = '(34) 99999-1111';
        else if(userType === 'medico') phoneExample = '(34) 98888-2222';
        else if(userType === 'atendente') phoneExample = '(34) 97777-3333';
        $('#profilePhone').val(phoneExample);

        // Mostra a imagem correta e esconde o ícone
        const $profilePicElement = $(`#profilePicture-${userType}`); // Seleciona a <img> correta
        const $profileIcon = $('#profilePictureIcon');

        if ($profilePicElement.length) {
            // Verifica se a imagem existe/carregou (tratamento básico de erro)
            $profilePicElement.on('error', function() {
                 console.warn(`Imagem ${$profilePicElement.attr('src')} não encontrada. Mostrando ícone.`);
                 if ($profileIcon.length) $profileIcon.show(); // Mostra ícone se img falhar
            }).show(); // Tenta mostrar a imagem
            if ($profileIcon.length) $profileIcon.hide(); // Esconde o ícone por padrão
            console.log(`Tentando exibir ${$profilePicElement.attr('src')}`);
        } else {
             console.warn(`Elemento img para '${userType}' não encontrado. Mostrando ícone.`);
             if ($profileIcon.length) $profileIcon.show(); // Mostra ícone se img não existe
        }
    }


    // --- 5. FUNCIONALIDADE DE LOGOUT ---
    const $logoutButton = $('#logoutButton');
    if ($logoutButton.length > 0) {
        $logoutButton.off('click').on('click', function() {
            localStorage.removeItem('userType');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        });
    } else {
         console.error("ERRO: Botão #logoutButton não encontrado.");
    }

    // --- 6. Lógica para Menu Hamburger ---
     if ($('#hamburgerButton').length === 0) {
        if ($('.main-header .header-content').length > 0) {
            $('.main-header .header-content').prepend('<button class="hamburger-btn" id="hamburgerButton"><i class="fas fa-bars"></i></button>');
        }
    }
     $('body').off('click', '#hamburgerButton').on('click', '#hamburgerButton', function() {
        $('.sidebar').toggleClass('active');
     });

    console.log("Dashboard JS finalizado.");
}); // Fim do $(document).ready()