import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


function SplitLetters({ text }) {
  const words = text.split(' ');

  return (
    <>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split('').map((char, ci) => (
              <span key={ci} className="letter inline-block opacity-0 will-change-transform">
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

export default function Gift() {
  const dateRef = useRef(null);
  const giftTitleRef = useRef(null);
  const giftParaRef = useRef(null);

  const dividerRef = useRef(null);
  const dividerLineLeftRef = useRef(null);
  const dividerLineRightRef = useRef(null);
  const dividerIconRef = useRef(null);

  const noteRef = useRef(null); // wraps note title + paragraphs + signature
  const noteTitleRef = useRef(null);
  const noteParaRef = useRef(null);
  const signatureRef = useRef(null);


  useEffect(() => {
    if (!dateRef.current) return;

    const giftLetters = giftTitleRef.current?.querySelectorAll('.letter');
    const noteLetters = noteTitleRef.current?.querySelectorAll('.letter');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    gsap.set([dateRef.current, giftParaRef.current, noteParaRef.current, signatureRef.current], { opacity: 0, y: 16 });
    if (giftLetters) gsap.set(giftLetters, { opacity: 0, y: 10 });
    if (noteLetters) gsap.set(noteLetters, { opacity: 0, y: 10 });
    gsap.set(dividerLineLeftRef.current, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(dividerLineRightRef.current, { scaleX: 0, transformOrigin: 'right center' });
    gsap.set(dividerIconRef.current, { opacity: 0, scale: 0.8 });

    if (prefersReducedMotion) {
      gsap.set([dateRef.current, giftParaRef.current, noteParaRef.current, signatureRef.current], { opacity: 1, y: 0 });
      if (giftLetters) gsap.set(giftLetters, { opacity: 1, y: 0 });
      if (noteLetters) gsap.set(noteLetters, { opacity: 1, y: 0 });
      gsap.set([dividerLineLeftRef.current, dividerLineRightRef.current], { scaleX: 1 });
      gsap.set(dividerIconRef.current, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: { trigger: dateRef.current, start: 'top 85%', once: true },
        })
        // Header
        .to(dateRef.current, { opacity: 1, y: 0, duration: 1 })
        .to(giftLetters, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04 }, '-=0.55')
        .to(giftParaRef.current, { opacity: 1, y: 0, duration: 1 }, '-=0.4')
        // Divider (starts only after the header group above has finished)
        .to([dividerLineLeftRef.current, dividerLineRightRef.current], { scaleX: 1, duration: 0.9 })
        .to(dividerIconRef.current, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.5')
        // Note (starts only after the divider above has finished)
        .to(noteLetters, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04 })
        .to(noteParaRef.current, { opacity: 1, y: 0, duration: 1.1 }, '-=0.4')
        .to(signatureRef.current, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5');
    });

    return () => ctx.revert();
  }, []);

  return(
    <section id="gifts" className="Gifts w-full min-h-[85vh] bg-[#F8F8F6] py-[30px]">
      <div className="w-full h-full">
        <div className="max-w-full h-full flex flex-col items-end mr-[15px] md:items-center md:mr-[0px]">

          {/* ================= HEADER CENTER ================= */}
          <div className="flex items-start justify-between">

            {/* Date */}
            <div ref={dateRef} className="pt-1 text-2xl tracking-[0.25em] sm:text-3xl">
              01 . 15 . 27
            </div>

          </div>


          {/* ================= GIFT GUIDE ================= */}
          <div className="mt-10 text-right md:text-center">

            <h2 ref={giftTitleRef} className="font-['cursive'] text-2xl italic tracking-wide">
              <SplitLetters text="Gift Guide" />
            </h2>

            <p ref={giftParaRef} className="ml-auto mt-5 max-w-xl  text-sm font-semibold uppercase leading-[1.55] tracking-[0.08em] sm:text-base">
              Your presence at our wedding
              <br />
              is already the greatest gift we could
              <br />
              ask for. Should you wish to bless us
              <br />
              with a gift, a monetary gift toward
              <br />
              our future together
              <br />
              would be sincerely appreciated.
            </p>

          </div>


          {/* ================= DECORATIVE DIVIDER ================= */}
          <div ref={dividerRef} className="relative flex items-center mx-auto my-[40px] w-[85%] md:my-[20px] md:w-[30%] text-stone-500">
            <div ref={dividerLineLeftRef} className="h-px flex-1 bg-current" />

            <svg
              ref={dividerIconRef}
              className="relative z-10 -mx-[1px]"
              width="36"
              height="20"
              viewBox="0 0 36 20"
              fill="none"
            >
              <path
                d="M18 3
                  C15 3 15 7 11 10
                  C15 13 15 17 18 17
                  C21 17 21 13 25 10
                  C21 7 21 3 18 3Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />

              <circle
                cx="18"
                cy="10"
                r="2"
                fill="currentColor"
              />

              <path
                d="M11 10H2M25 10H34"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>

            <div ref={dividerLineRightRef} className="h-px flex-1 bg-current" />
          </div>


          {/* ================= NOTE FROM COUPLE ================= */}
          <div ref={noteRef} className="text-right md:text-center">

            <h2 ref={noteTitleRef} className="font-['cursive'] text-2xl italic tracking-wide">
              <SplitLetters text="A Note from the Couple" />
            </h2>


            <div ref={noteParaRef} className="mt-5 text-sm font-semibold uppercase leading-[1.6] tracking-[0.08em] sm:text-base">

              <p>
                Our hearts are so happy to share
                <br />
                this special chapter with the people
                <br />
                who mean the most to us.
              </p>


              <p className="mt-6">
                Kindly enter the RSVP code personally 
                <br />
                provided by the couple to confirm
                <br />
                your place in our celebration.
              </p>


              <p className="mt-6">
                Your presence will make our day
                <br/>
                even more meaningful, and we cannot
                <br/>
                wait to celebrate love, laughter,
                <br/>
                and the beginning of forever with you.
              </p>

            </div>


            {/* ================= SIGNATURE ================= */}
            <div ref={signatureRef} className="mt-8 text-right md:text-center">

              <p className=" text-sm font-semibold uppercase tracking-[0.08em] sm:text-base">
                With Love,
              </p>

              <p className="mt-5 text-base font-semibold uppercase tracking-[0.08em] sm:text-lg">
                Armand <span className="text-xl">&amp;</span> Edelyn
              </p>

            </div>
          </div>


        </div>
      </div>
    </section>
  )
}
