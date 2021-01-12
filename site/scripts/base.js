const btn = document.getElementById('btn');
const body = document.querySelector('body');

btn.addEventListener('click', () => {
  btn.classList.toggle('btn--checked')
  body.classList.toggle('dark-edition');
})

$(document).ready(function() {
    $().ready(function() {
      $sidebar = $('.sidebar');

      $sidebar_img_container = $sidebar.find('.sidebar-background');

      $full_page = $('.full-page');

      $sidebar_responsive = $('body > .navbar-collapse');

      window_width = $(window).width();

      $('.fixed-plugin a').click(function(event) {
        if ($(this).hasClass('switch-trigger')) {
          if (event.stopPropagation) {
            event.stopPropagation();
          } else if (window.event) {
            window.event.cancelBubble = true;
          }
        }
      });

      $('.fixed-plugin .active-color span').click(function() {
        $full_page_background = $('.full-page-background');

        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var new_color = $(this).data('color');

        if ($sidebar.length != 0) {
          $sidebar.attr('data-color', new_color);
        }

        if ($full_page.length != 0) {
          $full_page.attr('filter-color', new_color);
        }

        if ($sidebar_responsive.length != 0) {
          $sidebar_responsive.attr('data-color', new_color);
        }
      });

      $('.fixed-plugin .background-color .badge').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var new_color = $(this).data('background-color');

        if ($sidebar.length != 0) {
          $sidebar.attr('data-background-color', new_color);
        }
      });

      $('.fixed-plugin .img-holder').click(function() {
        $full_page_background = $('.full-page-background');

        $(this).parent('li').siblings().removeClass('active');
        $(this).parent('li').addClass('active');


        var new_image = $(this).find("img").attr('src');

        if ($sidebar_img_container.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
          $sidebar_img_container.fadeOut('fast', function() {
            $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
            $sidebar_img_container.fadeIn('fast');
          });
        }

        if ($full_page_background.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
          var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

          $full_page_background.fadeOut('fast', function() {
            $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
            $full_page_background.fadeIn('fast');
          });
        }

        if ($('.switch-sidebar-image input:checked').length == 0) {
          var new_image = $('.fixed-plugin li.active .img-holder').find("img").attr('src');
          var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

          $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
          $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
        }

        if ($sidebar_responsive.length != 0) {
          $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
        }
      });

      $('.switch-sidebar-image input').change(function() {
        $full_page_background = $('.full-page-background');

        $input = $(this);

        if ($input.is(':checked')) {
          if ($sidebar_img_container.length != 0) {
            $sidebar_img_container.fadeIn('fast');
            $sidebar.attr('data-image', '#');
          }

          if ($full_page_background.length != 0) {
            $full_page_background.fadeIn('fast');
            $full_page.attr('data-image', '#');
          }

          background_image = true;
        } else {
          if ($sidebar_img_container.length != 0) {
            $sidebar.removeAttr('data-image');
            $sidebar_img_container.fadeOut('fast');
          }

          if ($full_page_background.length != 0) {
            $full_page.removeAttr('data-image', '#');
            $full_page_background.fadeOut('fast');
          }

          background_image = false;
        }
      });

      $('.switch-sidebar-mini input').change(function() {
        $body = $('body');

        $input = $(this);

        if (md.misc.sidebar_mini_active == true) {
          $('body').removeClass('sidebar-mini');
          md.misc.sidebar_mini_active = false;

          $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

        } else {

          $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar('destroy');

          setTimeout(function() {
            $('body').addClass('sidebar-mini');

            md.misc.sidebar_mini_active = true;
          }, 300);
        }

        var simulateWindowResize = setInterval(function() {
          window.dispatchEvent(new Event('resize'));
        }, 180);

        setTimeout(function() {
          clearInterval(simulateWindowResize);
        }, 1000);

      });
    });
  });

  // (function() {
  //   isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
  
  //   if (isWindows) {
  //     // if we are on windows OS we activate the perfectScrollbar function
  //     $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
  
  //     $('html').addClass('perfect-scrollbar-on');
  //   } else {
  //     $('html').addClass('perfect-scrollbar-off');
  //   }
  // })();
  
  
  var breakCards = true;
  
  var searchVisible = 0;
  var transparent = true;
  
  var transparentDemo = true;
  var fixedTop = false;
  
  var mobile_menu_visible = 0,
    mobile_menu_initialized = false,
    toggle_initialized = false,
    bootstrap_nav_initialized = false;
  
  var seq = 0,
    delays = 80,
    durations = 500;
  var seq2 = 0,
    delays2 = 80,
    durations2 = 500;
  
  $(document).ready(function() {
  
    $('body').bootstrapMaterialDesign();
  
    $sidebar = $('.sidebar');
  
    md.initSidebarsCheck();
  
    window_width = $(window).width();
  
    // check if there is an image set for the sidebar's background
    md.checkSidebarImage();
  
    //    Activate bootstrap-select
    if ($(".selectpicker").length != 0) {
      $(".selectpicker").selectpicker();
    }
  
    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();
  
    $('.form-control').on("focus", function() {
      $(this).parent('.input-group').addClass("input-group-focus");
    }).on("blur", function() {
      $(this).parent(".input-group").removeClass("input-group-focus");
    });
  
    // remove class has-error for checkbox validation
    $('input[type="checkbox"][required="true"], input[type="radio"][required="true"]').on('click', function() {
      if ($(this).hasClass('error')) {
        $(this).closest('div').removeClass('has-error');
      }
    });
  
  });
  
  $(document).on('click', '.navbar-toggler', function() {
    $toggle = $(this);
  
    if (mobile_menu_visible == 1) {
      $('html').removeClass('nav-open');
  
      $('.close-layer').remove();
      setTimeout(function() {
        $toggle.removeClass('toggled');
      }, 400);
  
      mobile_menu_visible = 0;
    } else {
      setTimeout(function() {
        $toggle.addClass('toggled');
      }, 430);
  
      var $layer = $('<div class="close-layer"></div>');
  
      if ($('body').find('.main-panel').length != 0) {
        $layer.appendTo(".main-panel");
  
      } else if (($('body').hasClass('off-canvas-sidebar'))) {
        $layer.appendTo(".wrapper-full-page");
      }
  
      setTimeout(function() {
        $layer.addClass('visible');
      }, 100);
  
      $layer.click(function() {
        $('html').removeClass('nav-open');
        mobile_menu_visible = 0;
  
        $layer.removeClass('visible');
  
        setTimeout(function() {
          $layer.remove();
          $toggle.removeClass('toggled');
  
        }, 400);
      });
  
      $('html').addClass('nav-open');
      mobile_menu_visible = 1;
  
    }
  
  });
  
  // activate collapse right menu when the windows is resized
  $(window).resize(function() {
    md.initSidebarsCheck();
  
    // reset the seq for charts drawing animations
    seq = seq2 = 0;
  
    setTimeout(function() {
      md.initDashboardPageCharts();
    }, 500);
  });
  
  
  
  md = {
    misc: {
      navbar_menu_visible: 0,
      active_collapse: true,
      disabled_collapse_init: 0
    },
  
    checkSidebarImage: function() {
      $sidebar = $('.sidebar');
      image_src = $sidebar.data('image');
  
      if (image_src !== undefined) {
        sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>';
        $sidebar.append(sidebar_container);
      }
    },
  
    initSidebarsCheck: function() {
      if ($(window).width() <= 991) {
        if ($sidebar.length != 0) {
          md.initRightMenu();
        }
      }
    },
  
    initDashboardPageCharts: function() {
  
      if ($('#dailySalesChart').length != 0 || $('#completedTasksChart').length != 0 || $('#websiteViewsChart').length != 0) {
        /* ----------==========     Daily Sales Chart initialization    ==========---------- */
  
        dataDailySalesChart = {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
            [12, 17, 7, 17, 23, 18, 38]
          ]
        };
  
        optionsDailySalesChart = {
          lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
        }
  
        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
  
        md.startAnimationForLineChart(dailySalesChart);
  
  
        /* ----------==========     Completed Tasks Chart initialization    ==========---------- */
  
        dataCompletedTasksChart = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
            [230, 750, 450, 300, 280, 240, 200, 190]
          ]
        };
  
        optionsCompletedTasksChart = {
          lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
  
        var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);
  
        // start animation for the Completed Tasks Chart - Line Chart
        md.startAnimationForLineChart(completedTasksChart);
  
  
        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */
  
        var dataWebsiteViewsChart = {
          labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]
  
          ]
        };
        var optionsWebsiteViewsChart = {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        };
        var responsiveOptions = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function(value) {
                return value[0];
              }
            }
          }]
        ];
        var websiteViewsChart = Chartist.Bar('#websiteViewsChart', dataWebsiteViewsChart, optionsWebsiteViewsChart, responsiveOptions);
  
        md.startAnimationForBarChart(websiteViewsChart);
      }
    },
  
    showNotification: function(from, align, typeS, messageS) {
      type = ['', 'info', 'danger', 'success', 'warning', 'primary'];

      $.notify({
        icon: "add_alert",
        message: messageS,
      }, {
        type: type[type.indexOf(typeS)],
        timer: 3000,
        placement: {
          from: from,
          align: align
        }
      });
    },

    showProgressBar: function(message, dismiss=false) {
      return $.notify(message, {allow_dismiss: dismiss, showProgressBar: true})
    },
  
    checkScrollForTransparentNavbar: debounce(function() {
      if ($(document).scrollTop() > 260) {
        if (transparent) {
          transparent = false;
          $('.navbar-color-on-scroll').removeClass('navbar-transparent');
        }
      } else {
        if (!transparent) {
          transparent = true;
          $('.navbar-color-on-scroll').addClass('navbar-transparent');
        }
      }
    }, 17),
  
  
    startAnimationForLineChart: function(chart) {
      chart.on('draw', function(data) {
        if ((data.type === 'line' || data.type === 'area') && window.matchMedia("(min-width: 900px)").matches) {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if (data.type === 'point') {
          seq++;
          data.element.animate({
            opacity: {
              begin: seq * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: 'ease'
            }
          });
        }
  
      });
  
      seq = 0;
  
    },
    startAnimationForBarChart: function(chart) {
      chart.on('draw', function(data) {
        if (data.type === 'bar' && window.matchMedia("(min-width: 900px)").matches) {
          seq2++;
          data.element.animate({
            opacity: {
              begin: seq2 * delays2,
              dur: durations2,
              from: 0,
              to: 1,
              easing: 'ease'
            }
          });
        }
  
      });
  
      seq2 = 0;
  
    }
  }
  
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  };