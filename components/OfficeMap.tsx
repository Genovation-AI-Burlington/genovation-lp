'use client';

import { useEffect, useRef, useState } from 'react';
import { stamp, track } from '@/lib/analytics';
import { OFFICE } from '@/lib/contact';

/**
 * The office on a map, loaded only when somebody scrolls near it.
 *
 * A Google Maps embed is roughly a megabyte of someone else's script. This page
 * is scored on speed and most visitors never reach the bottom, so the frame is
 * not in the document at all until the section is within a screen or so of the
 * viewport. That is the whole lazy load. The browser's own `loading="lazy"` is
 * deliberately not stacked on top: with both, the frame mounted and then sat
 * empty while the browser made up its own mind, and an empty dark box where a
 * map should be is worse than no map.
 *
 * The address stays underneath the frame the whole time. A visitor whose
 * browser blocks the map, or whose connection never finishes it, reads the
 * address instead of a blank rectangle.
 *
 * A click inside the frame cannot be seen from out here, the map is another
 * site. What can be seen is this window losing focus to the frame, which is
 * what a first tap or drag on the map does. That is reported once.
 */
export default function OfficeMap() {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '700px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!show) return;
    let told = false;
    const onBlur = () => {
      if (told) return;
      if (document.activeElement?.id === 'office-map') {
        told = true;
        track('map_touch', { place: 'office', ...stamp() });
      }
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [show]);

  return (
    <div className="map-frame" ref={box}>
      <p className="map-wait">
        {OFFICE.street}
        <br />
        {OFFICE.city}
      </p>
      {show && (
        <iframe
          id="office-map"
          src={OFFICE.mapEmbed}
          title="Map showing the Genovation AI office in Burlington, Ontario"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
}
