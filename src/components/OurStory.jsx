import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OurStoryImage from '../assets/OurStoryImage.jpg'

gsap.registerPlugin(ScrollTrigger);

// Splits text into per-letter spans (for the stagger animation) while keeping
// a full, unsplit copy of the text for screen readers.
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

export default function OurStory() {
  const rootRef = useRef(null); // ScrollTrigger anchor
  const imageWrapRef = useRef(null);
  const subtitleRef = useRef(null);
  const lineRef = useRef(null);
  const titleRef = useRef(null);
  const storyRef = useRef(null); // wraps the paragraphs
  const bottomLineRef = useRef(null);
  const bottomTextRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const titleLetters = titleRef.current?.querySelectorAll('.letter');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    gsap.set(imageWrapRef.current, { opacity: 0, scale: 1.06 });
    gsap.set([subtitleRef.current, bottomTextRef.current], { opacity: 0, y: 16 });
    gsap.set(lineRef.current, { opacity: 0, scaleX: 0, transformOrigin: 'left center' });
    gsap.set(bottomLineRef.current, { opacity: 0, scaleX: 0 });
    gsap.set(storyRef.current, { opacity: 0 });
    if (titleLetters) gsap.set(titleLetters, { opacity: 0, y: 10 });

    if (prefersReducedMotion) {
      gsap.set(imageWrapRef.current, { opacity: 1, scale: 1 });
      gsap.set([subtitleRef.current, bottomTextRef.current], { opacity: 1, y: 0 });
      gsap.set([lineRef.current, bottomLineRef.current], { opacity: 1, scaleX: 1 });
      gsap.set(storyRef.current, { opacity: 1 });
      if (titleLetters) gsap.set(titleLetters, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
        })
        // Image
        .to(imageWrapRef.current, { opacity: 1, scale: 1, duration: 1.1 })
        // Section label (starts only after the image above has finished)
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8 })
        .to(lineRef.current, { opacity: 1, scaleX: 1, duration: 0.6 }, '-=0.4')
        // Heading letters
        .to(titleLetters, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04 })
        // Paragraphs (plain fade-in, all together)
        .to(storyRef.current, { opacity: 1, duration: 1 })
        // Bottom decoration
        .to(bottomLineRef.current, { opacity: 1, scaleX: 1, duration: 0.6 })
        .to(bottomTextRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');
    });

    return () => ctx.revert();
  }, []);

  return(
     <section id="our-story" className="ourstory w-full h-full">
      <div ref={rootRef} className="container relative z-10 max-w-full h-full px-4 sm:px-6 md:px-10 2xl:px-18 max-w-380 py-16">
        <div className="wrapper w-full h-full overflow-hidden">
          <div className="grid lg:grid-cols-2">

            {/* =========================
                IMAGE
            ========================== */}
            <div
              ref={imageWrapRef}
              className="relative h-[620px] self-center sm:h-[650px] lg:h-[650px]"
            >
              <img
                src={OurStoryImage}
                alt="Our story"
                className="h-full w-full object-cover object-[40%_center] sm:object-center"
              />

  <div className="absolute inset-0 bg-black/5" />
</div>

            {/* =========================
                STORY CONTENT
            ========================== */}
            <div className="relative flex items-center px-7 py-14 sm:px-12 sm:py-16 lg:px-14 lg:py-20 xl:px-16 min-w-0">

              <div className="relative z-10 w-full max-w-2xl min-w-0">

                {/* Section Label */}
                <div className="mb-6 flex flex-col items-start gap-4">
                  <span ref={subtitleRef} className="text-subtitle uppercase tracking-[0.28em] text-subtitle-color">
                    Our Story
                  </span>

                  <span ref={lineRef} className="line w-9 h-[.5px] bg-[#BDBDBD]" />
                </div>

                {/* Heading */}
                <h2 ref={titleRef} className="max-w-lg text-title uppercase leading-[1.12] tracking-[0.18em] text-title-color">
                  <SplitLetters text="A Simple Beginning," />
                  <br />
                  <SplitLetters text="A Forever to Come" />
                </h2>

                {/* Story */}
                <div ref={storyRef} className="mt-8 space-y-6 text-content tracking-wider text-title-color">
                  
                  <p>
                    What began as a simple date on one rainy afternoon,
                    ordinary meeting and uneventful. The slow and quiet
                    moments that we often mistake as boring, there buds a
                    love story between two dreamers, Armand and Edelyn.
                  </p>

                  <p>
                    Behind the quiet moments they set goals, shared dreams,
                    fought to what they believe even with disagreements,
                    their lives intertwined through shared laughter, joy,
                    struggles and a thousand unspoken moments.
                  </p>

                  <p>
                    We learned that real love isn&apos;t just made of grand
                    gestures or extraordinary milestones—it&apos;s found in
                    the gentle, everyday choice to show up for each other,
                    side by side without compromise and inhibitions.
                  </p>

                  <p>
                    The idea of forever becomes inevitable. On January 15,
                    2027, that choice turns into a lifelong promise as we
                    begin our next chapter as husband and wife.
                  </p>

                  <p>
                    Walking into forever isn&apos;t just about the path ahead,
                    but honoring the journey that brought us here, supported
                    by the people who have filled our story with warmth and
                    joy every step of the way.
                  </p>
                </div>

                {/* Bottom Decoration */}
             {/* Bottom Decoration */}
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4">
                <span
                  ref={bottomLineRef}
                  className="block h-px w-8 bg-[#BDBDBD] sm:w-12"
                />

                <span
                  ref={bottomTextRef}
                  className="text-center text-subtitle uppercase tracking-[0.32em] text-subtitle-color"
                >
                  Same Journey, A Brighter Tomorrow.
                </span>
              </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
