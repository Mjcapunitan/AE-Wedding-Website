import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Stops the phone's address bar showing/hiding from constantly re-firing the animations
ScrollTrigger.config({ ignoreMobileResize: true });

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const headingRef = useRef(null);
  const titleRef = useRef(null);
  const faqListRef = useRef(null);
  const bottomRef = useRef(null);

  // Each answer is an array of paragraphs so multi-line answers (like the dress code) stay separated.
  const faqs = [
    {
      question: {
        en: "What time should I arrive at the church?",
        tl: "Anong oras po dapat akong dumating sa simbahan?",
      },
      answer: {
        en: [
          "We kindly ask our guests to arrive early. The wedding procession will begin at 12:30 PM, so please be at the church by 12:00 PM to allow enough time for seating.",
        ],
        tl: [
          "Hinihiling po namin sa aming mga bisita na dumating nang maaga. Magsisimula ang prusisyon ng kasal sa ganap na 12:30 PM, kaya't inaanyayahan po namin kayong makarating sa simbahan bago mag-12:00 PM upang magkaroon ng sapat na oras para makaupo nang maayos.",
        ],
      },
    },
    {
      question: {
        en: "What is the dress code?",
        tl: "Ano po ang dress code?",
      },
      answer: {
        en: [
          "We'd love for our guests to dress in formal attire with a light, fresh summer/spring-inspired feel.",
          "Ladies may wear long formal dresses in any color of their choice on the provided color palette. Please do not wear white, which we'd like to reserve for the bride.",
          "Gentlemen may wear formal attire of their choice. We kindly ask that gentlemen avoid gray coats.",
          "Most importantly, come dressed comfortably and ready to celebrate with us!",
        ],
        tl: [
          "Nais po naming makita kayong naka-formal attire na may light at fresh na summer/spring-inspired na look.",
          "Para sa mga babae, maaaring magsuot ng mahahabang formal na damit sa anumang kulay mula sa aming ibinigay na color palette. Mangyaring huwag magsuot ng puti, dahil ang kulay na ito ay para sa bride.",
          "Para naman sa mga lalaki, malaya kayong pumili ng inyong formal attire. Hinihiling lamang po namin na iwasan ang gray na coat.",
          "Higit sa lahat, magsuot ng komportable at handang makipagdiwang kasama namin!",
        ],
      },
    },
    {
      question: {
        en: "Do I have to follow a specific color motif?",
        tl: "Kailangan ko po bang sundin ang isang partikular na color motif?",
      },
      answer: {
        en: [
          "No! We are giving our guests the freedom to choose the color of their attire. As long as it is formal and follows the guidelines above, you're good to go.",
        ],
        tl: [
          "Hindi po! Malaya po kayong pumili ng kulay ng inyong susuotin. Basta't ito ay formal at naaayon sa mga nabanggit na guidelines, ay ayos na po!",
        ],
      },
    },
    {
      question: {
        en: "Can I bring a plus-one?",
        tl: "Maaari po ba akong magdala ng plus-one?",
      },
      answer: {
        en: [
          "We kindly ask that guests only bring a plus-one if it is specifically indicated on their invitation. Our guest list and seating arrangements have been carefully planned, so we won't be able to accommodate additional guests who are not included in the invitation. Thank you so much for understanding!",
        ],
        tl: [
          "Hinihiling po namin na magdala lamang ng plus-one kung ito ay partikular na nakasaad sa inyong invitation. Maingat po naming inayos ang aming guest list at seating arrangements, kaya hindi po namin mapapagbigyan ang mga karagdagang bisita na hindi kasama sa invitation. Maraming salamat po sa inyong pang-unawa!",
        ],
      },
    },
    {
      question: {
        en: "Can I bring my children?",
        tl: "Maaari ko po bang isama ang aking mga anak?",
      },
      answer: {
        en: [
          "We love your little ones! However, because we have a limited number of seats, we kindly ask guests to follow the names indicated on their invitation.",
        ],
        tl: [
          "Mahal po namin ang inyong mga anak! Gayunpaman, dahil limitado ang bilang ng aming mga upuan, hinihiling po namin na sundin kung sino lamang ang mga pangalang nakasaad sa inyong invitation.",
        ],
      },
    },
    {
      question: {
        en: "Is RSVP required?",
        tl: "Kailangan po bang mag-RSVP?",
      },
      answer: {
        en: [
          "Yes, please. Your RSVP will help us finalize our seating, food, and other arrangements. Kindly confirm your attendance by the date indicated.",
        ],
        tl: [
          "Opo, kinakailangan po. Makakatulong ang inyong RSVP upang maayos namin ang aming seating, pagkain, at iba pang preparations para sa kasal. Mangyaring kumpirmahin po ang inyong pagdalo bago ang petsang nakasaad.",
        ],
      },
    },
    {
      question: {
        en: "Will there be parking?",
        tl: "May parking po ba?",
      },
      answer: {
        en: [
          "Yes! Parking spaces are available both at the church and at the reception venue. If you plan to bring your own car, we kindly ask that you inform the bride and groom ahead of time so we can make the necessary parking arrangements.",
        ],
        tl: [
          "Opo! May mga parking spaces po sa simbahan at sa reception venue. Kung plano po ninyong magdala ng sariling sasakyan, hinihiling po namin na ipaalam muna ito sa bride at groom bago ang kasal upang maayos namin ang kinakailangang parking arrangements.",
        ],
      },
    },
    {
      question: {
        en: "Can I take photos during the ceremony?",
        tl: "Maaari po ba akong kumuha ng mga larawan habang seremonya?",
      },
      answer: {
        en: [
          "We'd love for you to capture the memories! However, during the ceremony, we kindly ask that you remain mindful of the couple, the priest, and our official photographers. Please avoid blocking or crossing the aisle, or blocking the photographer's view.",
        ],
        tl: [
          "Gustong-gusto po naming makuha ninyo ang mga masasayang alaala kasama namin! Gayunpaman, habang isinasagawa ang seremonya, hinihiling po namin na maging maingat at magkaroon ng konsiderasyon para sa couple, sa pari, at sa aming official photographers. Mangyaring iwasang humarang o tumawid sa aisle, at huwag harangan ang view ng aming photographer.",
        ],
      },
    },
    {
      question: {
        en: "Can I post photos from the wedding?",
        tl: "Maaari po ba akong mag-post ng mga larawan mula sa kasal?",
      },
      answer: {
        en: [
          "Absolutely! We would be happy to see our celebration through your eyes. Feel free to share your favorite moments and tag us if you'd like.",
        ],
        tl: [
          "Oo naman! Masaya po kaming makita ang aming espesyal na araw mula sa inyong mga kuha at alaala. Malaya po kayong mag-share ng inyong mga paboritong moments at i-tag kami kung nais ninyo.",
        ],
      },
    },
    {
      question: {
        en: "What should I do if I have dietary restrictions?",
        tl: "Ano po ang dapat kong gawin kung mayroon akong dietary restrictions?",
      },
      answer: {
        en: [
          "Please let us know when you RSVP so we can coordinate your meal requirements with the caterer.",
        ],
        tl: [
          "Mangyaring ipaalam po sa amin kapag kayo ay nag-RSVP upang maipagbigay-alam namin sa caterer ang inyong dietary requirements at mga kinakailangang meal arrangements.",
        ],
      },
    },
    {
      question: {
        en: "Who can I contact if I have questions?",
        tl: "Sino po ang maaari kong makontak kung mayroon akong mga katanungan?",
      },
      answer: {
        en: [
          "If you have any questions that aren't answered here, please reach out to our wedding coordinators or the contact person indicated in our wedding website.",
        ],
        tl: [
          "Kung mayroon po kayong mga katanungan na hindi nasagot dito, maaari po kayong makipag-ugnayan sa aming wedding coordinators o sa contact person na nakalagay sa aming wedding website.",
        ],
      },
    },
    {
      question: {
        en: "Most importantly, what should I bring?",
        tl: "At higit sa lahat, ano po ang dapat kong dalhin?",
      },
      answer: {
        en: [
          "Bring your best formal look, your dancing shoes, and lots of love and good vibes!",
        ],
        tl: [
          "Dalhin ang inyong pinakamagandang formal look, inyong dancing shoes, at pagmamahal at good vibes!",
        ],
      },
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index
    );
  };

  useEffect(() => {
    // On phones, animate each item once and leave it visible.
    // On desktop, keep the replay-on-scroll behavior.
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const replay = isMobile
      ? { once: true }
      : { toggleActions: "restart reverse restart reverse" };

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          once: true,
        },
        y: 25,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // FAQ item animations
      const faqItems = faqListRef.current?.children;

      if (faqItems) {
        Array.from(faqItems).forEach((item) => {
          gsap.from(item, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 95%",
              ...replay,
            },
          });
        });
      }

      // Bottom message animation
      gsap.from(bottomRef.current, {
        scrollTrigger: {
          trigger: bottomRef.current,
          start: "top 95%",
          ...replay,
        },
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    });

    
    let cancelled = false;
    let refreshTimer;
    const scheduleRefresh = () => {
      if (cancelled) return;
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    window.addEventListener("load", scheduleRefresh);
    document.fonts?.ready.then(scheduleRefresh);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleRefresh);
      resizeObserver.observe(document.body);
    }

    return () => {
      cancelled = true;
      clearTimeout(refreshTimer);
      window.removeEventListener("load", scheduleRefresh);
      resizeObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section id="faq" className="w-full bg-[#F8F8F6] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[760px] lg:max-w-[1100px]">
        <div className="lg:flex lg:items-start lg:gap-16">
          {/* Column 1: Heading */}
          <div className="mb-8 sm:mb-10 lg:mb-0 lg:flex lg:w-[320px] lg:shrink-0 lg:flex-col lg:items-center lg:text-center">
            <p
              ref={headingRef}
              className="mb-2 text-subtitle tracking-[0.28em] text-subtitle-color uppercase"
            >
              Frequently Asked
            </p>

            <h2
              ref={titleRef}
              className="tracking-[0.18em] text-title text-title-color uppercase"
            >
              Questions
            </h2>

            <p
              lang="tl"
              className="mt-3 text-sm tracking-wide text-[#8A8A8A] italic sm:text-base"
            >
              Mga Madalas Itanong
            </p>
          </div>

          {/* Column 2: FAQ List */}
          <div className="lg:flex-1">
            <div ref={faqListRef} className="w-full">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                const answerId = `faq-answer-${index}`;

                return (
                  <div
                    key={faq.question.en}
                    className="border-b border-[#E7E7E3] bg-white first:border-t"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      className="flex w-full items-center justify-between gap-4 px-4 py-5 text-left sm:px-5 sm:py-6"
                    >
                      {/* Question: English on top, Tagalog below */}
                      <span className="flex flex-col gap-1">
                        <span
                          lang="en"
                          className="text-base leading-relaxed text-[#303030]"
                        >
                          {faq.question.en}
                        </span>
                        <span
                          lang="tl"
                          className="text-sm leading-relaxed text-[#8A8A8A] italic sm:text-base"
                        >
                          {faq.question.tl}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center text-lg font-light text-[#8A8A8A] transition-transform duration-300 ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        +
                      </span>
                    </button>

                    {/* Answer: English on top, Tagalog below */}
                    <div
                      id={answerId}
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 pb-5 pr-12 sm:px-5 sm:pb-6 sm:pr-16">
                          {/* English answer */}
                          <div className="flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#BDBDBD]"
                            />
                            <div
                              lang="en"
                              className="space-y-2 text-sm leading-6 text-[#777777] sm:text-base"
                            >
                              {faq.answer.en.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            </div>
                          </div>

                          {/* Tagalog answer */}
                          <div className="mt-4 flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#BDBDBD]"
                            />
                            <div
                              lang="tl"
                              className="space-y-2 text-sm leading-6 text-[#999999] italic sm:text-base"
                            >
                              {faq.answer.tl.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Message: full-width, centered under both columns */}
        <div ref={bottomRef} className="mt-12 text-center sm:mt-14 lg:mt-16">
          <p className="text-sm leading-6 tracking-wide text-[#8A8A8A] sm:text-base">
            If you have any other questions,
            <br />
            feel free to reach out to us.
          </p>
          <p className="mt-3 text-sm leading-6 tracking-wide text-[#A0A0A0] italic sm:text-base">
            Kung mayroon pa kayong ibang katanungan,
            <br />
            huwag mag-atubiling makipag-ugnayan sa amin.
          </p>

          <div className="mx-auto mt-8 h-px w-9 bg-[#BDBDBD] lg:hidden" />
        </div>
      </div>
    </section>
  );
}
