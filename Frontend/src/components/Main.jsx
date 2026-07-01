import React, { useEffect, useState } from 'react';
import FormularioReservaRancho from './FormularioReservaRancho';
import FormularioReservaADomicilio from './FormularioReservaADomicilio';
import closeIcon from '../img/icon-close.png';
import AOS from 'aos';
import GLightbox from 'glightbox';
import Swiper from 'swiper/bundle';
import PureCounter from '@srexi/purecounterjs';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import 'glightbox/dist/css/glightbox.min.css';
import 'swiper/css/bundle';
import '../styles/main.css';

// Images
import img_los_corrales_logo_png from '../img/los-corrales-logo.png';
import img_steak_gril2_png from '../img/steak-gril2.png';
import img_about_2_jpg from '../img/about-2.jpg';
import img_logo_los_corrales_webp from '../img/logo-los-corrales.webp';
import img_logo_parrillada_corrales_webp from '../img/logo-parrillada-corrales.webp';
import img_logo_rancho_corrales_webp from '../img/logo-rancho-corrales.webp';
import img_chefs_chefs_1_jpg from '../img/chefs/chefs-1.jpg';
import img_chefs_chefs_2_jpg from '../img/chefs/chefs-2.jpg';
import img_chefs_chefs_3_jpg from '../img/chefs/chefs-3.jpg';
import img_chefs_chefs_4_jpg from '../img/chefs/chefs-4.jpg';
import img_chefs_chefs_5_jpg from '../img/chefs/chefs-5.jpg';
import img_chefs_chefs_6_jpg from '../img/chefs/chefs-6.jpg';
import img_gallery_gallery_1_jpg from '../img/gallery/gallery-1.jpg';
import img_gallery_gallery_2_jpg from '../img/gallery/gallery-2.jpg';
import img_gallery_gallery_3_jpg from '../img/gallery/gallery-3.jpg';
import img_gallery_gallery_4_jpg from '../img/gallery/gallery-4.jpg';
import img_gallery_gallery_5_jpg from '../img/gallery/gallery-5.jpg';
import img_gallery_gallery_6_jpg from '../img/gallery/gallery-6.jpg';
import img_gallery_gallery_7_jpg from '../img/gallery/gallery-7.jpg';
import img_gallery_gallery_8_jpg from '../img/gallery/gallery-8.jpg';
import img_icons_1_png from '../img/icons-1.png';
import img_icons_2_png from '../img/icons-2.png';
import img_icons_3_png from '../img/icons-3.png';

