import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import receptionImage from '../assets/reception.jpg';
import mapIcon from '../assets/map-pin.svg'
import routeIcon from '../assets/venueRouteIcon.svg'

export default function VenueReception() {
  const [elementVisibility, setElementVisibility] = useState(0);
  const hasAnimatedRef = useRef(false);

  const sectionRef = useRef(null);
  const mobileTitleRef = useRef(null);
  const mobileLineRef = useRef(null);
  const imageRef = useRef(null);
  const subtitleRef = useRef(null);
  const lineRef = useRef(null);
  const titleRef = useRef(null);
  const paraRef = useRef(null);
  const addressRowRef = useRef(null);
  const routeRowRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const VIS_RATE = 550;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const enteredBy = Math.max(window.innerHeight - section.getBoundingClientRect().top, 0);
      const visProgress = Math.min(enteredBy / VIS_RATE, 1);

      setElementVisibility(visProgress);
    };

    handleScroll(); // set correct initial value if the page loads mid-scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const isVisible = elementVisibility > 0;

  useLayoutEffect(() => {
    gsap.set(
      [
        mobileTitleRef.current,
        subtitleRef.current,
        titleRef.current,
        paraRef.current,
        addressRowRef.current,
        routeRowRef.current,
        buttonRef.current,
      ],
      { opacity: 0, y: 20 }
    );
    gsap.set([mobileLineRef.current, lineRef.current], { opacity: 0, scaleX: 0 });
    gsap.set(imageRef.current, { opacity: 0, scale: 1.15 });
  }, []);

  useEffect(() => {
    if (!isVisible || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        [
          mobileTitleRef.current,
          subtitleRef.current,
          titleRef.current,
          paraRef.current,
          addressRowRef.current,
          routeRowRef.current,
          buttonRef.current,
        ],
        { opacity: 1, y: 0 }
      );
      gsap.set([mobileLineRef.current, lineRef.current], { opacity: 1, scaleX: 1 });
      gsap.set(imageRef.current, { opacity: 1, scale: 1 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.to(imageRef.current, { opacity: 1, scale: 1, duration: 1.4 })
      .to(mobileTitleRef.current, { opacity: 1, y: 0, duration: 0.9 }, '-=1.1')
      .to(mobileLineRef.current, { opacity: 1, scaleX: 1, duration: 0.7 }, '-=0.8')
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1.1 }, '-=0.9')
      .to(lineRef.current, { opacity: 1, scaleX: 1, duration: 0.9 }, '-=0.65')
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .to(paraRef.current, { opacity: 1, y: 0, duration: 1.1 }, '-=0.5')
      .to(addressRowRef.current, { opacity: 1, y: 0, duration: 1.0 }, '-=0.6')
      .to(routeRowRef.current, { opacity: 1, y: 0, duration: 1.0 }, '-=0.7')
      .to(buttonRef.current, { opacity: 1, y: 0, duration: 1.1 }, '-=0.7');
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="w-full bg-[#eeece8]">
      <div
        className="grid w-full grid-cols-1 bg-white p-4 sm:p-6 md:grid-cols-[55%_45%] md:gap-10 md:p-10 2xl:p-18"
        style={{
          opacity: elementVisibility,
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        aria-hidden={!isVisible}
      >

        {/* =========================
            MOBILE-ONLY TITLE
        ========================= */}
        <div ref={mobileTitleRef} className="order-1 flex flex-col gap-[10px] mt-[20px] md:hidden">
          <p className="uppercase text-subtitle tracking-[0.28em] text-subtitle-color uppercase">Reception</p>

          <div ref={mobileLineRef} className="line w-9 h-[.4px] bg-[#BDBDBD] mb-[15px] md:hidden"></div>

          <h2 className="uppercase text-start text-title max-w-95 text-title-color tracking-[0.18em]">El Jardin<br />De Zaida</h2>
        </div>

        {/* =========================
            RECEPTION VENUE IMAGE
            (2nd on mobile, left side on desktop)
        ========================= */}
        <div className="order-2 md:order-1 h-[390px] w-full overflow-hidden sm:h-[450px] md:h-[580px]">
          <img
            ref={imageRef}
            src={receptionImage}
            alt="El Jardin De Zaida"
            className="block h-full w-full object-cover object-center will-change-transform"
          />
        </div>

        {/* =========================
            RECEPTION VENUE CONTENT
            (3rd/last on mobile, right side on desktop)
        ========================= */}
        <div className="order-3 md:order-2 flex w-full flex-col pb-[20px]">
          <div className="">
            <div className="details-a flex flex-col gap-8 mb-10 md:justify-between md:items-start">
              <p ref={subtitleRef} className="hidden uppercase text-subtitle tracking-[0.28em] text-subtitle-color uppercase md:block">Reception</p>

              <div ref={lineRef} className="line hidden w-9 h-[.5px] bg-[#BDBDBD] md:block"></div>

              <h2 ref={titleRef} className="hidden uppercase text-start text-title max-w-95 text-title-color tracking-[0.18em] md:block lg:max-w-2/3">El Jardin<br />De Zaida</h2>

              <div className="line w-9 h-[.4px] bg-[#BDBDBD] md:hidden xl:w-16"></div>

              <p ref={paraRef} className="text-start text-content tracking-wider lg:max-w-1/2">
                A charming garden venue surrounded by
                nature and beautiful views, the perfect place
                to celebrate the beginning of our forever.
              </p>
            </div>

            {/* Address / Getting There */}
            <div className="flex flex-col gap-10 md:gap-12">
              <div ref={addressRowRef} className="flex flex-row items-start gap-6">
                <div className="h-10 w-10 shrink-0">
                  <img src={mapIcon} alt="Map Icon" />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="m-0 font-sans text-xs font-medium uppercase leading-[1.6] tracking-[0.2em] text-[#555] md:text-sm">
                    Kamagong Pavilion, El Jardin de Zaida
                  </p>

                  <p className="m-0 font-sans text-xs leading-[1.8] tracking-[0.1em] text-[#888] md:text-sm">
                    Abung, San Juan Batangas, Philippines
                  </p>
                </div>
              </div>

              <div ref={routeRowRef} className="flex flex-row items-start gap-6">
                <div className="h-10 w-10 shrink-0">
                  <img src={routeIcon} alt="Route Icon" />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="m-0 font-sans text-xs font-medium uppercase leading-[1.6] tracking-[0.2em] text-[#555] md:text-sm">
                    Getting There
                  </p>

                  <p className="m-0 font-sans text-xs leading-[1.8] tracking-[0.1em] text-[#888] md:text-sm">
                    More information about transportation and directions will be provided soon.
                  </p>
                </div>
              </div>
            </div>

            {/* View on Map Button */}
            <div ref={buttonRef} className="mapButton mt-12 flex justify-center items-center md:mt-16">
              
              <a  href="https://www.google.com/maps/place/El+Jardin+de+Zaida/@13.7708716,121.408538,917m/data=!3m2!1e3!4b1!4m9!3m8!1s0x33bd3a57568dd317:0x43c752940f86f9b3!5m2!4m1!1i2!8m2!3d13.7708664!4d121.4111183!16s%2Fg%2F11c5b7m7sz?entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[50px] w-[400px] items-center justify-center gap-3 bg-[#202223] px-6 font-sans text-[10px] font-normal tracking-[0.3em] text-white transition duration-300 hover:bg-[#3b3d3e] md:h-[52px] md:w-[300px] md:text-[11px]"
              >
                VIEW ON MAP
                <span className="text-lg leading-none tracking-normal">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
