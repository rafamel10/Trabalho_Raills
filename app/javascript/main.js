var Spectral = {
  setup: function() {
    // Selecionar os principais elementos do DOM
    var windowObj = jQuery(window);
    var body = jQuery('body');
    var wrapper = jQuery('#page-wrapper');
    var banner = jQuery('#banner');
    var header = jQuery('#header');

    // Função para lidar com os breakpoints
    var handleBreakpoints = function() {
      var windowWidth = windowObj.width();
      var isMobile = windowWidth <= 480; // Supondo que o breakpoint móvel é de 480px

      body.toggleClass('is-mobile', isMobile);
    };

    // Executar animações iniciais ao carregar a página
    windowObj.on('load', function() {
      setTimeout(function() {
        body.removeClass('is-preload');
      }, 100);
    });

    // Chamar handleBreakpoints inicialmente e em cada redimensionamento da janela
    windowObj.on('resize', handleBreakpoints);
    handleBreakpoints();

    // Inicializar o plugin scrolly para links de rolagem suave
    // Verificar se o plugin está definido antes de usá-lo
    if (jQuery.fn.scrolly) {
      jQuery('.scrolly').scrolly({
        speed: 1500,
        offset: header.outerHeight()
      });
    }

    // Configuração do menu lateral (panel)
    jQuery('#menu')
      .append('<a href="#menu" class="close"></a>')
      .appendTo(body)
      .panel({
        delay: 500,
        hideOnClick: true,
        hideOnSwipe: true,
        resetScroll: true,
        resetForms: true,
        side: 'right',
        target: body,
        visibleClass: 'is-menu-visible'
      });

    // Se houver um banner e o header tiver a classe 'alt', configurar o efeito parallax
    if (banner.length > 0 && header.hasClass('alt')) {
      windowObj.on('resize', function() { windowObj.trigger('scroll'); });

      banner.scrollex({
        bottom: header.outerHeight() + 1,
        terminate: function() { header.removeClass('alt'); },
        enter: function() { header.addClass('alt'); },
        leave: function() { header.removeClass('alt'); }
      });
    }
  }
};

// Iniciar a configuração de Spectral
Spectral.setup();
