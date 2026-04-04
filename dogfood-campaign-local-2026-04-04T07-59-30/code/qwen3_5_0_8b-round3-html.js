<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Developer Portfolio</title>
    <style>
        /* --- CSS Reset & Variables --- */
        :root {
            --bg-color: #0f172a;
            --card-bg: #1e293b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent-primary: #38bdf8;
            --accent-secondary: #a855f7;
            --accent-glow: rgba(56, 189, 248, 0.2);
            --font-main: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-main);
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
            overflow-x: hidden;
        }

        a { text-decoration: none; color: inherit; transition: 0.3s; }
        ul { list-style: none; }
        img { max-width: 100%; display: block; }

        /* --- Navigation --- */
        nav {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 1.5rem 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            z-index: 1000;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -1px;
            background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            color: var(--text-muted);
            font-size: 0.95rem;
            font-weight: 500;
        }

        .nav-links a:hover {
            color: var(--text-main);
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background: var(--accent-primary);
            color: var(--bg-color);
            border: none;
        }

        .btn-primary:hover {
            background: #22d3ee;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px var(--accent-glow);
        }

        /* --- Hero Section --- */
        .hero {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0 1rem;
            position: relative;
            overflow: hidden;
        }

        /* Animated Background Blobs */
        .blob {
            position: absolute;
            width: 500px;
            height: 500px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.4;
            z-index: -1;
            animation: float 10s infinite ease-in-out;
        }

        .blob-1 { top: -100px; left: -100px; }
        .blob-2 { bottom: -100px; right: -100px; animation-delay: 5s; background: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary)); }

        @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, 50px) scale(1.1); }
            100% { transform: translate(0, 0) scale(1); }
        }

        .hero h1 {
            font-size: 4.5rem;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            background: linear-gradient(to right, #fff, var(--text-muted));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 600px;
            margin-bottom: 2.5rem;
        }

        /* --- Projects Section --- */
        .section {
            padding: 5rem 5%;
        }

        .section-title {
            text-align: center;
            margin-bottom: 4rem;
        }

        .section-title h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .section-title p {
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto;
        }

        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }

        .card {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255,255,255,0.05);
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, transparent 50%, rgba(56, 189, 248, 0.05) 51%);
            opacity: 0;
            transition: opacity 0.4s;
            pointer-events: none;
        }

        .card:hover {
            transform: translateY(-10px);
            border-color: var(--accent-primary);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .card:hover::before {
            opacity: 1;
        }

        .card h3 {
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
        }

        .card p {
            color: var(--text-muted);
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
        }

        .card-link {
            color: var(--accent-primary);
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* --- Contact Section --- */
        .contact {
            background: linear-gradient(to bottom, var(--bg-color), #1e293b);
            text-align: center;
        }

        .contact-form {
            max-width: 600px;
            margin: 0 auto;
            text-align: left;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            background: var(--bg-color);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            color: var(--text-main);
            font-family: inherit;
            transition: 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            height: 150px;
        }

        /* --- Footer --- */
        footer {
            text-align: center;
            padding: 2rem;
            border-top: 1px solid rgba(255,255,255,0.05);
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        /* --- Mobile Responsive --- */
        @media (max-width: 768px) {
            .hero h1 { font-size: 3rem; }
            .nav-links { display: none; } /* Simplified for demo */
            .blob-1, .blob-2 { width: 300px; height: 300px; }
        }
    </style>
</head>
<body>

    <!-- Navigation -->
    <nav>
        <a href="#" class="logo">DevCrate.</a>
        <ul class="nav-links">
            <li><a href="#work">Work</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <button class="btn btn-primary">Get Started</button>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <h1>Building the Future,<br>One Line at a Time.</h1>
        <p>I am a creative full-stack developer crafting exceptional digital experiences. Join me and build something amazing.</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <a href="#work" class="btn btn-primary">View My Work</a>
            <a href="#contact" class="btn btn-primary">Contact Me</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="work" class="section">
        <div class="section-title">
            <h2>Selected Projects</h2>
            <p>A collection of creative projects I have built to demonstrate my skills.</p>
        </div>

        <div class="grid-container">
            <!-- Project 1 -->
            <div class="card">
                <h3>Neon Dashboard</h3>
                <p>A high-performance dashboard for data visualization. Features dark mode, real-time charts, and glassmorphism effects.</p>
                <a href="#" class="card-link">View Project &rarr;</a>
            </div>

            <!-- Project 2 -->
            <div class="card">
                <h3>TaskMaster App</h3>
                <p>A productivity app focused on task management with drag-and-drop functionality and local storage persistence.</p>
                <a href="#" class="card-link">View Project &rarr;</a>
            </div>

            <!-- Project 3 -->
            <div class="card">
                <h3>Weather Bot</h3>
                <p>An AI-powered weather service with location-based data and live temperature updates via API integration.</p>
                <a href="#" class="card-link">View Project &rarr;</a>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section contact">
        <div class="section-title">
            <h2>Let's Talk</h2>
            <p>Have a project in mind? I'm currently open to freelance work and open source contributions.</p>
        </div>

        <form class="contact-form">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" placeholder="John Doe">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="john@example.com">
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" placeholder="Tell me about your project..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; border-radius: 8px;">Send Message</button>
        </form>
    </section>

    <footer>
        <p>&copy; 2023 DevCrate. Built with HTML & CSS.</p>
    </footer>

</