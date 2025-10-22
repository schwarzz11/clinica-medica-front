/* * ARQUIVO: js/dashboard.js
 * Lógica SIMULADA (v5.5 - Links por Perfil CORRIGIDO + Scrollbar + Ajustes Visuais + Relatórios para Todos)
 */

$(document).ready(function() {
    console.log("Dashboard JS (v5.5) iniciado."); 

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

    // Definição dos itens de menu ATUALIZADA (Relatórios para todos)
    const menuItems = {
        'Painel Principal': { page: 'dashboard.html', icon: 'fas fa-home', allowed: ['admin', 'medico', 'atendente'] }, 
        'Pacientes': { page: 'pacientes.html', icon: 'fas fa-users', allowed: ['admin', 'atendente'] },
        'Consultas': { page: 'consultas.html', icon: 'fas fa-calendar-alt', allowed: ['admin', 'medico', 'atendente'] },
        'Prontuários': { page: 'prontuarios.html', icon: 'fas fa-file-medical', allowed: ['admin', 'medico'] },
        'Funcionários': { page: 'funcionarios.html', icon: 'fas fa-user-tie', allowed: ['admin'] },
        'Especialidades': { page: 'especialidades.html', icon: 'fas fa-stethoscope', allowed: ['admin'] },
        'Convênios': { page: 'convenios.html', icon: 'fas fa-notes-medical', allowed: ['admin'] },
        'Perfis': { page: 'perfis.html', icon: 'fas fa-user-shield', allowed: ['admin'] },
        'Relatórios': { page: 'relatorios.html', icon: 'fas fa-chart-line', allowed: ['admin', 'medico', 'atendente'] }, // FIX: Permitido para todos
        'Meu Perfil': { page: 'perfil_usuario.html', icon: 'fas fa-user-edit', allowed: ['admin', 'medico', 'atendente'] },
        'Configurações': { page: 'configuracoes.html', icon: 'fas fa-cog', allowed: ['admin'] } 
    };

    let itemsAdded = 0;
    Object.keys(menuItems).forEach(text => {
        const item = menuItems[text];
        // FIX: Reintroduzida a verificação de permissão
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
            } else {
                 console.warn(`Item de menu '${text}' permitido, mas não tem uma página definida.`);
            }
        }
    });
    console.log(itemsAdded + " itens adicionados ao menu para", userType);
    if (itemsAdded === 0) {
        console.warn("Nenhum item de menu foi adicionado para este usuário.");
         $sidebarMenu.append('<li><span style="padding: 15px 25px; color: #aaa;">Nenhuma opção disponível</span></li>');
    }

    // Marcar link ativo (baseado na URL atual)
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html'; 
    const $activeLink = $sidebarMenu.find(`a[href$="${currentPage}"]`); 
    if ($activeLink.length > 0) {
        $activeLink.addClass('active');
        console.log("Link ativo marcado:", currentPage);
    } else {
        console.warn("Nenhum link ativo encontrado para a página atual:", currentPage);
         const $dashboardLink = $sidebarMenu.find(`a[href$="dashboard.html"]`);
         if ($dashboardLink.length > 0) {
             $dashboardLink.addClass('active');
             console.log("Marcando 'Painel Principal' como ativo (fallback).");
         }
    }


    // --- 4. MOSTRAR CONTEÚDO ESTÁTICO RELEVANTE ---
    console.log("Tentando mostrar conteúdo para:", userType);
    $('.user-summary').hide(); 

    const $targetSummary = $(`#${userType}-summary`); 

    if ($targetSummary.length > 0) {
        $targetSummary.show(); 
        console.log(`Conteúdo ${userType} exibido com sucesso.`);
    } else {
        console.warn(`Seção de resumo para '${userType}' (#${userType}-summary) não encontrada no HTML.`);
    }


    // --- 5. FUNCIONALIDADE DE LOGOUT (CORRIGIDO PARA index.html) ---
    const $logoutButton = $('#logoutButton');
    if ($logoutButton.length > 0) {
        $logoutButton.off('click').on('click', function() {
            localStorage.removeItem('userType');
            localStorage.removeItem('userName');
            console.log('Logout realizado. Redirecionando para a PÁGINA INICIAL (index.html)...');
            window.location.href = 'index.html'; 
        });
        console.log("Listener do botão Logout anexado.");
    } else {
         console.error("ERRO: Botão #logoutButton não encontrado no HTML.");
    }
    
    // --- 6. Lógica para Menu Hamburger em Telas Pequenas ---
     if ($('#hamburgerButton').length === 0) {
        if ($('.main-header .header-content').length > 0) {
            $('.main-header .header-content').prepend('<button class="hamburger-btn" id="hamburgerButton"><i class="fas fa-bars"></i></button>');
            console.log("Botão Hamburger adicionado dinamicamente.");
        } else {
             console.error("Elemento .main-header .header-content não encontrado para adicionar o botão hamburger.");
        }
    }
     $('body').off('click', '#hamburgerButton').on('click', '#hamburgerButton', function() {
        $('.sidebar').toggleClass('active'); 
        console.log("Hamburger clicado, sidebar active:", $('.sidebar').hasClass('active')); 
     });
     console.log("Listener do botão Hamburger anexado.");

    console.log("Dashboard JS finalizado.");
}); // Fim do $(document).ready()