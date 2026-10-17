import { createRoot } from "react-dom/client";
import { Closing, Demo, Features, Footer, Hero, HowItWorks, Nav, Numbers, Participation, Problem, Trust } from "./sections";
import "./landing.css";

/* The page is split around the static #koleksi section, which hosts the existing collection map module.
   Each root replaces the static fallback content that landing.html ships for crawlers and no-JS visitors. */
const top = document.getElementById("landing-top");
const bottom = document.getElementById("landing-bottom");

if (top) createRoot(top).render(<><Nav /><Hero /><Problem /><Numbers /><HowItWorks /><Demo /><Features /></>);
if (bottom) createRoot(bottom).render(<><Trust /><Participation /><Closing /><Footer /></>);
document.documentElement.classList.add("landing-ready");
