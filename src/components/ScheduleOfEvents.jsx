import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GuestArrival from '../assets/schedule-guest-arrival.avif';
import Processional from '../assets/schedule-processional.avif';
import WeddingCeremony from '../assets/schedule-wedding-ceremony.avif';
import Portraits from '../assets/schedule-portraits.avif';
import Reception from '../assets/schedule-reception.avif';
import CocktailHour from '../assets/schedule-cocktail-hour.avif';
import TouchUp from '../assets/schedule-touch-up.avif';
import GrandEntrance from '../assets/schedule-grand-entrance.avif';
import Dinner from '../assets/schedule-dinner.avif';
import Closing from '../assets/schedule-closing.avif';

gsap.registerPlugin(ScrollTrigger);

// Color the dots turn once the line reaches them
const REACHED = '#202020';

const q = (root, selector) => gsap.utils.toArray(selector, root);

/* ---------- Splits a heading into per-letter spans for stagger animation ---------- */
function SplitLetters({ text }) {
  const words = text.split(' ');

  return (
    <>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split('').map((char, ci) => (
              <span key={ci} className="letter inline-block will-change-transform">
                {char}
              </span>
            ))}
            {wi < words.length - 1 && '\u00A0'}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

/* ---------- Title: letters fade/rise in once the heading scrolls into view ---------- */
function animateTitle(titleEl) {
  if (!titleEl) return;
  const letters = titleEl.querySelectorAll('.letter');
  if (!letters.length) return;

  gsap.set(letters, { opacity: 0, y: 10 });

  gsap.to(letters, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.03,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: titleEl,
      start: 'top 85%',
      toggleActions: 'play none none none',
      once: true,
    },
  });
}

/* ---------- Mobile: vertical line, draws itself as you scroll down the page ---------- */
function animateMobile(root) {
  const fill = root.querySelector('.line-fill');
  const items = q(root, '.event-item');

  if (!fill || !items.length) return;

  const timeline = gsap.timeline({
    defaults: {
      ease: 'none',
    },
    scrollTrigger: {
      trigger: root,
      start: 'top 65%',
      end: 'bottom 65%',
      scrub: 0.15,
    },
  });

  // Start with the line empty.
  gsap.set(fill, {
    height: 0,
  });

  // Start circles and details hidden.
  items.forEach((item) => {
    const dot = item.querySelector('.event-dot');
    const parts = q(item, '.event-anim');

    gsap.set(dot, {
      backgroundColor: '#6b7280',
      scale: 1,
    });

    gsap.set(parts, {
      autoAlpha: 0,
      x: 24,
    });
  });

  timeline.to(
    fill,
    {
      height: '100%',
      duration: 1,
    },
    0
  );

  const rootHeight = root.offsetHeight;

  items.forEach((item) => {
    const dot = item.querySelector('.event-dot');
    const parts = q(item, '.event-anim');

    const dotPosition =
      item.offsetTop +
      dot.offsetTop +
      dot.offsetHeight / 2;

    const progress = gsap.utils.clamp(
      0,
      1,
      dotPosition / rootHeight
    );

    timeline.to(
      dot,
      {
        backgroundColor: REACHED,
        scale: 1.6,
        duration: 0.04,
        ease: 'back.out(3)',
      },
      progress
    );

    /*
     * Details/icon appear immediately after the circle.
     *
     * Because this is on the same timeline, there is no
     * separate ScrollTrigger that can get out of sync.
     */
    timeline.to(
      parts,
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.08,
        ease: 'power3.out',
        stagger: 0.02,
      },
      progress + 0.01
    );
  });
}

/* ---------- Desktop: horizontal line, plays on its own once the section scrolls into view ---------- */
function animateDesktop(root) {
  const fill = root.querySelector('.line-fill');
  const items = q(root, '.event-item');
  const n = items.length;

  gsap.set(fill, { width: 0 });
  gsap.set(q(root, '.event-anim'), { autoAlpha: 0, y: 20 });

  // Per-event pacing (seconds), independent of scroll distance/speed.
  const STEP = 0.6;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top 70%', // fires once the section is mostly in view
      toggleActions: 'play none none none',
      once: true, // never re-triggers on scroll back up
    },
  });

  tl.to(fill, { width: '100%', duration: n * STEP }, 0);

  items.forEach((item, i) => {
    tl.to(
      item.querySelector('.event-dot'),
      { backgroundColor: REACHED, scale: 1.6, duration: 0.3, ease: 'back.out(3)' },
      i * STEP + STEP * 0.5
    ).to(
      q(item, '.event-anim'),
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
      i * STEP + STEP * 0.55
    );
  });
}

