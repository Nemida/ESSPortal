import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";


const useAutoScroll = (
  ref,
  dependencies = [],
  options = { direction: "horizontal", delay: 3000 }
) => {
  const { direction, delay } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.children || el.children.length <= 1) return;

    let interval;
    let index = 0;
    const items = Array.from(el.children);

    const startScrolling = () => {
      stopScrolling();

      if (direction === "horizontal") {
        interval = setInterval(() => {
          index = (index + 1) % items.length;
          el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
        }, delay);
      } else if (direction === "vertical") {
        interval = setInterval(() => {
          index = (index + 1) % items.length;
          const targetTop = index === 0 ? 0 : items[index].offsetTop;
          el.scrollTo({ top: targetTop, behavior: "smooth" });
        }, delay);
      }
    };

    const stopScrolling = () => clearInterval(interval);

    startScrolling();
    el.addEventListener("mouseenter", stopScrolling);
    el.addEventListener("mouseleave", startScrolling);

    return () => {
      stopScrolling();
      el.removeEventListener("mouseenter", stopScrolling);
      el.removeEventListener("mouseleave", startScrolling);
    };
  }, [ref, direction, delay, ...dependencies]);
};

const HomePage = () => {
  const galleryRef = useRef(null);
  const announcementsRef = useRef(null);

  const [galleryImages, setGalleryImages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [publications, setPublications] = useState([]);

  useAutoScroll(galleryRef, [galleryImages.length], { direction: "horizontal", delay: 3000 });
  useAutoScroll(announcementsRef, [announcements.length], { direction: "vertical", delay: 5000 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, pubsRes, announcementsRes, imagesRes] = await Promise.all([
          api.get("/api/events"),
          api.get("/api/publications"),
          api.get("/api/announcements"),
          api.get("/api/key-moments"),
        ]);

        setEvents(eventsRes.data.slice(0, 2));
        setPublications(pubsRes.data.slice(0, 3));
        setAnnouncements(announcementsRes.data);
        setGalleryImages(imagesRes.data);
      } catch (err) {
        console.error("Failed to fetch data for homepage", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 flex flex-col gap-8 font-sans">
  
      <div className="flex flex-col lg:flex-row gap-6">
        
   
        <section className="flex-1 bg-white rounded shadow p-4 relative h-[380px]">
          <h2 className="text-lg font-semibold border-b pb-2 mb-3 text-[#2c3e50]">
            Key Moments
          </h2>
          <div
            ref={galleryRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-[calc(100%-52px)] no-scrollbar"
          >
            {galleryImages.map((img) => (
              <div
                key={img.image_id}
                className="min-w-full h-full flex-shrink-0 snap-start"
              >
                <img
                  src={img.image_url.startsWith('http') ? img.image_url : `/${img.image_url}`}
                  alt={img.alt_text}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        </section>

    
        <section className="flex-1 bg-white rounded shadow p-4 h-[380px] overflow-hidden">
          <h2 className="text-lg font-semibold border-b pb-2 mb-3 text-[#2c3e50]">
            Announcements
          </h2>
          <div
            ref={announcementsRef}
            className="pr-2 h-[calc(100%-52px)] overflow-y-auto no-scrollbar"
          >
            {announcements.map((item) => (
              <div
                key={item.announcement_id}
                className="mb-4 border-b pb-3 last:border-none"
              >
                <div className="text-xs text-gray-500">{item.date}</div>
                <h3 className="font-semibold text-[#2c3e50]">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

     
        <section className="flex-1 bg-white rounded shadow p-4 h-[380px] overflow-y-auto">
          <h2 className="text-lg font-semibold border-b pb-2 mb-3 text-[#2c3e50]">
            Services
          </h2>
          <ul>
            {[
              { name: "Forms", link: "/forms", desc: "Browse the various forms." },
              { name: "IT Asset Management", link: "/assets", desc: "Track your software licenses." },
              { name: "Grievance Portal", link: "/grievance", desc: "Raise grievances on the portal." },
            ].map((service, idx) => (
              <li
                key={idx}
                className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition"
              >
                <Link
                  to={service.link}
                  className="font-medium text-[#2c3e50] hover:text-blue-600"
                >
                  {service.name}
                </Link>
                <p className="text-xs text-gray-500 mt-1">{service.desc}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

   
      <section className="bg-white rounded shadow p-6">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#2c3e50]">
              About DRDO — Scientific Analysis Group
            </h2>
            <p className="mt-3 text-gray-700">
              The Scientific Analysis Group advances cryptology, communications
              security, and information assurance to bolster mission-readiness
              and national security.
            </p>
            <Link
              to="/about"
              className="inline-block mt-5 px-5 py-2 rounded bg-[#2c3e50] text-white hover:bg-[#34495e]"
            >
              Learn more
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Secure Comms", "Quantum-safe cryptography."],
              ["EW & Spectrum", "Electronic warfare systems."],
              ["AI & Analytics", "Decision support and automation."],
              ["Materials & Sensors", "Advanced sensing and composites."],
            ].map(([title, desc], i) => (
              <div key={i} className="p-4 bg-gray-50 rounded border">
                <h3 className="font-semibold text-[#2c3e50]">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold text-[#2c3e50]">Research Areas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {[
            { title: "Aeronautics", desc: "Developing advanced aircraft and UAVs." },
            { title: "Armaments", desc: "Weapons and combat vehicle systems." },
            { title: "Electronics", desc: "Radars, EW, and communication tech." },
            { title: "Missiles", desc: "Strategic and tactical missile systems." },
          ].map((card, i) => (
            <div
              key={i}
              className="p-5 bg-gray-50 rounded border hover:shadow transition"
            >
              <h3 className="font-semibold text-[#2c3e50]">{card.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{card.desc}</p>
              <Link to="/research" className="inline-block mt-3 text-blue-700 hover:underline">
                Explore
              </Link>
            </div>
          ))}
        </div>
      </section>

     
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold text-[#2c3e50]">
          Publications & Resources
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          {publications.map((item) => (
            <div
              key={item.publication_id}
              className="p-5 bg-gray-50 rounded border hover:shadow transition"
            >
              <h3 className="font-semibold text-[#2c3e50]">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              <Link to={item.link} className="inline-block mt-3 text-blue-700 hover:underline">
                View
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold text-[#2c3e50]">Events</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {events.map((event) => (
            <div key={event.event_id} className="flex border rounded overflow-hidden">
              <div className="bg-[#2c3e50] text-white p-5 min-w-[84px] text-center">
                <span className="block text-2xl font-bold">{event.day}</span>
                <span className="block -mt-1">{event.month}</span>
              </div>
              <div className="p-5 flex-1">
                <h3 className="font-semibold text-[#2c3e50]">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                <Link
                  to="/events"
                  className="inline-block mt-3 px-4 py-2 bg-[#2c3e50] text-white rounded hover:bg-[#34495e]"
                >
                  Register
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="rounded p-6 bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">Made by Aditya Menon.</h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