export default function Main() {
  const [showRanchoForm, setShowRanchoForm] = useState(false);
  const [showDomicilioForm, setShowDomicilioForm] = useState(false);

  useEffect(() => {
    // AOS Init
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    // GLightbox Init
    GLightbox({
      selector: '.glightbox'
    });
    
    // PureCounter Init
    new PureCounter();

    // Swiper slides-3
    new Swiper('.slides-3', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 40 },
        1200: { slidesPerView: 3 }
      }
    });

    // Swiper gallery-slider
    new Swiper('.gallery-slider', {
      speed: 400,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 20 },
        640: { slidesPerView: 3, spaceBetween: 20 },
        992: { slidesPerView: 5, spaceBetween: 20 }
      }
    });

    // Sticky header & Scroll Top
    const selectHeader = document.querySelector('#header');
    const scrollTop = document.querySelector('.scroll-top');

    const handleScroll = () => {
      if (selectHeader) {
        window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
      }
      if (scrollTop) {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
    };

    document.addEventListener('scroll', handleScroll);
    
    // Mobile Nav Toggle
    const mobileNavShow = document.querySelector('.mobile-nav-show');
    const mobileNavHide = document.querySelector('.mobile-nav-hide');
    const body = document.querySelector('body');
    
    const mobileNavToogle = () => {
      body.classList.toggle('mobile-nav-active');
      mobileNavShow.classList.toggle('d-none');
      mobileNavHide.classList.toggle('d-none');
    };

    document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        mobileNavToogle();
      });
    });

    document.querySelectorAll('#navbar a').forEach(navbarlink => {
      if (!navbarlink.hash) return;
      navbarlink.addEventListener('click', () => {
        if (body.classList.contains('mobile-nav-active')) {
          mobileNavToogle();
        }
      });
    });

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header id="header" className="header fixed-top d-flex align-items-center">
    <div className="container d-flex align-items-center justify-content-between">

      <a href="index.html" className="logo d-flex align-items-center me-auto me-lg-0">
        <img src={img_los_corrales_logo_png} alt="Los Corrales Producción Sostenible" />
      </a>

      <nav id="navbar" className="navbar">
        <ul>
          <li><a href="#hero">Inicio</a></li>
          <li><a href="#about">Nosotros</a></li>
          <li><a href="#menu">Servicios</a></li>
          <li><a href="#contact">Contactenos</a></li>
          <li>
            <div className="d-flex" data-aos="fade-left" data-aos-delay="50">
              <a href="#book-a-table" className="btn-book-a-table" onClick={(e) => { e.preventDefault(); setShowRanchoForm(true); }}>COTIZAR</a>
            </div>
          </li>
        </ul>
      </nav>

      <i className="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
      <i className="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>

    </div>
  </header>

  
  <section id="hero" className="hero d-flex align-items-center section-bg">
    <div className="container">
      <div className="row justify-content-between g-1">
        <div
          className="col-lg-3 order-2 order-lg-1 d-flex flex-column justify-content-center align-items-center align-items-lg-start text-center text-lg-start">
          <h2 data-aos="fade-up">Cotizar Evento?</h2>
          <p data-aos="fade-up" data-aos-delay="100">¡Un futuro más saludable y sostenible, comienza en Rancho Los
            Corrales!</p>
          <div className="d-flex" data-aos="fade-up" data-aos-delay="200">
            <a href="#book-a-table" className="btn-book-a-table" onClick={(e) => { e.preventDefault(); setShowDomicilioForm(true); }}>COTIZAR AHORA</a>
          </div>
        </div>
        <div className="col-lg-7 order-1 order-lg-2 text-center text-lg-start">
          <img src={img_steak_gril2_png} className="img-fluid" alt="" data-aos="zoom-out" data-aos-delay="300" />
        </div>
      </div>
    </div>
  </section>
  <main id="main">
    
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="row gy-4">
          <div className="col-lg-7 position-relative about-img bg-about rounded-15" data-aos="fade-up"
            data-aos-delay="150">
            <div className="call-us position-absolute">
              <h4>Contáctenos al<br />
                +(506) 8894 5324</h4>
            </div>
          </div>
          <div className="col-lg-5 d-flex align-items-end" data-aos="fade-up" data-aos-delay="300">
            <div className="content ps-0 ps-lg-5">
              <h2>Nuestra <span>Historia</span></h2>
              <p>
                Parrillada Corrales es una empresa costarricense fundada en la década de los 90 por Fernando Corrales Calderón. Todo comenzó como un pasatiempo familiar preparando tradicionales chicharrones.
              </p>
              <p>
                Hoy en día, se especializan en cortes de cerdo (usando carne de su propia granja, "Corrogres") y ofrecen servicio de parrillada a domicilio o eventos en su rancho. 
              </p>
              <div className="position-relative mt-4">
                <img src={img_about_2_jpg} className="img-fluid rounded-15" alt="video" />
                <a href="https://www.youtube.com/watch?v=ydWhbaWDFiU" className="glightbox play-btn"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section id="stats-counter" className="stats-counter">
      <div className="container" data-aos="zoom-out">

        <div className="row gy-4">

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="30" data-purecounter-duration="1"
                className="purecounter"></span>
              <p>Años de Experiencia</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="20" data-purecounter-duration="1"
                className="purecounter"></span>
              <p>Cantidad Mínima de Personas</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="2000" data-purecounter-duration="1"
                className="purecounter"></span>
              <p>Capacidad Personas</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span data-purecounter-start="0" data-purecounter-end="+3000" data-purecounter-duration="1"
                className="purecounter"></span>
              <p>Eventos realizados</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section id="menu" className="menu">
      <div className="container" data-aos="fade-up">

        <div className="section-header">
          <p><span>Servicios</span></p>
        </div>

        <div className="tab-content" data-aos="fade-up" data-aos-delay="300">

          <div className="tab-pane fade active show" id="menu-starters">
            <div className="row gy-5">

              <div className="col-lg-4 menu-item">
                <a href={img_icons_1_png} className="glightbox"><img src={img_logo_rancho_corrales_webp}
                    className="menu-img2" alt="" /></a>
                <h4>Rancho Corrales</h4>
                <p className="ingredients">
                  Agroturismo Sostenible
                </p>
              </div>

              <div className="col-lg-4 menu-item">
                <a href={img_icons_2_png} className="glightbox"><img
                    src={img_logo_parrillada_corrales_webp} className="menu-img1" alt="" /></a>
                <h4>Parrillada Corrales</h4>
                <p className="ingredients">
                  Tradición y calidad desde 1996
                </p>
              </div>

              <div className="col-lg-4 menu-item">
                <a href={img_icons_3_png} className="glightbox"><img
                    src={img_logo_los_corrales_webp} className="menu-img2" alt="" /></a>
                <h4>Los Corrales</h4>
                <p className="ingredients">
                  Producción Sostenible
                </p>
              </div>
            </div>
          </div>
          <div className="row gy-4 info-services">
            <div className="col-lg-12 d-flex align-items-center">
              <div className="row gy-4">
                <div className="col-xl-4" data-aos="fade-up" data-aos-delay="200">
                  <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                    <p>Salón de eventos para celebraciones y eventos corporativos rodeado de naturaleza y vista al valle
                      de sol, en las montañas de Santa Ana.</p>
                    <a href="https://rancholoscorrales.com/test/" className="btn-menu">Visitar</a>
                  </div>
                </div>

                <div className="col-xl-4" data-aos="fade-up" data-aos-delay="300">
                  <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                    <p>Servicio de parrillada abierta a domicilio, el mejor sabor y calidad para su evento en cualquier
                      parte del país. Cotice cuando guste su evento.</p>
                    <a href="#" className="btn-menu" onClick={(e) => { e.preventDefault(); setShowDomicilioForm(true); }}>Cotizar</a>
                  </div>
                </div>

                <div className="col-xl-4" data-aos="fade-up" data-aos-delay="400">
                  <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                    <p>Somos productores de carne de cerdo bajo estándares de calidad que nos permiten garantizar la
                      trazabilidad, calidad y sostenibilidad de nuestra producción.</p>
                    <a href="https://rancholoscorrales.com/" className="btn-menu">Visitar</a>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          

        </div>

      </div>
    </section>

    
    <section id="events" className="events">
      <div className="container-fluid" data-aos="fade-up">

        <div className="section-header">
          <p>Eventos <span>Especiales</span></p>
        </div>

        <div className="slides-3 swiper" data-aos="fade-up" data-aos-delay="100">
          <div className="swiper-wrapper">

            <div className="swiper-slide event-item d-flex flex-column justify-content-end bg-events-1">
              <h3>Fiestas Privadas</h3>
              <div className="price align-self-start"><a href="#" onClick={(e) => { e.preventDefault(); setShowRanchoForm(true); }}>Cotizar</a></div>
              <p className="description">
                Puedes estimar el precio o bien calendarizar tu evento. Estamos muy cerca de San José a solo 15 minutos.
              </p>
            </div>

            <div className="swiper-slide event-item d-flex flex-column justify-content-end bg-events-2">
              <h3>Parrillas a domicilio</h3>
              <div className="price align-self-start"><a href="#" onClick={(e) => { e.preventDefault(); setShowDomicilioForm(true); }}>Cotizar</a></div>
              <p className="description">
                Consulta el calendario de todas nuestras actividades, donde se dan lugar los parrilleros más adeptos de
                Costa Rica.
              </p>
            </div>

            <div className="swiper-slide event-item d-flex flex-column justify-content-end bg-events-3">
              <h3>Bodas</h3>
              <div className="price align-self-start"><a href="#book-a-table" onClick={(e) => { e.preventDefault(); setShowRanchoForm(true); }}>Cotizar</a></div>
              <p className="description">
                Tenemos todo un servicio completo para ese evento tan importante y especial, solo pregunta sobre
                nuesytos paquetes.
              </p>
            </div>

          </div>
          <div className="swiper-pagination"></div>
        </div>

      </div>
    </section>

    <section id="chefs" className="chefs section-bg">
      <div className="container" data-aos="fade-up">

        <div className="section-header">
          <p><span>Quienes Somos</span></p>
        </div>

        <div className="row gy-4">

          <div className="col-lg-2 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="100">
            <div className="chef-member">
              <div className="member-img">
                <img src={img_chefs_chefs_1_jpg} className="img-fluid" alt="" />

              </div>
              <div className="member-info">
                <h4>Fernando Corrales</h4>
                <span>Fundador</span>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="200">
            <div className="chef-member">
              <div className="member-img">
                <img src={img_chefs_chefs_2_jpg} className="img-fluid" alt="" />

              </div>
              <div className="member-info">
                <h4>Ma. Elena Alpízar</h4>
                <span>Fundadora</span>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="300">
            <div className="chef-member">
              <div className="member-img">
                <img src={img_chefs_chefs_4_jpg} className="img-fluid" alt="" />
              </div>
              <div className="member-info">
                <h4>Marianela Corrales</h4>
                <span>Gerente General</span>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="400">
            <div className="chef-member">
              <div className="member-img">
                <img src={img_chefs_chefs_3_jpg} className="img-fluid" alt="" />
              </div>
              <div className="member-info">
                <h4>Alberto <br /> Corrales</h4>
                <span>Gerente de Producción</span>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="500">
            <div className="chef-member">
              <div className="member-img">
                <img src={img_chefs_chefs_5_jpg} className="img-fluid" alt="" />

              </div>
              <div className="member-info">
                <h4>Marielos Bermúdez</h4>
                <span>Chef / Gerente de Cocina</span>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="600">
            <div className="chef-member">
              <div className="member-img">
                <img src={img_chefs_chefs_6_jpg} className="img-fluid" alt="" />

              </div>
              <div className="member-info">
                <h4>Annelice Corrales</h4>
                <span>Gestora Ambiental</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section id="book-a-table" className="book-a-table d-none-section">
      <div className="container" data-aos="fade-up">

        <div className="section-header">
          <p><span>¿Desea Cotizar Ahora?</span></p>
        </div>

        <div className="row g-0">

          <div className="col-lg-4 reservation-img bg-reservation rounded-left-15" data-aos="zoom-out"
            data-aos-delay="200"></div>

          <div className="col-lg-8 d-flex align-items-center reservation-form-bg">
            <form action="forms/book-a-table.php" method="post" role="form" className="php-email-form" data-aos="fade-up"
              data-aos-delay="100">
              <div className="row gy-4">
                <div className="col-lg-4 col-md-6">
                  <input type="text" name="name" className="form-control" id="name" placeholder="Nombre Completo"
                    data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                  <div className="validate"></div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <input type="email" className="form-control" name="email" id="email" placeholder="Correo Electrónico"
                    data-rule="email" data-msg="Please enter a valid email" />
                  <div className="validate"></div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <input type="text" className="form-control" name="phone" id="phone" placeholder="Teléfono"
                    data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                  <div className="validate"></div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <input type="text" name="date" className="form-control" id="date" placeholder="Fecha" data-rule="minlen:4"
                    data-msg="Please enter at least 4 chars" />
                  <div className="validate"></div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <input type="text" className="form-control" name="time" id="time" placeholder="Hora" data-rule="minlen:4"
                    data-msg="Please enter at least 4 chars" />
                  <div className="validate"></div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <input type="number" className="form-control" name="people" id="people" placeholder="No. Personas"
                    data-rule="minlen:1" data-msg="Please enter at least 1 chars" />
                  <div className="validate"></div>
                </div>
              </div>
              <div className="form-group mt-3">
                <textarea className="form-control" name="message" rows="5"
                  placeholder="Mensaje (indique acá cual servicio desea)"></textarea>
                <div className="validate"></div>
              </div>
              <div className="mb-3">
                <div className="loading">Loading</div>
                <div className="error-message"></div>
                <div className="sent-message">Your booking request was sent. We will call back or send an Email to confirm
                  your reservation. Thank you!</div>
              </div>
              <div className="text-center"><button type="submit">Enviar Cotización</button></div>
            </form>
          </div>

        </div>

      </div>
    </section>

    
    <section id="gallery" className="gallery section-bg">
      <div className="container" data-aos="fade-up">

        <div className="section-header">
          <p className="text-white">Galeria <span>General</span></p>
        </div>

        <div className="gallery-slider swiper">
          <div className="swiper-wrapper align-items-center">
            <div className="swiper-slide"><a className="glightbox" data-gallery="images-gallery"
                href={img_gallery_gallery_1_jpg}><img src={img_gallery_gallery_1_jpg} className="img-fluid"
                  alt="" /></a></div>
            <div className="swiper-slide"><a className="glightbox" data-gallery="images-gallery"
                href={img_gallery_gallery_2_jpg}><img src={img_gallery_gallery_2_jpg} className="img-fluid"
                  alt="" /></a></div>
            <div className="swiper-slide"><a className="glightbox" data-gallery="images-gallery"
                href={img_gallery_gallery_3_jpg}><img src={img_gallery_gallery_3_jpg} className="img-fluid"
                  alt="" /></a></div>
            <div className="swiper-slide"><a className="glightbox" data-gallery="images-gallery"
                href={img_gallery_gallery_4_jpg}><img src={img_gallery_gallery_4_jpg} className="img-fluid"
                  alt="" /></a></div>
            <div className="swiper-slide"><a className="glightbox" data-gallery="images-gallery"
                href={img_gallery_gallery_5_jpg}><img src={img_gallery_gallery_5_jpg} className="img-fluid"
                  alt="" /></a></div>
            <div className="swiper-slide"><a className="glightbox" data-gallery="images-gallery"
                href={img_gallery_gallery_6_jpg}><img src={img_gallery_gallery_6_jpg} className="img-fluid"
                  alt="" /></a></div>
            <div className="swiper-slide"><a className="glightbox" data-gallery="images-gallery"
                href={img_gallery_gallery_7_jpg}><img src={img_gallery_gallery_7_jpg} className="img-fluid"
                  alt="" /></a></div>
            <div className="swiper-slide"><a className="glightbox" data-gallery="images-gallery"
                href={img_gallery_gallery_8_jpg}><img src={img_gallery_gallery_8_jpg} className="img-fluid"
                  alt="" /></a></div>
          </div>
          <div className="swiper-pagination"></div>
        </div>

      </div>
    </section>

    
    <section id="contact" className="contact">
      <div className="container" data-aos="fade-up">

        <div className="section-header">
          <p>¿Ocupas ayuda? <span>Contactanos</span></p>
        </div>

        <div className="mb-3 rounded-15">
          <iframe width="100%" height="400" frameBorder="0" scrolling="no"
          marginHeight="0" marginWidth="0"
          src="https://maps.google.com/maps?q=Rancho+los+Corrales,+San+Jos%C3%A9,+Costa+Rica&amp;hl=es-419&amp;ie=UTF8&amp;sll=37.0625,-95.677068&amp;sspn=40.460237,86.572266&amp;oq=Rancho+los+Corrales&amp;hq=Rancho+los+Corrales,&amp;hnear=San+Jos%C3%A9,+Costa+Rica&amp;t=m&amp;z=12&amp;t=m&amp;z=14&amp;output=embed" className="rounded-15" allowFullScreen></iframe>
        </div>

        <div className="row gy-4">

          <div className="col-md-6">
            <div className="info-item  d-flex align-items-center">
              <i className="icon bi bi-map flex-shrink-0"></i>
              <div>
                <h3>Nuestra Dirección</h3>
                <p>San José, Escazú, 800 sur y 300 oeste de rest Monastere.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="info-item d-flex align-items-center">
              <i className="icon bi bi-envelope flex-shrink-0"></i>
              <div>
                <h3>Email</h3>
                <p>info@parrilladacorrales.com</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="info-item  d-flex align-items-center">
              <i className="icon bi bi-telephone flex-shrink-0"></i>
              <div>
                <h3>Llamenos al</h3>
                <p>+506 8894 5324</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="info-item  d-flex align-items-center">
              <i className="icon bi bi-share flex-shrink-0"></i>
              <div>
                <h3>Horario de Atención</h3>
                <div><strong>Lun-Vie:</strong> 8AM - 6PM<br />
                  <strong> Sáb:</strong> 9AM - 5PM<br />
                  <strong> Dom:</strong> 9AM - 7PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>

  
  <footer id="footer" className="footer">

    <div className="container">
      <div className="row gy-3">
        <div className="col-lg-3 col-md-6 d-flex">
          <i className="bi bi-geo-alt icon"></i>
          <div>
            <h4>Address</h4>
            <p>Rancho Los Corrales,<br />
              Santa Ana, San José, Costa Rica
            </p>
          </div>

        </div>

        <div className="col-lg-3 col-md-6 footer-links d-flex">
          <i className="bi bi-telephone icon"></i>
          <div>
            <h4>Reservations</h4>
            <p>
              <strong>Phone:</strong> +(506) 8894 5324<br />
              <strong>Email:</strong> info@parrilladacorrales.com<br />
            </p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 footer-links d-flex">
          <i className="bi bi-clock icon"></i>
          <div>
            <h4>Horario de Atención</h4>
            <p>
              <strong>Lun-Vie:</strong> 8AM - 6PM<br />
              <strong>Sab:</strong> 9AM - 5PM <br />
              <strong>Dom:</strong> 9AM - 7PM
            </p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 footer-links">
          <h4>Siguenos también en:</h4>
          <div className="social-links d-flex justify-content-center">
            <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
          </div>
        </div>

      </div>
    </div>

    <div className="container">
      <div className="copyright">
        &copy; Copyright <strong><span>Los Corrales</span></strong>. Derechos Reservados
      </div>
      <div className="credits">
        Designed by <a href="https://bootstrapmade.com/">Rancho Los Corrales</a>
      </div>
    </div>

  </footer>

  <a href="#" className="scroll-top d-flex align-items-center justify-content-center"><i
      className="bi bi-arrow-up-short"></i></a>

      {showRanchoForm && (
        <div className="modal-overlay">
          <div className="modal-content-wrapper">
            <button onClick={() => setShowRanchoForm(false)} className="modal-close-btn">
              <img src={closeIcon} alt="Cerrar" className="btn-cerrar-foto" />
            </button>
            <FormularioReservaRancho onCerrar={() => setShowRanchoForm(false)} />
          </div>
        </div>
      )}

      {showDomicilioForm && (
        <div className="modal-overlay">
          <div className="modal-content-wrapper">
            <button onClick={() => setShowDomicilioForm(false)} className="modal-close-btn">
              <img src={closeIcon} alt="Cerrar" className="btn-cerrar-foto" />
            </button>
            <FormularioReservaADomicilio onCerrar={() => setShowDomicilioForm(false)} />
          </div>
        </div>
      )}
    </>
  );
}