export default function ScheduleOfEvents() {
  const mobileRef = useRef(null);
  const desktopRef = useRef(null);
  const mobileTitleRef = useRef(null);
  const desktopTitleRef = useRef(null);

  const events = [
    {
      time: "12:00 PM",
      title: "Guest arrival & Church assembly",
      icon: GuestArrival,
    },
    {
      time: "12:30 PM",
      title: "Processional",
      icon: Processional,
    },
    {
      time: "1:00 PM",
      title: "Wedding Ceremony",
      icon: WeddingCeremony,
    },
    {
      time: "2:30 PM",
      title: "Church Photos (Family, Friends and Couple)",
      icon: Portraits,
    },
    {
      time: "3:00 PM",
      title: "Reception arrival",
      icon: Reception,
    },
    {
      time: "3:15 PM",
      title: "Welcome & Cocktail hour/ couple post-nuptial photos",
      icon: CocktailHour,
    },
    {
      time: "4:00 PM",
      title: "Couple touch-up",
      icon: TouchUp,
    },
    {
      time: "4:30 PM",
      title: "Grand entrance & start of program",
      icon: GrandEntrance,
    },
    {
      time: "6:00 PM",
      title: "Dinner",
      icon: Dinner,
    },
    {
      time: "7:00 PM",
      title: "Closing remarks & end of program",
      icon: Closing,
    },
  ];

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        mobile: '(max-width: 1023px)',
        desktop: '(min-width: 1024px)',
        motion: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { mobile, desktop, motion } = context.conditions;

        // Reduced motion: leave everything visible and static
        if (!motion) return;

        if (mobile) {
          animateTitle(mobileTitleRef.current);
          animateMobile(mobileRef.current);
        }
        if (desktop) {
          animateTitle(desktopTitleRef.current);
          animateDesktop(desktopRef.current);
        }
      }
    );


    const timer = setTimeout(() => {
      ScrollTrigger.sort(); // order triggers top-to-bottom
      ScrollTrigger.refresh();
    }, 150);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', onLoad);
      mm.revert(); 
    };
  }, []);

  return (
    <div id="schedule" className="SchedOfEvents w-full min-h-[90vh] overflow-x-hidden">
      <div className="container max-w-full min-h-[100vh] flex flex-col justify-center px-4 py-16 sm:px-6 md:py-18 md:px-10 2xl:px-18 bg-[#F8F8F6]">
        <div className="wrapper w-full h-full">
          <div className="mobileVersionHeader lg:hidden flex flex-col gap-2">
            <p className="text-subtitle text-subtitle-color tracking-[.28em]">THE BIG DAY</p>
            <p ref={mobileTitleRef} className="text-title text-title-color tracking-[.18em]">
              <SplitLetters text="SCHEDULE OF EVENTS" />
            </p>
            <div className="line w-9 h-[.5px] bg-[#BDBDBD] md:ml-1"></div>
          </div>

          <div className="mobileVersion my-[30px] lg:hidden">
            <div ref={mobileRef} className="relative">

              {/* Vertical track + fill line */}
              <div className="absolute left-[7px] top-0 bottom-0 w-px bg-neutral-300 ml-[2.5px]">
                <div className="line-fill absolute left-0 top-0 w-full bg-neutral-900" />
              </div>

              {events.map((event) => (
                <div
                  key={event.title}
                  className="event-item relative grid grid-cols-[20px_68px_1fr] gap-x-2 items-center mb-10"
                >

                  {/* Dot */}
                  <div className="relative z-10 flex justify-center">
                    <div className="event-dot h-2 w-2 rounded-full bg-gray-500" />
                  </div>

                  {/* Icon */}
                  <div className="event-anim flex justify-center">
                    <img
                      src={event.icon}
                      alt=""
                      className="h-9 w-9 object-contain"
                    />
                  </div>

                  {/* Event details */}
                  <div className="event-anim flex flex-col items-start">
                    <p className="text-details tracking-widest">
                      {event.time}
                    </p>

                    <h3 className="mt-1 text-content tracking-wide">
                      {event.title}
                    </h3>
                  </div>

                </div>
              ))}
            </div>
          </div>
          <div className="MobileVersionFooter flex flex-col items-center max-w-[250px] mx-auto md:hidden">
              <p className="text-subtitle">LET'S CELEBRATE!</p>
              <div className="line w-9 h-[.5px] bg-[#BDBDBD] mt-8 md:ml-1"></div>
          </div>

          {/* Desktop version */}
          <div ref={desktopRef} className="hidden w-full lg:block">
            <div className="desktopVersion flex w-full flex-col items-center">

              <div className="desktopVersionHeader flex flex-col items-center">
                <p className="text-subtitle text-subtitle-color tracking-[.28em]">THE BIG DAY</p>
                <p ref={desktopTitleRef} className="text-title text-title-color tracking-[.18em]">
                  <SplitLetters text="SCHEDULE OF EVENTS" />
                </p>
                <hr className="my-3 w-6 border-t bg-black" />
              </div>

              {/* Timeline */}
              <div className="relative flex w-full my-[30px]">

                {/* Horizontal track + fill line */}
                <div className="absolute left-0 right-0 top-[4px] h-px bg-neutral-300">
                  <div className="line-fill absolute left-0 top-0 h-full bg-neutral-900" />
                </div>

                {events.map((event) => (
                  <div
                    key={event.title}
                    className="event-item relative flex flex-1 flex-col items-center"
                  >

                    {/* Circle */}
                    <div className="event-dot relative z-10 h-2 w-2 rounded-full border border-neutral-900 bg-gray-500" />

                    {/* Icon */}
                    <div className="event-anim mt-6">
                      <img
                        src={event.icon}
                        alt=""
                        className="h-8 w-8 object-contain"
                      />
                    </div>

                    {/* Event details */}
                    <div className="event-anim mt-3 text-center">
                      <p className="text-sm tracking-widest">
                        {event.time}
                      </p>

                      <h3 className="mt-1 text-base font-medium tracking-wide">
                        {event.title}
                      </h3>
                    </div>

                  </div>
                ))}

              </div>
              <div className="desktopVersionFooter flex flex-col items-center">
                <p className="text-subtitle">LET'S CELEBRATE!</p>
                <div className="line w-9 h-[.5px] bg-[#BDBDBD] mt-8 md:ml-1"></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
