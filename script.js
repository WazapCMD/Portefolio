const root = document.documentElement;
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const magneticItems = document.querySelectorAll(".magnetic");
const spotlightCards = document.querySelectorAll(".spotlight-card");
const counters = document.querySelectorAll("[data-count]");
const typedLines = document.querySelectorAll("[data-typed]");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
    });
}, {
    threshold: 0.18
});

revealItems.forEach((item) => revealObserver.observe(item));

const animateCounter = (element) => {
    const target = Number(element.dataset.count || 0);
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}+`;
        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };

    requestAnimationFrame(tick);
};

counters.forEach((counter) => animateCounter(counter));

window.addEventListener("pointermove", (event) => {
    root.style.setProperty("--glow-x", `${event.clientX}px`);
    root.style.setProperty("--glow-y", `${event.clientY}px`);
});

tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        const rotateX = (((y / rect.height) - 0.5) * -10);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
        card.style.transform = "";
    });
});

magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);

        item.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    item.addEventListener("pointerleave", () => {
        item.style.transform = "";
    });
});

spotlightCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--spot-x", `${x}%`);
        card.style.setProperty("--spot-y", `${y}%`);
    });
});

const sections = [...document.querySelectorAll("main section[id], .contact-strip[id]")];
const navLinks = [...document.querySelectorAll(".nav-links a")];

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", active);
        });
    });
}, {
    threshold: 0.45
});

sections.forEach((section) => sectionObserver.observe(section));

const typeText = (element, text, speed = 36) => new Promise((resolve) => {
    element.textContent = "";
    let index = 0;

    const step = () => {
        element.textContent = text.slice(0, index);
        index += 1;
        if (index <= text.length) {
            setTimeout(step, speed);
        } else {
            resolve();
        }
    };

    step();
});

typedLines.forEach((line) => {
    const initialText = line.dataset.typed || "";
    const sequence = [
        initialText,
        "enumerate_skills --support --infra --cyber",
        "target_role --future pentester"
    ];

    let current = 0;

    const loop = async () => {
        await typeText(line, sequence[current], 34);
        await new Promise((resolve) => setTimeout(resolve, 1400));
        current = (current + 1) % sequence.length;
        loop();
    };

    loop();
});
