/* * ARQUIVO: js/index.js
 * JavaScript v8.1 (Ajuste para header menor)
 */

$(document).ready(function() {

    // 1. ROLAGEM SUAVE (SMOOTH SCROLL)
    // ==================================
    $('a[href^="#"]').on('click', function(event) {
        var targetHash = this.hash;

        if (targetHash && $(targetHash).length) {
            event.preventDefault();
            
            // Calcula a altura exata do header (55px logo + 24px padding = 79px ~ 80px)
            var headerHeight = $('header').outerHeight();
            var targetPosition = $(targetHash).offset().top - headerHeight; 

            // Ajuste para as seções com "overlap"
            if ($(targetHash).hasClass('section-on-gray') && targetHash !== '#contato') {
                 // Para #sobre, compensa o overlap e dá um espaço extra
                 targetPosition = $(targetHash).offset().top - headerHeight + 50; 
            } else if (targetHash === '#contato') {
                // Para #contato, que vem depois do CTA azul, calcula normal
                 targetPosition = $(targetHash).offset().top - headerHeight;
            }


            $('html, body').animate({
                scrollTop: targetPosition
            }, 800); 
        }
    });

    // 2. SIMULAÇÃO DE ENVIO DE FORMULÁRIO DE CONTATO
    // ===============================================
    $('#contactForm').on('submit', function(event) {
        event.preventDefault();
        var nome = $('#nome').val();
        alert('Olá, ' + nome + '! Sua mensagem foi enviada com sucesso. (Isso é uma simulação)');
        this.reset();
    });

    // 3. ANIMAÇÃO DE FADE-IN AO ROLAR A TELA (EFEITO VIVO)
    // ==================================================
    var $animatedElements = $('.hidden');
    var $window = $(window);

    function check_if_in_view() {
        var window_height = $window.height();
        var window_top_position = $window.scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        $.each($animatedElements, function() {
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = $element.offset().top;

            if ((element_top_position <= window_bottom_position - 100)) {
                $element.addClass('visible');
                $animatedElements = $animatedElements.not($element);
            }
        });
    }

    $window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');

}); // Fim do $(document).ready()