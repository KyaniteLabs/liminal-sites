<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Dev Portfolio</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --text-color: #e2e8f0;
            --accent-color: #38bdf8;
            --card-bg: #1e293b;
            --card-hover: #334155;
            --font-main: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-main);
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Navigation */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 5%;
            position: fixed;
            width: 100%;
            top: 0;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            z-index: 1000;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--accent-color);
        }

        .nav-links a {
            color: var(--text-color);
            text-decoration: none;
            margin-left: 2rem;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--accent-color);
        }

        /* Hero Section */
        .hero {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            padding: 0 1rem;
        }

        .hero h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            background: linear-gradient(90deg, var(--accent-color), #818cf8, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: glow 3s infinite alternate;
        }

        .hero p {
            font-size: 1.5rem;
            max-width: 600px;
            margin-bottom: 2rem;
            color: #94a3b8;
        }

        .btn {
            padding: 0.8rem 2rem;
            background-color: var(--accent-color);
            color: #0f172a;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            transition: transform 0.3s, background 0.3s;
        }

        .btn:hover {
            transform: translateY(-3px);
            background-color: #7dd3fc;
        }

        /* Animated Gradient Blob */
        .blob {
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(15, 23, 42, 0) 70%);
            border-radius: 50%;
            z-index: -1;
            animation: float 10s infinite ease-in-out;
        }

        .blob-2 {
            top: 10%;
            right: 10%;
            animation-delay: 2s;
        }

        /* Projects Section */
        .section {
            padding: 5rem 5%;
        }

        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .project-card {
            background-color: var(--card-bg);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.05);
            transition: transform 0.3s, border-color 0.3s;
            position: relative;
        }

        .project-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent-color);
        }

        .card-content {
            padding: 1.5rem;
        }

        .card-content h3 {
            margin-bottom: 0.5rem;
            color: var(--accent-color);
        }

        .card-content p {
            font-size: 0.9rem;
            color: #94a3b8;
            margin-bottom: 1.5rem;
        }

        .tech-stack {
            display: flex;
            gap: 0.5rem;
            font-size: 0.8rem;
            font-family: monospace;
            color: #64748b;
        }

        /* Contact Section */
        .contact-form {
            max-width: 600px;
            margin: 0 auto;
            background-color: var(--card-bg);
            padding: 2rem;
            border-radius: 12px;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.8rem;
            background-color: var(--bg-color);
            border: 1px solid rgba(255,255,255,0.1);
            color: var(--text-color);
            border-radius: 6px;
            font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--accent-color);
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 2rem;
            border-top: 1px solid rgba(255,255,255,0.1);
            color: #64748b;
        }

        /* Animations */
        @keyframes glow {
            from { filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.5)); }
            to { filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.8)); }
        }

        @keyframes float {
            0% { transform: translate(0, 0); }
            50% { transform: translate(20px, -20px); }
            100% { transform: translate(0, 0); }
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .nav-links { display: none; } /* Simplified for demo */
            .blob { width: 300px; height: 300px; }
        }
    </style>
</head>
<body>

    <nav>
        <div class="logo">&lt;Dev/&gt;</div>
        <div class="nav-links">
            <a href="#hero">Home</a>
            <a href="#projects">Work</a>
            <a href="#contact">Contact</a>
        </div>
    </nav>

    <section id="hero" class="hero">
        <div class="blob"></div>
        <div class="blob blob-2"></div>
        <h1>Building Digital<br>Experiences</h1>
        <p>I'm a creative developer crafting interactive websites and web applications.</p>
        <a href="#projects" class="btn">View Projects</a>
    </section>

    <section id="projects" class="section">
        <h2 class="section-title">Featured Projects</h2>
        <div class="projects-grid">
            <!-- Project 1 -->
            <div class="project-card">
                <div class="card-content">
                    <h3>E-Commerce Dashboard</h3>
                    <p>A full-stack dashboard for managing online stores with real-time analytics and user authentication.</p>
                    <div class="tech-stack">
                        <span>React</span>
                        <span>Tailwind</span>
                        <span>Node.js</span>
                    </div>
                </div>
            </div>

            <!-- Project 2 -->
            <div class="project-card">
                <div class="card-content">
                    <h3>Neon Portfolio</h3>
                    <p>A minimalist, dark-themed portfolio with smooth scroll animations and responsive layout.</p>
                    <div class="tech-stack">
                        <span>HTML/CSS</span>
                        <span>GSAP</span>
                        <span>Sass</span>
                    </div>
                </div>
            </div>

            <!-- Project 3 -->
            <div class="project-card">
                <div class="card-content">
                    <h3>Task Manager API</h3>
                    <p>A robust REST API for team collaboration with drag-and-drop task management features.</p>
                    <div class="tech-stack">
                        <span>Python</span>
                        <span>Django</span>
                        <span>PostgreSQL</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="section">
        <h2 class="section-title">Get In Touch</h2>
        <form class="contact-form">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" placeholder="Your Name">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Your Email">
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" rows="5" placeholder="How can I help you?"></textarea>
            </div>
            <button type="submit" class="btn" style="width: 100%; border: none; cursor: pointer;">Send Message</button>
        </form>
    </section>

    <footer>
        <p>&copy; 2023 Creative Developer Portfolio. Built with Code.</p>
    </footer>

    <script>
        // Simple scroll effect for nav bar
        window.addEventListener('scroll', function() {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(15, 23, 42, 1)';
                nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            } else {
                nav.style.background = 'rgba(15, 23, 42, 0.8)';
                nav.style.boxShadow = 'none';
            }
        });
    </script>
</body>
</html>