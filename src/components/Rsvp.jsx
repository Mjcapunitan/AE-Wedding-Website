import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQ-uvbeXsESedNXPdeni3KFrR8Q7DzNq95stwXO82uAj1olJg8oU5QXotdN17bexBgfA/exec";

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export default function RSVP() {
  const sectionRef = useRef(null);

  const titleRef = useRef(null);
  const messageRef = useRef(null);
  const deadlineRef = useRef(null);
  const formRef = useRef(null);
  const dividerRef = useRef(null);
  const thankYouRef = useRef(null);
  const namesRef = useRef(null);
  const dateRef = useRef(null);
  const dialogRef = useRef(null);

  const [code, setCode] = useState("");
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [step, setStep] = useState("attend");
  const [choice, setChoice] = useState(null);
  const [dietary, setDietary] = useState("");
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation state
      gsap.set(
        [
          titleRef.current,
          messageRef.current,
          deadlineRef.current,
          formRef.current,
          thankYouRef.current,
          namesRef.current,
          dateRef.current,
        ],
        {
          opacity: 0,
          y: 18,
        }
      );

      gsap.set(dividerRef.current, {
        opacity: 0,
        scaleX: 0,
      });

      // Main entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%"
        },
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      })
        .to(
          messageRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .to(
          deadlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
          },
          "-=0.55"
        )
        .to(
          formRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          dividerRef.current,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.35"
        )
        .to(
          thankYouRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          namesRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          dateRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
          },
          "-=0.5"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Move focus into the popup when it opens.
  useEffect(() => {
    if (guest || isClosed) dialogRef.current?.focus();
  }, [guest, isClosed, step]);

  // Close the popup with Escape.
  useEffect(() => {
    if (!guest && !isClosed) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !saving) {
        setGuest(null);
        setIsClosed(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [guest, isClosed, saving]);

  // Check the code against the Google Sheet.
  const handleCheckCode = async (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your connection and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchWithTimeout(
        `${APPS_SCRIPT_URL}?code=${encodeURIComponent(trimmed)}`
      );

      if (data.closed) {
        setIsClosed(true);
      } else if (data.found) {
        setModalError("");
        // If they've already answered, skip straight to the locked message.
        setStep(data.isAttending ? "locked" : "attend");
        setChoice(null);
        setDietary(data.dietary || "");
        setGuest(data);
      } else {
        setError(
          "We couldn't find that code. Please check your invitation and try again."
        );
      }
    } catch (err) {
      setError(
        err.name === "AbortError"
          ? "This is taking longer than expected. Please check your connection and try again."
          : "Something went wrong. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 1, "Yes": remember the choice and go to the dietary step. Nothing is saved yet.
  const chooseYes = () => {
    setChoice("yes");
    setModalError("");
    setStep("dietary");
  };

  // STEP 1, "No": go to a confirm step instead of saving immediately.
  const chooseNo = () => {
    setModalError("");
    setStep("confirmNo");
  };

  // Dietary step's "Submit" button goes to a confirmation step first — nothing is saved yet.
  const goToConfirm = () => {
    setModalError("");
    setStep("confirm");
  };

  // Saves the response, then shows the final message popup.
  // Called only from the confirm steps (both "yes" and "no" now require confirmation first).
  const saveResponse = async (attending) => {
    if (!navigator.onLine) {
      setModalError("You appear to be offline. Please check your connection and try again.");
      return;
    }

    setSaving(true);
    setModalError("");

    try {
      // text/plain keeps this a "simple" request, which Apps Script accepts from a browser.
      const data = await fetchWithTimeout(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          code: code.trim(),
          attending,
          dietary: attending === "yes" ? dietary.trim() : "",
        }),
      });

      if (data.closed) {
        setGuest(null);
        setIsClosed(true);
        return;
      }
      if (data.alreadyResponded) {
        // Someone else (or another tab) saved a response first.
        setStep("locked");
        return;
      }
      if (!data.ok) throw new Error("Save failed");

      setChoice(attending);
      setStep("done");
      setCode("");
    } catch (err) {
      setModalError(
        err.name === "AbortError"
          ? "This is taking longer than expected. If you already tapped submit once, please check with us before resubmitting."
          : "We couldn't save your response. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      className="w-full px-6 py-16 sm:px-8 sm:py-20"
    >
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center text-center">
        {/* RSVP */}
        <h2
          ref={titleRef}
          className="uppercase tracking-[0.18em] text-title text-title-color"
        >
          RSVP
        </h2>

        {/* MESSAGE */}
        <p
          ref={messageRef}
          className="mt-8 max-w-[360px] text-base leading-7 tracking-wide text-[#858585] sm:mt-10"
        >
          Please let us know if you can
          <br />
          join us on our special day.
        </p>

        {/* DEADLINE */}
        <p
          ref={deadlineRef}
          className="mt-8 text-base tracking-wide text-[#777777] sm:mt-10"
        >
          We kindly ask that you RSVP using your unique code on or before<br/>{" "}
          <span className="text-[#444444]">
            October 30, 2026
          </span>
        </p>

        {/* CODE TEXTBOX + CHECK BUTTON */}
        <form
          ref={formRef}
          onSubmit={handleCheckCode}
          className="mt-10 flex w-full max-w-[360px] flex-col sm:mt-11"
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code"
            aria-label="Invitation code"
            maxLength={40}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            disabled={loading}
            className="
              h-[52px]
              w-full
              border
              border-[#BDBDBD]
              bg-transparent
              px-5
              text-center
              text-[13px]
              uppercase
              tracking-[0.2em]
              text-[#333333]
              placeholder:text-[#AAAAAA]
              focus:border-[#1F1F1F]
              focus:outline-none
              focus-visible:ring-1
              focus-visible:ring-[#1F1F1F]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          />

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="
              group
              mt-3
              flex
              h-[52px]
              w-full
              items-center
              justify-between
              bg-[#1F1F1F]
              px-5
              text-[11px]
              uppercase
              tracking-[0.2em]
              text-white
              transition-colors
              duration-300
              hover:bg-[#2B2B2B]
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {/* Invisible spacer */}
            <span className="w-5" />

            {/* Text */}
            <span>{loading ? "Checking..." : "Check code"}</span>

            {/* Arrow */}
            <span
              aria-hidden="true"
              className="
                w-5
                text-right
                text-[18px]
                font-light
                leading-none
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </button>

          {/* STATUS MESSAGES */}
          <div role="status" aria-live="polite" className="text-center">
            {loading && (
              <p className="pt-4 text-xs tracking-wide text-[#999999]">
                This may take a moment...
              </p>
            )}
            {error && (
              <p className="pt-4 text-sm leading-6 tracking-wide text-[#A23B3B]">
                {error}
              </p>
            )}
          </div>
        </form>

        {/* DIVIDER */}
        <div
          ref={dividerRef}
          className="mt-10 h-px w-10 origin-center bg-[#BDBDBD] sm:mt-12"
        />

        {/* THANK YOU */}
        <div className="mt-9 sm:mt-10">
          <p
            ref={thankYouRef}
            className="text-[13px] uppercase tracking-[0.3em] text-[#777777] sm:text-xs"
          >
            Thank You
          </p>

          <p
            ref={namesRef}
            className="mt-5 text-[13px] uppercase tracking-[0.22em] text-[#333333] sm:text-sm"
          >
            Armand & Edelyn
          </p>

          <p
            ref={dateRef}
            className="mt-2 text-[13px] tracking-[0.3em] text-[#777777] sm:text-xs"
          >
            01.15.2027
          </p>
        </div>
      </div>

      {/* POPUP (rendered on document.body so the GSAP transforms above can't affect it) */}
      {guest &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
            onClick={() => !saving && setGuest(null)}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="rsvp-dialog-title"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-[380px] overflow-y-auto bg-white px-6 py-9 text-center outline-none sm:px-8"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#666666]">
                Dear
              </p>

              <h3
                id="rsvp-dialog-title"
                className="mt-2 text-xl uppercase tracking-[0.18em] text-[#202020]"
              >
                {guest.name}
              </h3>

              {step === "attend" && (
                <>
                  <p className="mt-6 text-base leading-7 tracking-wide text-[#858585]">
                    {guest.rsvpDetails}
                  </p>

                  <p className="mt-6 text-sm leading-6 tracking-wide text-[#444444]">
                    Please confirm if you will attend by clicking “YES” button
                    below; otherwise, click “NO”
                  </p>

                  {modalError && (
                    <p className="mt-4 text-sm tracking-wide text-[#A23B3B]">
                      {modalError}
                    </p>
                  )}

                  <div className="mt-8 flex gap-3">
                    <button
                      type="button"
                      onClick={chooseYes}
                      className="
                        h-[48px]
                        flex-1
                        bg-[#1F1F1F]
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-white
                        transition-colors
                        duration-300
                        hover:bg-[#2B2B2B]
                      "
                    >
                      Yes
                    </button>

                    <button
                      type="button"
                      onClick={chooseNo}
                      className="
                        h-[48px]
                        flex-1
                        border
                        border-[#1F1F1F]
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-[#1F1F1F]
                        transition-colors
                        duration-300
                        hover:bg-[#F2F2F2]
                      "
                    >
                      No
                    </button>
                  </div>
                </>
              )}

              {step === "dietary" && (
                <>
                  <p className="mt-6 text-sm leading-6 tracking-wide text-[#444444]">
                    If you have any dietary restrictions or allergies, please inform us
                    through this RSVP.
                  </p>

                  <textarea
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="Tell us about your dietary restriction (optional)"
                    aria-label="Dietary restriction details"
                    maxLength={300}
                    rows={3}
                    className="
                      mt-4
                      w-full
                      resize-none
                      border
                      border-[#BDBDBD]
                      bg-transparent
                      p-3
                      text-sm
                      leading-6
                      tracking-wide
                      text-[#333333]
                      placeholder:text-[#AAAAAA]
                      focus:border-[#1F1F1F]
                      focus:outline-none
                      focus-visible:ring-1
                      focus-visible:ring-[#1F1F1F]
                    "
                  />

                  <button
                    type="button"
                    onClick={goToConfirm}
                    className="
                      mt-8
                      h-[48px]
                      w-full
                      bg-[#1F1F1F]
                      text-[11px]
                      uppercase
                      tracking-[0.2em]
                      text-white
                      transition-colors
                      duration-300
                      hover:bg-[#2B2B2B]
                    "
                  >
                    Submit my response
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("attend")}
                    className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#777777] transition-colors duration-300 hover:text-[#1F1F1F]"
                  >
                    Back
                  </button>
                </>
              )}

              {step === "confirm" && (
                <>
                  <p className="mt-6 text-base leading-7 tracking-wide text-[#858585]">
                    Are you sure you want to submit this response?
                  </p>

                  <p className="mt-3 text-sm leading-6 tracking-wide text-[#A23B3B]">
                    Once submitted, your answer cannot be changed.
                  </p>

                  {modalError && (
                    <p className="mt-4 text-sm tracking-wide text-[#A23B3B]">
                      {modalError}
                    </p>
                  )}

                  <div className="mt-8 flex gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => setStep("dietary")}
                      className="
                        h-[48px]
                        flex-1
                        border
                        border-[#1F1F1F]
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-[#1F1F1F]
                        transition-colors
                        duration-300
                        hover:bg-[#F2F2F2]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Go back
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => saveResponse("yes")}
                      className="
                        h-[48px]
                        flex-1
                        bg-[#1F1F1F]
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-white
                        transition-colors
                        duration-300
                        hover:bg-[#2B2B2B]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {saving ? "Submitting..." : "Yes, submit"}
                    </button>
                  </div>
                </>
              )}

              {step === "confirmNo" && (
                <>
                  <p className="mt-6 text-base leading-7 tracking-wide text-[#858585]">
                    Are you sure you won’t be able to attend?
                  </p>

                  <p className="mt-3 text-sm leading-6 tracking-wide text-[#A23B3B]">
                    Once submitted, your answer cannot be changed.
                  </p>

                  {modalError && (
                    <p className="mt-4 text-sm tracking-wide text-[#A23B3B]">
                      {modalError}
                    </p>
                  )}

                  <div className="mt-8 flex gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => setStep("attend")}
                      className="
                        h-[48px]
                        flex-1
                        border
                        border-[#1F1F1F]
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-[#1F1F1F]
                        transition-colors
                        duration-300
                        hover:bg-[#F2F2F2]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Go back
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => saveResponse("no")}
                      className="
                        h-[48px]
                        flex-1
                        bg-[#1F1F1F]
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-white
                        transition-colors
                        duration-300
                        hover:bg-[#2B2B2B]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {saving ? "Submitting..." : "Yes, submit"}
                    </button>
                  </div>
                </>
              )}

              {step === "done" && (
                <>
                  <p className="mt-6 text-base leading-7 tracking-wide text-[#858585]">
                    {choice === "yes"
                      ? "Thank you for confirming and see you on Jan 15, 2027!"
                      : "We understand that you won’t be able to join us on our special day. Thank you for letting us know, and please know that you’ll be missed!"}
                  </p>

                  <button
                    type="button"
                    onClick={() => setGuest(null)}
                    className="
                      mt-8
                      h-[48px]
                      w-full
                      bg-[#1F1F1F]
                      text-[11px]
                      uppercase
                      tracking-[0.2em]
                      text-white
                      transition-colors
                      duration-300
                      hover:bg-[#2B2B2B]
                    "
                  >
                    Close
                  </button>
                </>
              )}

              {step === "locked" && (
                <>
                  <p className="mt-6 text-base leading-7 tracking-wide text-[#858585]">
                    You have already submitted your response. Please contact
                    the groom or the bride for changes.
                  </p>

                  <button
                    type="button"
                    onClick={() => setGuest(null)}
                    className="
                      mt-8
                      h-[48px]
                      w-full
                      bg-[#1F1F1F]
                      text-[11px]
                      uppercase
                      tracking-[0.2em]
                      text-white
                      transition-colors
                      duration-300
                      hover:bg-[#2B2B2B]
                    "
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* CLOSED POPUP (shown after the closing date instead of the RSVP popup) */}
      {isClosed &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
            onClick={() => setIsClosed(false)}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="RSVP closed"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-[380px] overflow-y-auto bg-white px-6 py-9 text-center outline-none sm:px-8"
            >
              <p className="text-base leading-7 tracking-wide text-[#858585]">
                Hi! The RSVP form is already closed. If you weren’t able to
                respond earlier, please feel free to message us directly and
                let us know. Thank you so much!
              </p>

              <button
                type="button"
                onClick={() => setIsClosed(false)}
                className="
                  mt-8
                  h-[48px]
                  w-full
                  bg-[#1F1F1F]
                  text-[11px]
                  uppercase
                  tracking-[0.2em]
                  text-white
                  transition-colors
                  duration-300
                  hover:bg-[#2B2B2B]
                "
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}