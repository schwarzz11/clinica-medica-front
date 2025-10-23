/* * ARQUIVO: js/dashboard.js
 * Lógica SIMULADA (v6.0 - Adiciona Avatar Dinâmico no Header)
 */

$(document).ready(function() {
    console.log("Dashboard JS (v6.0) iniciado.");

    // --- 1. VERIFICAÇÃO DE LOGIN SIMULADO ---
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');

    if (!userType) {
        console.warn('Tipo de usuário não encontrado. Redirecionando para login...');
        if (window.location.pathname.indexOf('login.html') === -1) {
             window.location.href = 'login.html';
        }
        return;
    }
    console.log("Usuário logado:", userType, "-", userName);

    // --- 2. EXIBIR INFORMAÇÕES DO USUÁRIO (NOME E AVATAR) ---
    const $userNameSpan = $('#userName');
    const $welcomeUserNameSpan = $('#welcomeUserName');
    const $userAvatar = $('#userAvatar'); // *** Seleciona a imagem do avatar ***

    let displayName = 'Usuário';
    if (userName) {
        displayName = userName;
    } else {
        displayName = userType.charAt(0).toUpperCase() + userType.slice(1);
    }

    // Define o nome
    if($userNameSpan.length) $userNameSpan.text(`Olá, ${displayName}`);
    if($welcomeUserNameSpan.length) $welcomeUserNameSpan.text(displayName);

    // *** Define a imagem do avatar ***
    if ($userAvatar.length) {
        let avatarSrc = ''; // Caminho da imagem
        if (userType === 'admin') {
            avatarSrc = 'assets/avatar-admin.jpg'; // Ou .png
        } else if (userType === 'medico') {
            avatarSrc = 'assets/avatar-medico.jpg'; // Ou .png
        } else if (userType === 'atendente') {
            avatarSrc = 'assets/avatar-atendente.jpg'; // Ou .png
        } else {
             // Tenta usar uma imagem padrão se existir
             avatarSrc = 'assets/avatar-default.png';
             console.warn("Tipo de usuário desconhecido, tentando avatar padrão.");
        }

        // Define o src e mostra a imagem, com fallback
        if (avatarSrc) {
            $userAvatar.attr('src', avatarSrc)
                       .on('error', function() { // O que fazer se a imagem não carregar
                           console.warn(`Avatar ${avatarSrc} não encontrado ou falha ao carregar.`);
                           $(this).hide(); // Esconde a tag <img> quebrada
                           // Poderia adicionar um ícone ou iniciais como fallback aqui se quisesse
                       })
                       .show(); // Tenta mostrar a imagem
             console.log("Avatar definido para:", avatarSrc);
        } else {
             $userAvatar.hide(); // Esconde se nenhum src foi definido
             console.log("Nenhum avatarSrc definido, escondendo elemento img.");
        }

    } else {
        console.warn("Elemento #userAvatar não encontrado no header.");
    }


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
        'Pacientes': { page: 'pacientes.html', icon: 'fas fa-users', allowed: ['admin', 'atendente', 'medico'] }, // Médico vê pacientes
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

    // --- 4. MOSTRAR CONTEÚDO ESTÁTICO RELEVANTE / PREENCHER DADOS ---
    // (A lógica de mostrar/esconder .user-summary e .user-reports
    //  e preencher #profile... permanece a mesma da v5.9)
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
        const userEmail = userType ? `${userType}@clinica.com` : 'usuario@clinica.com';
        $('#profileName').val(displayName);
        $('#profileEmail').val(userEmail);
        $('#profileRole').val(userType.charAt(0).toUpperCase() + userType.slice(1));
        let phoneExample = '';
        if(userType === 'admin') phoneExample = '(34) 99999-1111';
        else if(userType === 'medico') phoneExample = '(34) 98888-2222';
        else if(userType === 'atendente') phoneExample = '(34) 97777-3333';
        $('#profilePhone').val(phoneExample);

        // Mostra a foto correta E esconde o ícone
        const $profilePicElement = $(`#profilePicture-${userType}`);
        const $profileIcon = $('#profilePictureIcon');
        if ($profilePicElement.length) {
            $profilePicElement.on('error', function() { if ($profileIcon.length) $profileIcon.show(); $(this).hide(); }).show(); // Mostra img, se der erro, mostra ícone
            if ($profileIcon.length) $profileIcon.hide(); // Esconde ícone se img existe
        } else { if ($profileIcon.length) $profileIcon.show(); } // Mostra ícone se img não existe
    }


    // --- 5. FUNCIONALIDADE DE LOGOUT ---
    const $logoutButton = $('#logoutButton');
    if ($logoutButton.length > 0) {
        $logoutButton.off('click').on('click', function() {
            localStorage.removeItem('userType');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        });
    } else { console.error("ERRO: Botão #logoutButton não encontrado."); }

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