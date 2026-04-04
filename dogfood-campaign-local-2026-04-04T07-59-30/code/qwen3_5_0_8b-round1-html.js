<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevPortfolio | Creative Coding</title>
    <style>
        /* --- CSS VARIABLES & RESET --- */
        :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #38bdf8; /* Cyan */
            --accent-glow: rgba(56, 189, 248, 0.3);
            --gradient: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* --- ANIMATED BACKGROUND --- */
        .ambient-light {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        }

        .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.6;
            animation: float 10s infinite ease-in-out;
        }

        .orb-1 {
            width: 500px;
            height: 500px;
            background: var(--accent);
            top: -100px;
            left: -100px;
            animation-delay: 0s;
        }

        .orb-2 {
            width: 400px;
            height: 400px;
            background: #4f46e5;
            bottom: 10%;
            right: -50px;
            animation-delay: -5s;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, 50px); }
        }

        /* --- NAVIGATION --- */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 5%;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 100;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            background: var(--gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-links a {
            color: var(--text-main);
            text-decoration: none;
            margin-left: 2rem;
            font-weight: 500;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: var(--accent);
        }

        /* --- HERO SECTION --- */
        .hero {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0 20px;
            position: relative;
        }

        .hero h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            line-height: 1.1;
        }

        .hero h1 span {
            color: var(--accent);
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 600px;
            margin-bottom: 2.5rem;
        }

        .cta-button {
            padding: 1rem 2.5rem;
            background: var(--gradient);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
            border: none;
            cursor: pointer;
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px var(--accent-glow);
        }

        /* --- PROJECTS SECTION --- */
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
            background: var(--card-bg);
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.05);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .card-img {
            height: 200px;
            background: linear-gradient(45deg, #38bdf8, #818cf8);
            width: 100%;
            position: relative;
        }

        .card-content {
            padding: 1.5rem;
        }

        .card-content h3 {
            margin-bottom: 0.5rem;
        }

        .card-content p {
            color: var(--text-muted);
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
        }

        .card-link {
            color: var(--accent);
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            margin-top: 1rem;
        }

        /* --- CONTACT SECTION --- */
        .contact-container {
            max-width: 600px;
            margin: 0 auto;
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 8px;
            color: white;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--accent);
        }

        .submit-btn {
            width: 100%;
            padding: 1rem;
            background: var(--gradient);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        .submit-btn:hover {
            background: #60a5fa;
        }

        /* --- FOOTER --- */
        footer {
            text-align: center;
            padding: 2rem;
            color: var(--text-muted);
            font-size: 0.9rem;
            border-top: 1px solid rgba(255,255,255,0.05);
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .nav-links { display: none; } /* Simplified for demo */
            .projects-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

    <!-- Ambient Background -->
    <div class="ambient-light">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
    </div>

    <!-- Navigation -->
    <nav>
        <div class="logo">DevPortfolio.</div>
        <div class="nav-links">
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <h1>Building digital <br> <span>experiences.</span></h1>
        <p>I am a creative developer specializing in building modern, accessible, and interactive web applications.</p>
        <a href="#projects" class="cta-button">View My Work</a>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="section">
        <h2 class="section-title">Featured Projects</h2>
        <div class="projects-grid">
            <!-- Project 1 -->
            <article class="project-card">
                <div class="card-img"></div>
                <div class="card-content">
                    <h3>E-Commerce Dashboard</h3>
                    <p>A comprehensive dashboard for managing online store inventory and customer analytics.</p>
                    <a href="#" class="card-link">View Case Study &rarr;</a>
                </div>
            </article>

            <!-- Project 2 -->
            <article class="project-card">
                <div class="card-img"></div>
                <div class="card-content">
                    <h3>Task Manager UI</h3>
                    <p>A sleek task management interface designed for productivity with drag-and-drop capabilities.</p>
                    <a href="#" class="card-link">View Case Study &rarr;</a>
                </div>
            </article>

            <!-- Project 3 -->
            <article class="project-card">
                <div class="card-img"></div>
                <div class="card-content">
                    <h3>Portfolio Site</h3>
                    <p>A responsive portfolio website featuring portfolio projects, contact info, and social links.</p>
                    <a href="#" class="card-link">View Case Study &rarr;</a>
                </div>
            </article>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section">
        <div class="contact-container">
            <h2 class="section-title" style="text-align: left;">Let's Connect</h2>
            <p style="margin-bottom: 2rem; color: var(--text-muted);">Have a project in mind? I'd love to hear from you.</p>
            
            <form>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Your Name">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Your Email">
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <textarea rows="4" placeholder="Tell me about your project..."></textarea>
                </div>
                <button type="submit" class="submit-btn">Send Message</button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>&copy; 2023 DevPortfolio. Built with HTML & CSS.</p>
    </footer>

</body>
</html>